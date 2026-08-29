import { ImportantDate } from './important-date.model';
import { Relationship } from './relationship.model';
import { Status } from './status.model';

/**
 * Mirrors the API's person resource. Deliberately hand-written rather than
 * shared with the backend — the two projects couple over HTTP only.
 *
 * No `status` field: status is derived client-side per spec §2.3, so the API
 * never sends one.
 */
export interface Person {
  id: string;
  name: string;
  relationshipType: Relationship;
  email: string | null;
  phone: string | null;
  customCadenceDays: number | null; // null = follows the type default
  notes: string | null;
  importantDates: ImportantDate[];
  lastContactDate: string | null; // ISO date; null = never contacted
  status: Status | null;
  dueInDays: number | null; // cadence days remaining; negative once overdue
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
