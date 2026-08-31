import { inject, Injectable } from '@angular/core';
import { Person } from '../models/person.model';
import { apiUrlToken } from '../tokens/app-config.token';
import { HttpClient } from '@angular/common/http';
import { ContactLog } from '../models/contact-log.model';

@Injectable({
  providedIn: 'root',
})
export class ContactLogService {
  private readonly API_URL = inject(apiUrlToken);
  private httpClient = inject(HttpClient);

  loadPersonContactLogs(id: Person['id']) {
    return this.httpClient.get<ContactLog[]>(`${this.API_URL}/people/${id}/logs`);
  }
}
