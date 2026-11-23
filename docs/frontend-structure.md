# Frontend folder structure

Use one Angular application with standalone components, feature routes, and SCSS. Start with project styles and shared UI components.

```text
frontend/
├── e2e/                            Full wizard browser tests
└── src/app/
    ├── core/
    │   ├── market/
    │   │   ├── market.types.ts
    │   │   ├── market.config.ts
    │   │   └── market.service.ts
    │   └── strapi/                  Shared HTTP client and transport types
    ├── features/
    │   └── quote-wizard/
    │       ├── wizard.routes.ts
    │       ├── wizard-state.ts
    │       ├── data-form/
    │       │   ├── components/
    │       │   │   └── dynamic-form/
    │       │   ├── logic/
    │       │   │   ├── form-builder.ts
    │       │   │   └── strategies/
    │       │   │       ├── market-form-strategy.ts
    │       │   │       ├── co-form.strategy.ts
    │       │   │       ├── cl-form.strategy.ts
    │       │   │       └── form-strategies.ts
    │       │   └── types/
    │       ├── plan-list/
    │       └── summary/
    └── shared/
        └── ui/
cms/                                 Strapi schemas and market seed data
```

Keep each component’s template, styles, and TypeScript together. Components handle view bindings. Put testable rules and response mapping in each step’s `logic/`, and contracts in `types/`. Apply the same layout to plans and summary as files are needed. Keep unit tests next to the code they cover.

## Market behavior

Follow [ADR 001](adr/001-country-content.md). Resolve `co` or `cl` from the route in `core/market/`, where locale and currency are set. Scope wizard state to the active market.

Strapi defines fields, order, labels, and validation configuration, plus plans and terms. The shared form renderer selects controls by field type. The form builder uses a typed registry keyed by `co` and `cl` for market-specific behavior, such as a RUT validator when configured. Both strategies reuse common rules. Keep HTTP requests in the Strapi client and market-specific form behavior in the feature.

## Naming and typing

- Use `camelCase` for variables, functions, methods, and properties, and `PascalCase` for components, classes, interfaces, and type aliases. Use `kebab-case` for Angular file and folder names.
- Enable TypeScript `strict` and Angular `strictTemplates`. Type function parameters, return values, and public contracts. Avoid `any` and validate external data received as `unknown`.
- Define object contracts as interfaces in the owning feature’s `types/` folder. Keep shared transport interfaces in `core/strapi/types/`. Use type aliases for unions such as the market code.
