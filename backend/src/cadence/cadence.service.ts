import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FACTORY_CADENCE_DAYS,
  RELATIONSHIP_TYPES,
  RelationshipType,
} from '../common/domain';
import { PeopleService } from '../people/people.service';
import { CadenceOverride } from './cadence-override.entity';
import { UpdateCadencesDto } from './dto/update-cadences.dto';

export type CadenceMap = Partial<Record<RelationshipType, number>>;

@Injectable()
export class CadenceService {
  constructor(
    @InjectRepository(CadenceOverride)
    private readonly overrides: Repository<CadenceOverride>,
    private readonly people: PeopleService,
  ) {}

  /** Spec §4.3: this endpoint returns user overrides only — never merged with
   * the factory baseline, which the client holds in its own token. */
  async getOverrides(): Promise<CadenceMap> {
    const rows = await this.overrides.find();
    return rows.reduce<CadenceMap>((map, row) => {
      map[row.relationshipType] = row.days;
      return map;
    }, {});
  }

  /** cadenceFor(type) from spec §2.2, server-side. */
  private effective(overrides: CadenceMap, type: RelationshipType): number {
    return overrides[type] ?? FACTORY_CADENCE_DAYS[type];
  }

  /**
   * PUT replaces the whole override map: types absent from the payload fall
   * back to the factory baseline again.
   *
   * Inheritance model (spec Open Decision #1 — live inheritance): a person with
   * customCadenceDays === null always follows the *current* default, so a
   * changed default moves them with no writes at all. `applyToExisting` then
   * means "pin this value onto them", which is what stops a later default
   * change from moving them again.
   */
  async replaceOverrides(dto: UpdateCadencesDto): Promise<CadenceMap> {
    const previous = await this.getOverrides();
    const next = dto.overrides as CadenceMap;

    await this.overrides.manager.transaction(async (manager) => {
      const repository = manager.getRepository(CadenceOverride);
      await repository.clear();

      const rows = RELATIONSHIP_TYPES.filter((type) => next[type] !== undefined).map((type) =>
        repository.create({ relationshipType: type, days: next[type] as number }),
      );
      if (rows.length) await repository.save(rows);
    });

    if (dto.applyToExisting) {
      const changed = RELATIONSHIP_TYPES.filter(
        (type) => this.effective(next, type) !== this.effective(previous, type),
      );
      for (const type of changed) {
        await this.people.pinCadence(type, this.effective(next, type));
      }
    }

    return this.getOverrides();
  }

  /** FR-5.6 — reset to defaults clears the override layer entirely. */
  async clearOverrides(): Promise<CadenceMap> {
    await this.overrides.clear();
    return {};
  }

  /** FR-5.4 — the consequence of a change, shown before it is saved. */
  async usage(): Promise<Record<RelationshipType, number>> {
    const counts = await this.people.countFollowingDefault();
    return RELATIONSHIP_TYPES.reduce(
      (usage, type) => {
        usage[type] = counts[type] ?? 0;
        return usage;
      },
      {} as Record<RelationshipType, number>,
    );
  }
}
