import { Pipe, PipeTransform } from '@angular/core';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;

/** Turns an ISO date into how long ago it was, e.g. "2 weeks ago". */
@Pipe({ name: 'daysSince' })
export class DaysSincePipe implements PipeTransform {
  transform(isoDate: string | null | undefined): string {
    if (!isoDate) return 'Never contacted';

    const days = this.daysSince(isoDate);
    if (days < 0) return 'today'; // a future date is nonsense here; don't say "in -3 days"
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < DAYS_PER_WEEK) return `${days} days ago`;
    if (days < DAYS_PER_MONTH) return this.ago(days / DAYS_PER_WEEK, 'week');
    if (days < DAYS_PER_YEAR) return this.ago(days / DAYS_PER_MONTH, 'month');
    return this.ago(days / DAYS_PER_YEAR, 'year');
  }

  /** Day-granular and timezone-free, matching how the API stores dates. */
  private daysSince(isoDate: string): number {
    const then = new Date(`${isoDate}T00:00:00Z`).getTime();
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date(`${today}T00:00:00Z`).getTime();

    return Math.round((now - then) / MS_PER_DAY);
  }

  private ago(value: number, unit: string): string {
    const count = Math.floor(value);
    return `${count} ${unit}${count === 1 ? '' : 's'} ago`;
  }
}
