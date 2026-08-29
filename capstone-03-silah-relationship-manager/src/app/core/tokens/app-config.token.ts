import { InjectionToken, Provider } from '@angular/core';

const API_URL = 'http://localhost:3000/api'

export const apiUrlToken = new InjectionToken<string>('api.url');

export const apiUrlTokenProvider: Provider = {
  provide: apiUrlToken,
  useValue: API_URL,
};
