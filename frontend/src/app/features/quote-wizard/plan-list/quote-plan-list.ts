import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Market } from '../../../core/market/market.types';
import { formatQuotePrice } from '../logic/quote-price';
import { QuotePlan } from '../types/quote-configuration';

@Component({
  selector: 'app-quote-plan-list',
  templateUrl: './quote-plan-list.html',
  styleUrl: './quote-plan-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotePlanList {
  readonly market = input.required<Market>();
  readonly plans = input.required<readonly QuotePlan[]>();
  readonly selectedKey = input.required<string>();
  readonly selected = output<string>();
  readonly back = output<void>();
  readonly next = output<void>();

  protected readonly formatPrice = formatQuotePrice;
}
