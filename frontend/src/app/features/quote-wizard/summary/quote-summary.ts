import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { Market } from '../../../core/market/market.types';
import { getQuoteValue } from '../data-form/logic/validate-quote-values';
import { QuoteField, QuoteValues } from '../data-form/types/quote-field';
import { formatQuotePrice } from '../logic/quote-price';
import { QuotePlan } from '../types/quote-configuration';

type PaymentStatus = 'ready' | 'processing' | 'rejected' | 'confirmed';

@Component({
  selector: 'app-quote-summary',
  templateUrl: './quote-summary.html',
  styleUrl: './quote-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteSummary {
  readonly market = input.required<Market>();
  readonly fields = input.required<readonly QuoteField[]>();
  readonly values = input.required<QuoteValues>();
  readonly plan = input.required<QuotePlan>();
  readonly terms = input.required<string | null>();
  readonly editDetails = output<void>();
  readonly editPlan = output<void>();
  readonly confirmed = output<void>();

  protected readonly accepted = signal(false);
  protected readonly simulateRejection = signal(false);
  protected readonly status = signal<PaymentStatus>('ready');
  protected readonly sections = [
    { key: 'policyholder', label: 'Datos del titular' },
    { key: 'vehicle', label: 'Datos del vehículo' },
  ] as const;
  protected readonly formatPrice = formatQuotePrice;
  private readonly destroyRef = inject(DestroyRef);

  protected displayValue(field: QuoteField): string {
    const value = getQuoteValue(this.values(), field.key);

    if (value === undefined || value === '') {
      return 'Sin informar';
    }

    if (field.sensitive) {
      const documentNumber = String(value);
      const visibleLength = Math.min(3, documentNumber.length - 1);
      return '••••' + documentNumber.slice(documentNumber.length - visibleLength);
    }

    if (field.type === 'select') {
      return field.options.find((option) => option.value === value)?.label ?? 'Sin informar';
    }

    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }

    if (field.type === 'date' && typeof value === 'string') {
      return new Intl.DateTimeFormat(this.market().locale, { timeZone: 'UTC' }).format(new Date(value));
    }

    return String(value);
  }

  protected pay(): void {
    if (!this.terms() || !this.accepted() || this.status() === 'processing' || this.status() === 'confirmed') {
      return;
    }

    const rejected = this.simulateRejection();
    this.status.set('processing');
    timer(600).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (rejected) {
        this.status.set('rejected');
        this.simulateRejection.set(false);
        return;
      }

      this.status.set('confirmed');
      this.confirmed.emit();
    });
  }
}
