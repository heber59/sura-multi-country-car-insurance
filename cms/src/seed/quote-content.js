'use strict';

function policyholderFields(document, age) {
  return [
    {
      key: 'fullName', section: 'policyholder', type: 'text', label: 'Nombre completo', required: true,
      helpText: 'Ingresa un nombre ficticio para esta demostración.',
      errorMessage: 'Ingresa el nombre completo.',
    },
    {
      key: 'document', section: 'policyholder', type: 'text', required: true, sensitive: true,
      ...document,
    },
    {
      key: 'birthDate', section: 'policyholder', type: 'date', label: 'Fecha de nacimiento', required: true,
      minimumAge: age,
      errorMessage: `Ingresa una fecha válida. Debes tener al menos ${age} años.`,
    },
    {
      key: 'email', section: 'policyholder', type: 'text', label: 'Correo electrónico', required: true,
      pattern: String.raw`^[^\s@]+@[^\s@]+\.[^\s@]+$`,
      helpText: 'Usa una dirección de ejemplo, como conductor@example.com.',
      errorMessage: 'Ingresa un correo electrónico válido.',
    },
  ];
}

function vehicleFields(plate, types) {
  return [
    {
      key: 'vehicleType', section: 'vehicle', type: 'select', label: 'Tipo de vehículo', required: true,
      options: [{ value: 'car', label: 'Automóvil' }, { value: 'pickup', label: 'Camioneta' }, ...types],
      errorMessage: 'Selecciona un tipo de vehículo.',
    },
    {
      key: 'make', section: 'vehicle', type: 'text', label: 'Marca', required: true,
      errorMessage: 'Ingresa la marca del vehículo.',
    },
    {
      key: 'model', section: 'vehicle', type: 'text', label: 'Modelo', required: true,
      errorMessage: 'Ingresa el modelo del vehículo.',
    },
    {
      key: 'year', section: 'vehicle', type: 'number', label: 'Año del vehículo', required: true,
      vehicleYear: true,
      helpText: 'Desde 20 años antes del año actual hasta el próximo año.',
      errorMessage: 'Ingresa un año de fabricación dentro del rango indicado.',
    },
    {
      key: 'plate', section: 'vehicle', type: 'text', required: true,
      ...plate,
    },
    {
      key: 'alarm', section: 'vehicle', type: 'checkbox', label: 'El vehículo tiene alarma', required: false,
      errorMessage: 'Confirma si el vehículo tiene alarma.',
    },
  ];
}

const configurations = [
  {
    market: 'cl',
    fields: [
      ...policyholderFields({
        label: 'RUT',
        pattern: '^[0-9]{7,8}-[0-9kK]$',
        helpText: 'Usa un RUT ficticio sin puntos, como 12345678-5.',
        errorMessage: 'Ingresa el RUT sin puntos y con guion.',
      }, 18),
      ...vehicleFields({
        label: 'Patente',
        pattern: '^([A-Za-z]{4}[0-9]{2}|[A-Za-z]{2}[0-9]{4})$',
        helpText: 'Usa una patente ficticia, como ZZZZ99.',
        errorMessage: 'Ingresa una patente válida sin espacios ni guiones.',
      }, [{ value: 'suv', label: 'SUV' }, { value: 'van', label: 'Furgón' }]),
    ],
    terms: 'Esta cotización para Chile es una demostración. Usa datos ficticios. El pago simulado no genera un cobro ni activa una póliza.',
  },
  {
    market: 'co',
    fields: [
      ...policyholderFields({
        label: 'Cédula de ciudadanía',
        pattern: '^[0-9]{6,10}$',
        helpText: 'Usa un número ficticio, como 9990001234.',
        errorMessage: 'Ingresa entre 6 y 10 dígitos, sin puntos ni espacios.',
      }, 18),
      ...vehicleFields({
        label: 'Placa',
        pattern: '^[A-Za-z]{3}[0-9]{3}$',
        helpText: 'Usa una placa ficticia, como ZZZ999.',
        errorMessage: 'Ingresa tres letras y tres números sin espacios ni guiones.',
      }, [{ value: 'off-road', label: 'Campero' }, { value: 'van', label: 'Microbús' }]),
    ],
    terms: 'Esta cotización para Colombia es una demostración. Usa datos ficticios. El pago simulado no genera un cobro ni activa una póliza.',
  },
];

const plans = [
  {
    market: 'cl', key: 'esencial', position: 1, name: 'Esencial', price: 189900,
    description: 'Cobertura para imprevistos en tus trayectos diarios.',
    coverages: 'Responsabilidad civil\nPérdida total por robo',
    benefits: 'Servicio de grúa\nAsistencia en ruta',
    active: true, recommended: false,
  },
  {
    market: 'cl', key: 'amplio', position: 2, name: 'Protección ampliada', price: 269900,
    description: 'Suma cobertura para los daños que pueda sufrir tu auto.',
    coverages: 'Responsabilidad civil\nRobo y daños al vehículo',
    benefits: 'Asistencia en ruta\nAuto de reemplazo',
    active: true, recommended: true,
  },
  {
    market: 'co', key: 'basico', position: 1, name: 'Protección básica', price: 689000,
    description: 'Cobertura para los imprevistos más comunes al conducir.',
    coverages: 'Responsabilidad civil extracontractual\nPérdida total por hurto',
    benefits: 'Servicio de grúa\nAsistencia vial',
    active: true, recommended: false,
  },
  {
    market: 'co', key: 'amplio', position: 2, name: 'Protección completa', price: 989000,
    description: 'Amplía la cobertura frente a daños y hurto de tu carro.',
    coverages: 'Responsabilidad civil extracontractual\nDaños y hurto del vehículo',
    benefits: 'Asistencia vial\nVehículo de reemplazo',
    active: true, recommended: true,
  },
];

async function createMissingDocuments(documents, entries, identity) {
  for (const data of entries) {
    const filters = identity(data);
    const draft = await documents.findFirst({ status: 'draft', filters });
    const published = await documents.findFirst({ status: 'published', filters });
    if (!draft && !published) {
      await documents.create({ status: 'published', data });
    }
  }
}

module.exports = async function seedQuoteContent(strapi) {
  if (!strapi.config.get('quote.seedDevelopmentContent')) {
    return;
  }

  const seedState = strapi.store({ type: 'core', name: 'insurance-quotes' });
  const quoteConfigurations = strapi.documents('api::quote-configuration.quote-configuration');
  const quotePlans = strapi.documents('api::quote-plan.quote-plan');

  await strapi.db.transaction(async () => {
    if (await seedState.get({ key: 'initialized' })) {
      return;
    }

    await createMissingDocuments(quoteConfigurations, configurations, ({ market }) => ({ market }));
    await createMissingDocuments(quotePlans, plans, ({ market, key }) => ({ market, key }));
    await seedState.set({ key: 'initialized', value: true });
  });
};
