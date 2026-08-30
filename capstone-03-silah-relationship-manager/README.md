# Capstone 03 - Notes

- Designed by Figma Make, built by me.

## Tackling

- Started with the header component, i first built the HTML structure, then only started styling.
- Started with each page, highlighted reusable components, made them rigid first for UI, then configurable for actual content display.
- Built services to handle HTTP operations and data fetching logic: parents fetch data, children take it as input. No child fetches data.

## Routing

- Angular is SPA.
- Angular uses configuration for routes.

- Routes are registered at bootstrap using DI
``` ts
// app.config.ts (standalone, Angular 19 way)
provideRouter(routes)
```

- Routing in Angular is comprised of three primary parts:
1. **Routes** define which component displays when a user visits a specific URL.
2. **Outlets** are placeholders in your templates that dynamically load and render components based on the active route.
3. **Links** provide a way for users to navigate between different routes in your application without triggering a full page reload.

### Routes

- Path matching in Angular is done using prefix matching, which means that the router checks URL elements from the left to see if the URL matches a specified path. For example, '/team/11/user' matches 'team/:id'.
- This is important because if `team/:id` is defined before `team/:id/user`, the matching will target the first.
- To prevent this, use `pathMatch: 'full'` in the route object to use full route as the matching strategy.

- Routes in Angular are objects that configure which component should be rendered for a specific URL pattern.

Basic route object:

```ts
import { AdminPage } from './app-admin';
const adminPage = {
  path: 'admin',
  component: AdminPage,
};
```

- The URL for this route is `/admin`
- The URL path here is static.

### Dynamic URLs

- You can use path variables to define dynamic URLs that display the same component with different data based on the recieved parameters.

Example

```ts
import { Routes } from '@angular/router';
import { UserProfile } from './user-profile/user-profile';
const routes: Routes = [{
    path: 'user/:id',
    component: UserProfile,
    pageTitle: 'Profile'
    }];
```

- Here, pageTitle updates the page title for the intended route.

### Redirects

You can define a route that redirects to another route instead of rendering a component:
``` ts
import {Blog} from './home/blog';
const routes: Routes = [
  {
    path: 'articles',
    redirectTo: '/blog',
  },
  {
    path: 'blog',
    component: Blog,
  },
];
```

### Steps to add basic routing:

#### 1. Define the route config array in `app.routes.ts`

``` ts
import { Routes } from '@angular/router';

exports const routes: Routes = [];
```

#### 2. Register the routes via `provideRouter` in `app.config.ts` (or inline in main.ts's bootstrap)
``` ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// this appConfig is the second argument to main.ts bootstraper
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  ]
};
```
#### 3. Add <router-outlet> to your root component's template

In app.component.html (or wherever your root template lives), place:

``` html
<router-outlet></router-outlet>
```
The matched route's component gets replaced in here.


``` typescript
// app.component.ts
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],   // <-- required or the template won't compile
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

#### 4. Populate routes

``` ts
// app.routes.ts
import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: 'about', component: AboutComponent },
];
```

- In the navigation (usually `<a>` tag), use the `routerLink` directive rather than the normal `href`, using href would replace the whole page which isn't the point.

``` html
<nav>
  <a routerLink="/about">About</a>
</nav>
```
