export type QuoteFieldSection = 'policyholder' | 'vehicle';
export type QuoteFieldType = 'text' | 'number' | 'select' | 'date' | 'checkbox';
export type QuoteValue = string | number | boolean;
export type QuoteValues = Readonly<Partial<Record<string, QuoteValue>>>;

export interface QuoteFieldOption {
  readonly value: string;
  readonly label: string;
}

export interface QuoteFieldValidation {
  readonly pattern?: RegExp;
  readonly minimumAge?: number;
  readonly vehicleYear?: boolean;
  readonly min?: number;
  readonly max?: number;
}

export interface QuoteField {
  readonly key: string;
  readonly section: QuoteFieldSection;
  readonly type: QuoteFieldType;
  readonly label: string;
  readonly required: boolean;
  readonly helpText: string;
  readonly errorMessage: string;
  readonly options: readonly QuoteFieldOption[];
  readonly validation: QuoteFieldValidation;
  readonly sensitive: boolean;
}
