import { ImportantDate } from './important-date.model';
import { Relationship } from './relationship.model';

type ContactInfo = {
  email?: string;
  phone?: string;
};

export interface Person {
  id: string;
  name: string;
  relationshipType: Relationship;
  contact: ContactInfo | null;
  customCadenceDays: number | null; // null = follows the type default
  notes: string | null;
  importantDates: ImportantDate[];
  initialContactEstimate: string | null; // ISO date from the add-flow chip; approximate
  lastContactDate: string | null; // ISO date; null = never contacted
  createdAt: string;
  updatedAt: string;
}
