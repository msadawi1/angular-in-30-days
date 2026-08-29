import { join } from 'node:path';
import { DataSourceOptions } from 'typeorm';
import { CadenceOverride } from '../cadence/cadence-override.entity';
import { ContactLog } from '../contact-logs/contact-log.entity';
import { ImportantDate } from '../people/important-date.entity';
import { Person } from '../people/person.entity';

export interface AppConfig {
  port: number;
  apiKey: string;
  databasePath: string;
  corsOrigin: string;
}

export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    apiKey: process.env.API_KEY ?? 'silah-dev-key',
    databasePath: process.env.DATABASE_PATH ?? join(process.cwd(), 'silah.sqlite'),
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
  };
}

/**
 * Shared by the Nest bootstrap and the standalone seed script so both talk to
 * the same schema. `synchronize` is on because this is a single-user learning
 * project with a disposable local file — swap it for migrations before any
 * deployment where the data matters.
 */
export function buildDataSourceOptions(databasePath: string): DataSourceOptions {
  return {
    type: 'better-sqlite3',
    database: databasePath,
    entities: [Person, ImportantDate, ContactLog, CadenceOverride],
    synchronize: true,
  };
}
