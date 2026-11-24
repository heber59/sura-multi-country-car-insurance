import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MarketCode } from '../market/market.config';

@Injectable({ providedIn: 'root' })
export class StrapiClient {
  private readonly http = inject(HttpClient);

  getPublishedCollection(collection: string, market: MarketCode): Observable<unknown> {
    const params = new HttpParams()
      .set('filters[market][$eq]', market)
      .set('status', 'published');

    return this.http.get<unknown>(`/api/${collection}`, { params });
  }
}
