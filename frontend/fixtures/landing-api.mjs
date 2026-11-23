import { createServer } from 'node:http';

const landingByMarket = new Map([
  ['cl', {
    market: 'cl',
    headline: 'Seguro automotriz SURA',
    description: 'Cotiza un seguro para tu auto y compara las opciones disponibles en Chile.',
    publishedAt: '2026-01-01T00:00:00.000Z',
  }],
  ['co', {
    market: 'co',
    headline: 'Seguro de autos SURA',
    description: 'Cotiza un seguro para tu carro y compara las opciones disponibles en Colombia.',
    publishedAt: '2026-01-01T00:00:00.000Z',
  }],
]);

const host = '127.0.0.1';
const port = 1337;
const origin = `http://${host}:${port}`;

createServer((request, response) => {
  const url = new URL(request.url, origin);

  if (request.method !== 'GET' || url.pathname !== '/api/insurance-landings') {
    response.writeHead(404).end();
    return;
  }

  const market = url.searchParams.get('filters[market][$eq]');
  const landing = landingByMarket.get(market);
  const data = landing && url.searchParams.get('status') === 'published' ? [landing] : [];
  response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify({ data }));
}).listen(port, host, () => console.log(`Local landing fixtures at ${origin}`));
