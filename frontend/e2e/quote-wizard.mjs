import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.QUOTE_TEST_URL ?? 'http://localhost:4200';
const quoteHeading = 'Cotiza tu seguro de auto';
const planHeading = 'Elige tu plan';
const summaryHeading = 'Revisa tu cotización';

function heading(page, name) {
  return page.getByRole('heading', { name, exact: true });
}

function button(page, name) {
  return page.getByRole('button', { name, exact: true });
}

async function openQuote(page, market) {
  await page.goto(new URL('/' + market, baseUrl).href);
  await page.getByRole('link', { name: 'Cotizar', exact: true }).click();
  await page.waitForURL('**/' + market + '/cotizar');
  await page.getByLabel('Nombre completo').waitFor();
}

async function fillQuote(page, { name, documentLabel, documentNumber, plateLabel, plate, vehicleType }) {
  await page.getByLabel('Nombre completo').fill(name);
  await page.getByLabel(documentLabel, { exact: true }).fill(documentNumber);
  await page.getByLabel('Fecha de nacimiento').fill('1990-05-14');
  await page.getByLabel('Correo electrónico').fill('conductor@example.com');
  await page.getByLabel('Tipo de vehículo').selectOption(vehicleType);
  await page.getByLabel('Marca', { exact: true }).fill('Marca de prueba');
  await page.getByLabel('Modelo', { exact: true }).fill('Modelo de prueba');
  await page.getByLabel('Año del vehículo').fill(String(new Date().getFullYear() - 2));
  await page.getByLabel(plateLabel, { exact: true }).fill(plate);
  await page.getByLabel('El vehículo tiene alarma').check();
}

