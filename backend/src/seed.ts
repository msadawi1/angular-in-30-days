/**
 * Seed the local SQLite database with a spread of people that exercises every
 * branch of the status algorithm (spec §2.3).
 *
 * Usage:
 *   npm run seed              # wipes people, logs, dates, cadence overrides
 *
 * Never runs on boot. Dates are computed relative to the day you run it, so the
 * overdue/due-soon split stays meaningful no matter when that is.
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CadenceOverride } from './cadence/cadence-override.entity';
import { addDays, today } from './common/dates';
import { RelationshipType } from './common/domain';
import { buildDataSourceOptions, loadConfig } from './config/configuration';
import { ContactLog } from './contact-logs/contact-log.entity';
import { ImportantDate } from './people/important-date.entity';
import { Person } from './people/person.entity';

interface SeedPerson {
  name: string;
  relationshipType: RelationshipType;
  phone: string | null;
  email: string | null;
  customCadenceDays: number | null;
  notes: string | null;
  lastContactDaysAgo: number | null;
  importantDates: { label: string; monthDay: string; year: number }[];
  logs: { type: ContactLog['type']; daysAgo: number; notes: string | null }[];
}

const SEED: SeedPerson[] = [
  {
    // overdue — 7-day cadence, three weeks of silence
    name: 'Amina Al-Sadawi',
    relationshipType: 'immediate_family',
    phone: '+973 3300 1122',
    email: 'amina@example.com',
    customCadenceDays: null,
    notes: 'Prefers voice notes over calls.',
    lastContactDaysAgo: 120,
    importantDates: [
      { label: 'Birthday', monthDay: '04-12', year: 1968 },
      { label: 'Anniversary', monthDay: '09-03', year: 1992 },
    ],
    logs: [
      { type: 'call', daysAgo: 21, notes: 'Talked about the house repairs.' },
      { type: 'visit', daysAgo: 60, notes: null },
    ],
  },
  {
    // due_soon — 14-day cadence, 12 days elapsed puts urgency at 0.86
    name: 'Yusuf Rahman',
    relationshipType: 'close_friend',
    phone: '+973 3311 4455',
    email: null,
    customCadenceDays: null,
    notes: 'Met at university. Into cycling.',
    lastContactDaysAgo: 200,
    importantDates: [{ label: 'Birthday', monthDay: '11-27', year: 1996 }],
    logs: [{ type: 'message', daysAgo: 12, notes: 'Sent him the race photos.' }],
  },
  {
    // ok — custom 45-day cadence, contacted 10 days ago
    name: 'Layla Haddad',
    relationshipType: 'extended_family',
    phone: null,
    email: 'layla.haddad@example.com',
    customCadenceDays: 45,
    notes: null,
    lastContactDaysAgo: 300,
    importantDates: [{ label: 'Birthday', monthDay: '02-08', year: 1985 }],
    logs: [{ type: 'call', daysAgo: 10, notes: null }],
  },
  {
    // overdue — 90-day colleague default, well past it
    name: 'Omar Khalil',
    relationshipType: 'colleague',
    phone: '+973 3322 7788',
    email: 'omar.khalil@example.com',
    customCadenceDays: null,
    notes: 'Backend lead on the payments team. Seeing him at the offsite.',
    lastContactDaysAgo: 140,
    importantDates: [],
    logs: [{ type: 'other', daysAgo: 140, notes: 'Handover meeting.' }],
  },
  {
    // never_contacted — no logs, no seeded date; urgency accrues from createdAt
    name: 'Sara Mansour',
    relationshipType: 'friend',
    phone: null,
    email: 'sara.mansour@example.com',
    customCadenceDays: null,
    notes: 'Moved to Dubai. Have not actually spoken since.',
    lastContactDaysAgo: null,
    importantDates: [{ label: 'Birthday', monthDay: '06-15', year: 1994 }],
    logs: [],
  },
];

async function seed(): Promise<void> {
  const config = loadConfig();
  const dataSource = new DataSource(buildDataSourceOptions(config.databasePath));
  await dataSource.initialize();

  const people = dataSource.getRepository(Person);
  const logs = dataSource.getRepository(ContactLog);
  const dates = dataSource.getRepository(ImportantDate);
  const overrides = dataSource.getRepository(CadenceOverride);

  await logs.clear();
  await dates.clear();
  await people.clear();
  await overrides.clear();

  const now = today();
  let logCount = 0;
  let dateCount = 0;

  for (const entry of SEED) {
    // Logs win over the add-flow date, exactly as applyContactDate would.
    const seeded =
      entry.lastContactDaysAgo === null ? null : addDays(now, -entry.lastContactDaysAgo);
    const logDates = entry.logs.map((log) => addDays(now, -log.daysAgo));
    const lastContactDate = logDates.length
      ? logDates.reduce((max, date) => (date > max ? date : max))
      : seeded;

    const person = await people.save(
      people.create({
        name: entry.name,
        relationshipType: entry.relationshipType,
        phone: entry.phone,
        email: entry.email,
        customCadenceDays: entry.customCadenceDays,
        notes: entry.notes,
        lastContactDate,
      }),
    );

    for (const date of entry.importantDates) {
      await dates.save(
        dates.create({
          personId: person.id,
          label: date.label,
          date: `${date.year}-${date.monthDay}`,
        }),
      );
      dateCount += 1;
    }

    for (const [index, log] of entry.logs.entries()) {
      await logs.save(
        logs.create({
          personId: person.id,
          type: log.type,
          date: logDates[index],
          notes: log.notes,
        }),
      );
      logCount += 1;
    }
  }

  await dataSource.destroy();
  console.log(
    `Seeded ${SEED.length} people, ${logCount} contact logs, ${dateCount} important dates into ${config.databasePath}`,
  );
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
