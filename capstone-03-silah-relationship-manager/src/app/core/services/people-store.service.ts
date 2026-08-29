import { inject, Injectable, signal } from '@angular/core';
import { Person } from '../models/person.model';
import { HttpClient } from '@angular/common/http';
import { apiUrlToken } from '../tokens/app-config.token';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private people = signal<Person[] | undefined>(undefined);
  private readonly API_URL = inject(apiUrlToken);
  private httpClient = inject(HttpClient);

  loadedPeople = this.people.asReadonly();

  // loadPeople returns the observer, component subscribe to it, tap() runs a side effect that takes
  // the returned response, hence letting the service mutate its own state and components only read it and handle
  // loading and errors from the observer interface
  loadPeople() {
    return this.httpClient.get<Person[]>(`${this.API_URL}/people`).pipe(
      tap({
        next: (peopleArray) => {
          return this.people.set(peopleArray);
        },
      }),
    );
  }


}
