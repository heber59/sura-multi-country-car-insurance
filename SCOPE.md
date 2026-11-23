# Functional scope

The car insurance wizard has at least three steps. Justify any additional steps.

| Step | Screen | What it must do |
| --- | --- | --- |
| 1 | Data form | Collect policyholder and vehicle data. Strapi defines the fields, types, validation rules, copy, and field order for each country. |
| 2 | Plan list | Show plans for the selected country with prices, coverages, and benefits configured in Strapi. Let the user select one plan. |
| 3 | Summary and payment | Show the entered data and selected plan, and offer the option to pay. |

## Scope rules

- Serve Colombia and Chile with the same application and build.
- Reflect Strapi changes to form fields and plans without code changes.
- Price calculations may be simulated.
- Simulate payment with a button that opens a confirmation screen or mock gateway. Exclude real payment gateways and real card data.
- Use fictitious data only.
- Persist wizard data in the frontend. A database is optional for wizard data.
