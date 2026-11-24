'use strict';

const { errors: { ValidationError } } = require('@strapi/utils');

const quoteConfiguration = 'api::quote-configuration.quote-configuration';
const quotePlan = 'api::quote-plan.quote-plan';

async function validateFormOptions(configurations, where) {
  const configuration = await configurations.findOne({
    where,
    populate: { fields: { populate: ['options'] } },
  });
  const emptySelect = configuration.fields?.find((field) =>
    field.type === 'select' && !field.options?.length
  );

  if (emptySelect) {
    throw new ValidationError(`Add an option to the select field "${emptySelect.key}" before publishing.`);
  }
}

async function validateActivePlanKey(plans, where) {
  const { market, key, active, documentId } = await plans.findOne({ where });
  if (!active) {
    return;
  }

  const duplicate = await plans.findOne({
    where: { market, key, active: true, publishedAt: { $notNull: true }, documentId: { $ne: documentId } },
    select: ['id'],
  });
  if (duplicate) {
    throw new ValidationError(`An active plan with the key "${key}" is already published for ${market}.`);
  }
}

module.exports = function registerQuotePublicationValidation(strapi) {
  strapi.documents.use(async ({ uid, action, params }, next) => {
    const publishes = action === 'publish' ||
      ((action === 'create' || action === 'update') && params.status === 'published');
    if (!publishes || (uid !== quoteConfiguration && uid !== quotePlan)) {
      return next();
    }

    const publishAndValidate = async () => {
      const result = await next();
      const entry = action === 'publish' ? result.entries[0] : result;
      if (entry) {
        const documents = strapi.db.query(uid);
        const where = { documentId: entry.documentId, publishedAt: { $notNull: true } };
        if (uid === quoteConfiguration) {
          await validateFormOptions(documents, where);
        } else {
          await validateActivePlanKey(documents, where);
        }
      }
      return result;
    };

    // Validate the saved publication, including partial updates, before it can commit.
    return strapi.db.inTransaction()
      ? strapi.db.savepoint(publishAndValidate)
      : strapi.db.transaction(publishAndValidate);
  });
};
