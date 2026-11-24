import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { markets } from '../../core/market/market.config';

@Component({
  selector: 'app-market-selection',
  imports: [RouterLink],
  templateUrl: './market-selection.html',
  styleUrl: './market-selection.scss',
})
export class MarketSelection {
  protected readonly markets = Object.values(markets);
}
