# SURA Car Insurance Frontend

This Angular app serves the car insurance landing page for Chile and Colombia.

## Prerequisites

Install Node.js and npm. Use Node.js 20.19+, 22.12+, or 24.x within the corresponding major version. If your checkout is in WSL, run the commands in a WSL terminal.

## Run locally with sample content

1. From the repository root, install dependencies and start the fixture API. Keep this terminal open.

   ```sh
   cd frontend
   npm ci
   node fixtures/landing-api.mjs
   ```

2. In a second terminal at the repository root, start Angular.

   ```sh
   cd frontend
   npm start
   ```

3. Open the [country selector](http://localhost:4200/), [Chile](http://localhost:4200/cl), or [Colombia](http://localhost:4200/co).

The fixture API serves sample content for both markets on port `1337`. If the landing page says the content is unavailable, check that the fixture API is running and that port `1337` is free before starting it. Use `Ctrl+C` in each terminal to stop both processes.

## Run with Strapi 5

Stop the fixture API and run your Strapi instance on port `1337`. Create the `insurance-landings` collection with Draft & Publish enabled. Add and publish one entry per market with `market` (`cl` or `co`), `headline`, and `description` fields.

The [Angular proxy](proxy.conf.json) forwards requests to `/api/insurance-landings` during local development. For anonymous local testing, enable the collection's `find` permission. In production, serve the endpoint on the frontend origin, enforce published content and supported markets on the server, and route market URLs to Angular.

## Test and build

Run these commands from `frontend/`.

```sh
npm test
npm run build
```

The production build writes the browser files to `dist/insurance/browser/`.
