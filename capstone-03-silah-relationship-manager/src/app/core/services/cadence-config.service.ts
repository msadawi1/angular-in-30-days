import { inject, Injectable, signal } from '@angular/core';
import { CadenceConfig } from '../models/cadence-config.model';
import { apiUrlToken } from '../tokens/app-config.token';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Relationship } from '../models/relationship.model';
import { relationshipBaselineToken } from '../tokens/relationship-baseline.token';

export type UpdateCadenceBody = {
  overrides: Record<Relationship, number>;
  applyToExisting: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class CadenceConfigService {
  private userCadenceConfig = signal<CadenceConfig | undefined>(undefined);
  private readonly API_URL = inject(apiUrlToken);
  private httpClient = inject(HttpClient);
  private defaultCadence = inject(relationshipBaselineToken);

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

  // Note: no optimistic update used in the calling, state is updated after response is recieved
  updateUserCadenceConfig(
    relationship: Relationship,
    newCadence: number,
    updateExisting: UpdateCadenceBody['applyToExisting'],
  ) {
    const fullOverrides = { ...this.userCadenceConfig(), [relationship]: newCadence };
    return this.httpClient
      .put<UpdateCadenceBody['overrides']>(`${this.API_URL}/config/cadences`, {
        overrides: fullOverrides,
        applyToExisting: updateExisting,
      })
      .pipe(
        tap({
          next: (updatedConfig) => {
            return this.userCadenceConfig.set(updatedConfig);
          },
        }),
      );
  }

  resetToDefault() {
    return this.httpClient
      .put<UpdateCadenceBody['overrides']>(`${this.API_URL}/config/cadences`, {
        overrides: Object.fromEntries(
          this.defaultCadence.map((item) => [item.value, item.defaultCadenceDays]),
        ),
        applyToExisting: false,
      })
      .pipe(
        tap({
          next: (updatedConfig) => {
            return this.userCadenceConfig.set(updatedConfig);
          },
        }),
      );
  }
}
