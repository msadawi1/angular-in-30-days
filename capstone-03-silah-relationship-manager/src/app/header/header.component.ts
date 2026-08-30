import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../app.routes';

@Component({
  selector: 'header[appHeader]',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  readonly tabRoutes = routes;

  get currentRouteUrl() {
    return this.router.url;
  }

  get routes() {
    return this.router.config;
  }
}
