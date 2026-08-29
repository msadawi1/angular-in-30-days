import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RelationshipType } from '../common/domain';

/** User-editable layer over the factory baseline (spec §2.2). Only types the
 * user has actually changed get a row; absent rows fall back to factory. */
@Entity('cadence_overrides')
export class CadenceOverride {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  relationshipType: RelationshipType;

  @Column({ type: 'integer' })
  days: number;
}
