import { InjectionToken, Provider } from '@angular/core';

const API_URL = 'http://angular-in-30-days-production.up.railway.app/api'

export const apiUrlToken = new InjectionToken<string>('api.url');

export const apiUrlTokenProvider: Provider = {
  provide: apiUrlToken,
  useValue: API_URL,
};
