import { inject, Injectable, signal } from '@angular/core';
import { CadenceConfig } from '../models/cadence-config.model';
import { apiUrlToken } from '../tokens/app-config.token';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CadenceConfigService {
  private userCadenceConfig = signal<CadenceConfig | undefined>(undefined);
  private readonly API_URL = inject(apiUrlToken);
  private httpClient = inject(HttpClient);

  loadedUserCadenceConfig = this.userCadenceConfig.asReadonly();

  loadUserCadenceConfig() {
    return this.httpClient.get<CadenceConfig>(`${this.API_URL}/config/cadences`).pipe(
      tap({
        next: (cadenceConfig) => {
          return this.userCadenceConfig.set(cadenceConfig);
        },
      }),
    );
  }
}
