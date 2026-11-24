# Car Insurance Frontend

One Angular app serves Chile and Colombia. Strapi 5 manages the published landing copy for each market.

## Run locally

Use Node.js 22.12+ in the 22.x line or Node.js 24.x, and npm 10 or later. If the repository is in WSL, use WSL terminals for both services.

1. From the repository root, install and start Strapi.

   ```sh
   npm --prefix cms ci
   npm --prefix cms run develop
   ```

   Strapi starts on port `1337` and initializes a local SQLite database with one published landing entry per market. Create a local administrator at [Strapi Admin](http://localhost:1337/admin) to edit and publish copy in the Content Manager.

2. In a second terminal at the repository root, install and start Angular.

   ```sh
   npm --prefix frontend ci
   npm --prefix frontend start
   ```

3. Open the [country selector](http://localhost:4200/), [Chile](http://localhost:4200/cl), or [Colombia](http://localhost:4200/co).

The [Angular proxy](proxy.conf.json) forwards landing requests to Strapi. If a market shows the unavailable message, check that Strapi is running and that its landing entry is published. Press Ctrl+C in each terminal to stop the services.

## Configure quotes in Strapi

Development startup seeds one published **Quote configuration** and two sample **Quote plan** entries for each market. Use Content Manager to edit the fields, select options, validation, terms, plan order, and annual prices. Mark identity fields as **Sensitive** for masking during quote review.

The read-only `GET /api/quote-configurations` endpoint requires a market filter and published status. It serves the published configuration and active published plans for that market. Editing uses the authenticated Strapi admin.

## Test and build

Run these commands from the repository root.

```sh
npm --prefix frontend test
npm --prefix frontend run build
```

The browser build is in `frontend/dist/insurance/browser/`. In production, serve the read-only Strapi landing endpoint on the frontend origin and route market URLs to Angular.
