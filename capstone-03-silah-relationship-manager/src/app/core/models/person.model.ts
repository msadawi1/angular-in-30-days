import { ImportantDate } from './important-date.model';
import { Relationship } from './relationship.model';
import { Status } from './status.model';

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
  status: Status;
  dueInDays: number | null; // cadence days remaining; negative once overdue. null = never contacted
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

/** Payload for POST /people — server assigns id/status/dueInDays/timestamps. */
export type CreatePersonPayload = Pick<
  Person,
  'name' | 'relationshipType' | 'customCadenceDays' | 'email' | 'phone' | 'notes' | 'lastContactDate'
> & {
  importantDates: Pick<ImportantDate, 'label' | 'date'>[];
};
