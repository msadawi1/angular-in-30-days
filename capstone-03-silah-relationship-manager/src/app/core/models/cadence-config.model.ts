import { Relationship } from './relationship.model';

/** User-editable cadence overrides, keyed by type. Missing key = follows the
 * factory default in `RelationshipBaseline` (see `cadenceFor()`, spec §2.2). */
export type CadenceConfig = Partial<Record<Relationship, number>>;
