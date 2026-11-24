import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, inject, Injector, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { getRouteMarket } from '../../core/market/market.service';
import { StrapiClient } from '../../core/strapi/strapi-client';
import { QuoteDataForm } from './data-form/quote-data-form';
import { QuoteValues } from './data-form/types/quote-field';
import { mapQuoteConfiguration } from './logic/map-quote-configuration';
import { QuotePlanList } from './plan-list/quote-plan-list';
import { QuoteUnavailable } from './quote-unavailable/quote-unavailable';
import { QuoteSummary } from './summary/quote-summary';
import { QuoteDraft, readQuoteDraft, saveQuoteDraft } from './wizard-state';

type WizardStep = 'details' | 'plans' | 'summary';

@Component({
  selector: 'app-quote-wizard',
  imports: [RouterLink, QuoteDataForm, QuotePlanList, QuoteSummary, QuoteUnavailable],
  templateUrl: './quote-wizard.html',
  styleUrl: './quote-wizard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteWizard {
  protected readonly market = getRouteMarket(inject(ActivatedRoute));
  protected readonly draft = signal(readQuoteDraft(this.market.code));
  protected readonly step = signal<WizardStep>('details');
  protected readonly content = toSignal(
    inject(StrapiClient).getPublishedCollection('quote-configurations', this.market.code).pipe(
      map((response) => mapQuoteConfiguration(response, this.market.code)),
      catchError(() => of(null)),
    ),
  );
  protected readonly plan = computed(() =>
    this.content()?.plans.find(({ key }) => key === this.draft().planKey),
  );

  private readonly injector = inject(Injector);
  private readonly stepHeading = viewChild<ElementRef<HTMLElement>>('stepHeading');

  protected completeDetails(values: QuoteValues): void {
    this.updateDraft({ ...this.draft(), values });
    this.goTo('plans');
  }

  protected choosePlan(planKey: string): void {
    this.updateDraft({ ...this.draft(), planKey });
  }

  protected goTo(step: WizardStep): void {
    this.step.set(step);
    this.focusHeading();
  }

  protected confirmPayment(): void {
    if (this.draft().reference) {
      return;
    }

    const id = Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('').toUpperCase();
    this.updateDraft({
      values: {},
      planKey: null,
      reference: `${this.market.code.toUpperCase()}-${id}`,
    });
    this.focusHeading();
  }

  protected startNewQuote(): void {
    this.updateDraft({ values: {}, planKey: null, reference: null });
    this.goTo('details');
  }

  private updateDraft(draft: QuoteDraft): void {
    this.draft.set(draft);
    saveQuoteDraft(this.market.code, draft);
  }

  private focusHeading(): void {
    afterNextRender(() => this.stepHeading()?.nativeElement.focus(), { injector: this.injector });
  }
}
