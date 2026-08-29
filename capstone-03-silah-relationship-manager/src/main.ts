import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { apiUrlTokenProvider } from './app/core/tokens/app-config.token';
import { relationshipBaselineProvider } from './app/core/tokens/relationship-baseline.token';

bootstrapApplication(AppComponent, { providers: [provideHttpClient(), apiUrlTokenProvider, relationshipBaselineProvider] }).catch((err) =>
  console.error(err),
);
