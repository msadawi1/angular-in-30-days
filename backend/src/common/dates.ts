/** ISO calendar dates (YYYY-MM-DD). Deliberately string-based: the domain is
 * day-granular, and Date objects would drag timezone drift into comparisons. */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isFuture(isoDate: string): boolean {
  return isoDate > today();
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whole days from `from` to `to`. Negative when `from` is the later date. */
export function daysBetween(from: string, to: string): number {
  const fromMs = new Date(`${from}T00:00:00Z`).getTime();
  const toMs = new Date(`${to}T00:00:00Z`).getTime();
  return Math.round((toMs - fromMs) / MS_PER_DAY);
}
