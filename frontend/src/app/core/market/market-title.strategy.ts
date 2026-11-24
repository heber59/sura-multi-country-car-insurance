import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PRIMARY_OUTLET, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { findRouteMarket } from './market.service';

@Injectable()
export class MarketTitleStrategy extends TitleStrategy {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    let primaryChild = route.children.find((child) => child.outlet === PRIMARY_OUTLET);

    while (primaryChild) {
      route = primaryChild;
      primaryChild = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
    }

    this.document.documentElement.lang = findRouteMarket(route)?.locale ?? 'es';
    this.title.setTitle(this.buildTitle(snapshot) ?? 'Seguro de auto');
  }
}
