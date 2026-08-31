import { ContactStatus, DUE_SOON_THRESHOLD } from '../common/domain';
import { daysBetween } from '../common/dates';
import { Person } from './person.entity';

/** The person resource as the API sends it: the stored row plus the two
 * cadence-derived fields the client would otherwise have to compute itself. */
export interface PersonView extends Person {
  status: ContactStatus;
  /** Cadence days remaining; negative once overdue. null = never contacted. */
  dueInDays: number | null;
}

export function toPersonView(person: Person, cadenceDays: number, today: string): PersonView {
  const daysSince = person.lastContactDate ? daysBetween(person.lastContactDate, today) : null;

  return {
    ...person,
    status: deriveStatus(daysSince, cadenceDays),
    dueInDays: daysSince === null ? null : cadenceDays - daysSince,
  };
}

/** Spec §2.3 — urgency is elapsed time as a share of the cadence. */
function deriveStatus(daysSince: number | null, cadenceDays: number): ContactStatus {
  if (daysSince === null) return 'never_contacted';

  const urgency = daysSince / cadenceDays;
  if (urgency > 1) return 'overdue';
  if (urgency > DUE_SOON_THRESHOLD) return 'due_soon';
  return 'on_track';
}
