import { Routes } from '@angular/router';
import { QuoteUnavailable } from './quote-unavailable/quote-unavailable';

export const wizardRoutes: Routes = [
  { path: '', pathMatch: 'full', title: 'Cotización de seguro de auto', component: QuoteUnavailable },
];
