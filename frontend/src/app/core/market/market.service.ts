import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { markets } from './market.config';
import { Market } from './market.types';

export function findRouteMarket(route: ActivatedRouteSnapshot): Market | undefined {
  const declaredMarket: unknown = route.data['market'];

  if (declaredMarket === 'cl' || declaredMarket === 'co') {
    return markets[declaredMarket];
  }

  return route.parent ? findRouteMarket(route.parent) : undefined;
}

export function getRouteMarket(route: ActivatedRoute): Market {
  const market = findRouteMarket(route.snapshot);

  if (!market) {
    throw new Error('The active route does not declare a supported market.');
  }

  return market;
}
