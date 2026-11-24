# Car Insurance Frontend

One Angular app serves Chile and Colombia. Strapi 5 manages each market’s landing, quote form, plans, and terms.

## Run locally

Use Node.js 22.12+ in the 22.x line or Node.js 24.x, and npm 10 or later. If the repository is in WSL, run the command from a WSL terminal.

From the repository root, run one command to install dependencies from the lockfiles and start Strapi and Angular.

```sh
npm start
```

Set `FRONTEND_PORT` and `PORT` before startup to use different Angular and Strapi ports.

Strapi starts on port `1337` and seeds a local SQLite database with one published landing, one quote configuration, and two sample plans per market. The database persists across restarts.

Once both services are ready, open the [country selector](http://localhost:4200/) or go directly to the quote for [Chile](http://localhost:4200/cl/cotizar) or [Colombia](http://localhost:4200/co/cotizar). Use fictitious details to complete the form, choose a plan, and simulate payment. The [Angular proxy](proxy.conf.cjs) uses Strapi's `HOST` and `PORT` from the shell or `cms/.env`. Press Ctrl+C to stop both services.

## Edit market content

Create a local administrator in [Strapi Admin](http://localhost:1337/admin) and open Content Manager. Keep one published **Quote configuration** per market. Add or reorder its form fields and select options, configure validation, and edit the terms. Mark identity fields as **Sensitive** to mask them in the review step. In **Quote plan**, set the market, unique plan key within that market, position, annual price in the local currency, and one coverage or benefit per line. Publish the changes and reload the quote to see them. Plans must be active and published to appear.

## Test and build

Run these commands from the repository root.

```sh
npm --prefix frontend test
npm --prefix frontend run build
```

With both services running, install Chromium with `npm --prefix frontend exec -- playwright install chromium`, then run `npm --prefix frontend run test:e2e`. Set `QUOTE_TEST_URL` to test a frontend on a different port.

The browser build is in `frontend/dist/insurance/browser/`. In production, serve Strapi’s `GET /api/insurance-landings` and `GET /api/quote-configurations` on the frontend origin and route market URLs to Angular. These public endpoints expose published content for the requested supported market. Editing uses the authenticated Strapi admin, and the browser needs no content API token.
