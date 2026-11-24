import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getRouteMarket } from '../../../core/market/market.service';

@Component({
  selector: 'app-quote-unavailable',
  imports: [RouterLink],
  templateUrl: './quote-unavailable.html',
  styleUrl: './quote-unavailable.scss',
})
export class QuoteUnavailable {
  protected readonly market = getRouteMarket(inject(ActivatedRoute));
}
