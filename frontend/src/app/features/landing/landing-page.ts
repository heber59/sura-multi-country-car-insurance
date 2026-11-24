import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { markets } from '../../core/market/market.config';
import { getRouteMarket } from '../../core/market/market.service';
import { StrapiClient } from '../../core/strapi/strapi-client';
import { mapLandingContent } from './logic/map-landing-content';
import { LandingState } from './types/landing-content';

const marketHeroImages = {
  cl: { src: '/images/andes-drive.webp', alt: 'Auto en una carretera entre montañas' },
  co: { src: '/images/colombia-coffee.webp', alt: 'Colibrí entre cafetales y montañas de Colombia' },
};

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  protected readonly market = getRouteMarket(inject(ActivatedRoute));
  protected readonly marketOptions = Object.values(markets);
  protected readonly heroImage = marketHeroImages[this.market.code];
  protected readonly state = toSignal(
    inject(StrapiClient).getPublishedCollection('insurance-landings', this.market.code).pipe(
      map((response): LandingState => {
        const content = mapLandingContent(response, this.market.code);
        return content ? { status: 'ready', content } : { status: 'unavailable' };
      }),
      catchError(() => of<LandingState>({ status: 'unavailable' })),
    ),
    { initialValue: { status: 'loading' } satisfies LandingState },
  );
}
