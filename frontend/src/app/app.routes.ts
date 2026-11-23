import { Route, Routes } from '@angular/router';
import { markets } from './core/market/market.config';

const marketRoutes: Routes = Object.values(markets).map(({ code, name }): Route => ({
  path: code,
  title: `Seguro de auto | ${name}`,
  data: { market: code },
  children: [
    {
      path: 'cotizar',
      loadChildren: () => import('./features/quote-wizard/wizard.routes').then((module) => module.wizardRoutes),
    },
    {
      path: '',
      pathMatch: 'full',
      loadChildren: () => import('./features/landing/landing.routes').then((module) => module.landingRoutes),
    },
  ],
}));

export const routes: Routes = [
  ...marketRoutes,
  {
    path: '',
    pathMatch: 'full',
    title: 'Seguro de auto',
    loadComponent: () => import('./features/market-selection/market-selection').then((module) => module.MarketSelection),
  },
  { path: '**', redirectTo: '' },
];
