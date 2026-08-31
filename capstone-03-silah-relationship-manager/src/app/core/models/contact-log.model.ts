export type ContactType = 'call' | 'visit' | 'message' | 'other';

export interface ContactLog {
  id: string;
  personId: string;
  type: ContactType;
  date: string; // ISO date; never in the future
  notes: string | null;
  createdAt: string; // ISO datetime
}
