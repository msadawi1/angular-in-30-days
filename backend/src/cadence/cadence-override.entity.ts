import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RelationshipType } from '../common/domain';

/** User-editable layer over the factory baseline (spec §2.2). Every type
 * always has a row — seeded to the factory default at startup (see
 * `CadenceService.onModuleInit`) — so GET always returns the full config. */
@Entity('cadence_overrides')
export class CadenceOverride {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  relationshipType: RelationshipType;

  @Column({ type: 'integer' })
  days: number;
}
