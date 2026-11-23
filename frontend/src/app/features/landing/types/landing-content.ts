export interface LandingContent {
  readonly headline: string;
  readonly description: string;
}

export type LandingState =
  | { readonly status: 'loading' }
  | { readonly status: 'unavailable' }
  | { readonly status: 'ready'; readonly content: LandingContent };
