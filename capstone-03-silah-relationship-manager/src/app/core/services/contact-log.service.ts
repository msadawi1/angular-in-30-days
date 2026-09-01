import { inject, Injectable, signal } from '@angular/core';
import { Person } from '../models/person.model';
import { apiUrlToken } from '../tokens/app-config.token';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ContactLog } from '../models/contact-log.model';

@Injectable({
  providedIn: 'root',
})
export class ContactLogService {
  private personId = signal<Person['id'] | null>(null);
  targetPersonId = this.personId.asReadonly();

  /** null = not loaded yet for the current person; distinct from an empty history. */
  private logs = signal<ContactLog[] | null>(null);
  readonly contactLogs = this.logs.asReadonly();

  private readonly API_URL = inject(apiUrlToken);
  private httpClient = inject(HttpClient);

  loadPersonContactLogs(id: Person['id']) {
    return this.httpClient
      .get<ContactLog[]>(`${this.API_URL}/people/${id}/logs`)
      .pipe(tap((logs) => this.logs.set(logs)));
  }

  addContactLogToPerson(contactLog: Pick<ContactLog, 'type' | 'date' | 'notes'>) {
    return this.httpClient
      .post<ContactLog>(`${this.API_URL}/people/${this.targetPersonId() ?? ''}/logs`, contactLog)
      .pipe(tap((created) => this.logs.update((current) => [created, ...(current ?? [])])));
  }

  toggleLogContact(personId: Person['id'] | null) {
    this.personId.set(personId);
  }
}
