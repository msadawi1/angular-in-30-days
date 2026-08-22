import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';

function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log("[OUTGOING REQUEST]: " + request.method + ' ' + request.url)
  return next(request)
}

bootstrapApplication(AppComponent, { providers: [provideHttpClient(
  withInterceptors([loggingInterceptor])
)] }).catch((err) =>
  console.error(err),
);
