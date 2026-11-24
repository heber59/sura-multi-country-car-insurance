import { QuoteField } from '../data-form/types/quote-field';

export interface QuotePlan {
  key: string;
  name: string;
  description: string;
  price: number;
  coverages: string[];
  benefits: string[];
  recommended: boolean;
}

export interface QuoteConfiguration {
  fields: QuoteField[];
  plans: QuotePlan[];
  terms: string | null;
}
