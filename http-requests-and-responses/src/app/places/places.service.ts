import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../api.model';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      `${API_BASE_URL}/places`,
      'Something went wrong fetching available places. Please try again later.',
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      `${API_BASE_URL}/user-places`,
      'Something went wrong fetching your favorite places. Please try again later.',
    ).pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces),
      }),
    );
  }

  addPlaceToUserPlaces(place: Place) {
    // get prev
    const prevValue = this.userPlaces();

    // optimistic update, add new place
    if (!this.userPlaces().some((p) => p.id === place.id)) {
      this.userPlaces.set([...prevValue, place]);
    }

    // roll back if error occured
    return this.httpClient
      .put(`${API_BASE_URL}/user-places`, {
        placeId: place.id,
      })
      .pipe(
        catchError((error) => {
          this.userPlaces.set(prevValue);
          this.errorService.showError('Failed to store selected place. Try again.');
          return throwError(() => new Error('Failed to store selected place. Try again.'));
        }),
      );
  }

  removeUserPlace(place: Place) {
    // get prev
    const prevValue = this.userPlaces();

    // optimistic update, remove place
    this.userPlaces.set(prevValue.filter((p) => p.id !== place.id));

    // roll back if error occured
    return this.httpClient
      .delete(`${API_BASE_URL}/user-places/${place.id}`)
      .pipe(
        catchError((error) => {
          this.userPlaces.set(prevValue);
          this.errorService.showError('Failed to delete selected place. Try again.');
          return throwError(() => new Error('Failed to delete selected place. Try again.'));
        }),
      );
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((data) => data.places),
      catchError((error) => {
        this.errorService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
