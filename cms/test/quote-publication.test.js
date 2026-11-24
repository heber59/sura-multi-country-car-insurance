'use strict';

const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { after, before, test } = require('node:test');
const { createStrapi } = require('@strapi/strapi');
const { errors: { ValidationError } } = require('@strapi/utils');

const configurationUid = 'api::quote-configuration.quote-configuration';
const planUid = 'api::quote-plan.quote-plan';
let directory;
let app;

before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'sura-quote-publication-'));
  Object.assign(process.env, {
    DATABASE_FILENAME: join(directory, 'test.db'),
    NODE_ENV: 'development',
    SEED_INSURANCE_QUOTES: 'true',
    APP_KEYS: 'quote-publication-test-keys',
    ADMIN_JWT_SECRET: 'quote-publication-test-admin',
    API_TOKEN_SALT: 'quote-publication-test-api',
    TRANSFER_TOKEN_SALT: 'quote-publication-test-transfer',
    ENCRYPTION_KEY: 'quote-publication-test-encryption',
  });
  app = createStrapi();
  await app.load();
});

after(async () => {
  try {
    await app?.destroy();
  } finally {
    if (directory) {
      await rm(directory, { recursive: true, force: true });
    }
  }
});

async function publishedQuote(market) {
  const ctx = { query: { status: 'published', filters: { market: { $eq: market } } } };
  await app.controller(configurationUid).findPublished(ctx);
  assert.equal(ctx.body.data.length, 1);
  return ctx.body.data[0];
}

test('rejects an empty select and keeps the previous market form live', async () => {
  const configurations = app.documents(configurationUid);
  const chile = await publishedQuote('cl');
  const colombia = await publishedQuote('co');
  const { documentId, fields } = await configurations.findFirst({
    status: 'draft', filters: { market: 'cl' }, populate: ['fields'],
  });
  const existingFields = fields.map(({ id }) => ({ id }));
  const newField = {
    key: 'vehicleUse', section: 'vehicle', type: 'select', label: 'Uso del vehículo',
    required: true, errorMessage: 'Elige el uso del vehículo.',
  };
  const invalidField = { ...newField, options: [] };
  const emptySelectError = { name: ValidationError.name, message: /select field "vehicleUse"/ };

  await assert.rejects(configurations.create({
    status: 'published', data: { market: 'cl', fields: [invalidField] },
  }), emptySelectError);
  assert.equal(await configurations.count({ status: 'draft', filters: { market: 'cl' } }), 1);

  await configurations.update({ documentId, data: { fields: [...existingFields, invalidField] } });
  await app.db.transaction(async () => {
    await assert.rejects(configurations.publish({ documentId }), emptySelectError);
  });
  await assert.rejects(configurations.update({
    documentId, status: 'published', data: { terms: 'Estas condiciones deben quedar sin publicar.' },
  }), emptySelectError);
  assert.deepEqual(await publishedQuote('cl'), chile);
  assert.deepEqual(await publishedQuote('co'), colombia);

  const options = [{ value: 'personal', label: 'Personal' }];
  await configurations.update({
    documentId,
    status: 'published',
    data: { fields: [...existingFields, { ...newField, options }] },
  });
  const published = await publishedQuote('cl');
  assert.deepEqual(published.fields.slice(0, -1), chile.fields);
  assert.equal(published.fields.at(-1).key, newField.key);
  assert.deepEqual(published.fields.at(-1).options, options);
});

test('checks active plan keys among published plans in the same market', async () => {
  const plans = app.documents(planUid);
  const chile = await publishedQuote('cl');
  const colombia = await publishedQuote('co');
  assert.ok(chile.plans.some(({ key }) => key === 'amplio'));
  assert.ok(colombia.plans.some(({ key }) => key === 'amplio'));

  const data = {
    market: 'co', key: 'amplio', position: 3, name: 'Plan de prueba',
    description: 'Descripción de prueba', price: 100, coverages: 'Cobertura de prueba',
    benefits: 'Beneficio de prueba', active: true,
  };
  const duplicateError = { name: ValidationError.name, message: /key "amplio" is already published for co/ };
  const { documentId } = await plans.create({ data });
  await assert.rejects(plans.publish({ documentId }), duplicateError);
  await plans.update({ documentId, status: 'published', data: { active: false } });
  await assert.rejects(plans.update({ documentId, status: 'published', data: { active: true } }), duplicateError);
  assert.equal((await plans.findOne({ documentId, status: 'published' })).active, false);
  assert.deepEqual(await publishedQuote('co'), colombia);
  assert.deepEqual(await publishedQuote('cl'), chile);

  const newPlan = { ...data, key: 'familiar' };
  const attempts = await Promise.allSettled([
    plans.create({ status: 'published', data: newPlan }),
    plans.create({ status: 'published', data: newPlan }),
  ]);
  assert.deepEqual(attempts.map(({ status }) => status).sort(), ['fulfilled', 'rejected']);
  assert.ok(attempts.find(({ status }) => status === 'rejected').reason instanceof ValidationError);
  assert.equal(await plans.count({ status: 'draft', filters: { market: 'co', key: 'familiar' } }), 1);
  assert.deepEqual((await publishedQuote('co')).plans.map(({ key }) => key), [
    ...colombia.plans.map(({ key }) => key), 'familiar',
  ]);
});