async function choosePlan(page, plan) {
  await page.getByRole('radio', { name: 'Elegir ' + plan, exact: true }).check();
  await button(page, 'Revisar cotización').click();
  await heading(page, summaryHeading).waitFor();
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await openQuote(page, 'cl');
  assert.equal(await page.locator('html').getAttribute('lang'), 'es-CL');
  assert.equal(await page.getByLabel('Cédula de ciudadanía').count(), 0);
  await button(page, 'Continuar a planes').click();
  await page.getByText('Ingresa el nombre completo.', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Nombre completo').getAttribute('aria-invalid'), 'true');

  await fillQuote(page, {
    name: 'Conductora de prueba', documentLabel: 'RUT', documentNumber: '12345678-5',
    plateLabel: 'Patente', plate: 'ZZZZ99', vehicleType: 'suv',
  });
  await button(page, 'Continuar a planes').click();
  await heading(page, planHeading).waitFor();
  assert.ok(await button(page, 'Revisar cotización').isDisabled());
  await page.getByRole('radio', { name: 'Elegir Esencial', exact: true }).check();
  await button(page, 'Volver a tus datos').click();
  await heading(page, quoteHeading).waitFor();
  assert.equal(await page.getByLabel('Nombre completo').inputValue(), 'Conductora de prueba');
  assert.equal(await page.getByLabel('Tipo de vehículo').inputValue(), 'suv');

  await button(page, 'Continuar a planes').click();
  assert.ok(await page.getByRole('radio', { name: 'Elegir Esencial', exact: true }).isChecked());
  await choosePlan(page, 'Protección ampliada');
  const summary = await page.locator('main').innerText();
  assert.match(summary, /CLP/);
  assert.match(summary, /••••8-5/);
  assert.doesNotMatch(summary, /12345678-5/);
  await page.getByText('Términos y condiciones de Chile', { exact: true }).click();
  await page.getByText(/Esta cotización para Chile/).waitFor();

  const pay = button(page, 'Simular pago');
  assert.ok(await pay.isDisabled());
  await page.getByLabel('Acepto los términos y condiciones.').check();
  await page.getByLabel('Simular un rechazo en el próximo intento.').check();
  await pay.click();
  await page.getByText('Procesando el pago simulado…', { exact: true }).waitFor();
  assert.ok(await pay.isDisabled());
  await page.getByRole('alert').filter({ hasText: 'El pago simulado fue rechazado' }).waitFor();
  assert.equal(await page.getByText('Conductora de prueba', { exact: true }).count(), 1);
  assert.equal(await page.getByText('Protección ampliada', { exact: true }).count(), 1);
  await button(page, 'Reintentar pago simulado').click();
  await heading(page, 'Pago simulado confirmado').waitFor();
  const reference = await page.getByText(/^CL-[0-9A-F]{12}$/).innerText();
  await page.reload();
  await page.getByText(reference, { exact: true }).waitFor();
  assert.equal(await pay.count(), 0);

  await page.setViewportSize({ width: 320, height: 800 });
  await openQuote(page, 'co');
  assert.equal(await page.locator('html').getAttribute('lang'), 'es-CO');
  assert.equal(await page.getByLabel('Nombre completo').inputValue(), '');
  assert.equal(await page.getByLabel('RUT', { exact: true }).count(), 0);
  await fillQuote(page, {
    name: 'Conductor de prueba', documentLabel: 'Cédula de ciudadanía', documentNumber: '9990001234',
    plateLabel: 'Placa', plate: 'ZZZ999', vehicleType: 'off-road',
  });
  await button(page, 'Continuar a planes').click();
  assert.equal(await page.getByRole('radio', { name: 'Elegir Esencial', exact: true }).count(), 0);
  await choosePlan(page, 'Protección básica');
  assert.match(await page.locator('main').innerText(), /COP/);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));

  const quoteApi = '**/api/quote-configurations?**';
  await page.route(quoteApi, async (route) => {
    const response = await route.fetch();
    const configuration = await response.json();
    configuration.data[0].plans = [];
    await route.fulfill({ response, json: configuration });
  });
  await page.reload();
  await button(page, 'Continuar a planes').click();
  await page.getByText(/No hay planes disponibles para Colombia/).waitFor();
  assert.ok(await button(page, 'Revisar cotización').isDisabled());
  await page.unroute(quoteApi);

  await page.route(quoteApi, async (route) => {
    const response = await route.fetch();
    const configuration = await response.json();
    configuration.data[0].terms = null;
    configuration.data[0].fields.push({
      key: 'testField', section: 'vehicle', type: 'text', label: 'Dato de prueba',
      required: true, helpText: '', errorMessage: 'Completa el dato de prueba.',
    });
    await route.fulfill({ response, json: configuration });
  });
  await page.reload();
  assert.equal(await page.getByLabel('Nombre completo').inputValue(), 'Conductor de prueba');
  await button(page, 'Continuar a planes').click();
  await page.getByText('Completa el dato de prueba.', { exact: true }).waitFor();
  await page.getByLabel('Dato de prueba').fill('Configuración publicada de prueba');
  await button(page, 'Continuar a planes').click();
  await choosePlan(page, 'Protección básica');
  assert.ok(await pay.isDisabled());
  await page.getByText(/Los términos y condiciones no están disponibles/).waitFor();

  await page.unroute(quoteApi);
  await page.route(quoteApi, (route) => route.fulfill({ json: { data: [] } }));
  await page.reload();
  await heading(page, 'Cotización no disponible').waitFor();
  await page.unroute(quoteApi);

  await page.reload();
  await button(page, 'Continuar a planes').click();
  await choosePlan(page, 'Protección básica');
  await page.getByLabel('Acepto los términos y condiciones.').check();
  await pay.click();
  await page.getByText(/^CO-[0-9A-F]{12}$/).waitFor();

  await page.goto(new URL('/cl/cotizar', baseUrl).href);
  await page.getByText(reference, { exact: true }).waitFor();
  await button(page, 'Nueva cotización').click();
  assert.equal(await page.getByLabel('Nombre completo').inputValue(), '');
  assert.deepEqual(errors, []);
  console.log('Quote wizard passed in Chromium for Chile and Colombia.');
} finally {
  await browser.close();
}
