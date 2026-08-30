import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { apiUrlTokenProvider } from './app/core/tokens/app-config.token';
import { relationshipBaselineProvider } from './app/core/tokens/relationship-baseline.token';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { statusOptionsProvider } from './app/core/tokens/status.token';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    apiUrlTokenProvider,
    relationshipBaselineProvider,
    statusOptionsProvider
  ],
}).catch((err) => console.error(err));
