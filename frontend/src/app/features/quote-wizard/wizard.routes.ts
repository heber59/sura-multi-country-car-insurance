import { Routes } from '@angular/router';
import { QuoteWizard } from './quote-wizard';

export const wizardRoutes: Routes = [
  { path: '', pathMatch: 'full', title: 'Cotización de seguro de auto', component: QuoteWizard },
];
