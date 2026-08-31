import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FACTORY_CADENCE_DAYS, RelationshipType } from '../common/domain';
import { CadenceOverride } from './cadence-override.entity';

/** Every type is always present — the factory default stands in wherever no
 * row exists yet, so callers never need their own fallback. */
export type CadenceMap = Record<RelationshipType, number>;

/**
 * The one place that answers "how many days is this person's cadence?".
 * Kept apart from `CadenceService` (which edits the config and therefore
 * depends on `PeopleService`) so people-side callers can read a cadence
 * without the two modules depending on each other.
 */
@Injectable()
export class EffectiveCadenceService {
  constructor(
    @InjectRepository(CadenceOverride)
    private readonly overrides: Repository<CadenceOverride>,
  ) {}

  async map(): Promise<CadenceMap> {
    const rows = await this.overrides.find();
    return rows.reduce<CadenceMap>(
      (map, row) => {
        map[row.relationshipType] = row.days;
        return map;
      },
      { ...FACTORY_CADENCE_DAYS },
    );
  }

  /** A manual override always wins; otherwise the person follows their type's
   * current default (spec Open Decision #1 — live inheritance). */
  forPerson(
    person: { relationshipType: RelationshipType; customCadenceDays: number | null },
    cadences: CadenceMap,
  ): number {
    return person.customCadenceDays ?? cadences[person.relationshipType];
  }
}
