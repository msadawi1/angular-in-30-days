import { Injectable, OnModuleInit } from '@nestjs/common';
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
import { CadenceMap, EffectiveCadenceService } from './effective-cadence.service';

@Injectable()
export class CadenceService implements OnModuleInit {
  constructor(
    @InjectRepository(CadenceOverride)
    private readonly overrides: Repository<CadenceOverride>,
    private readonly people: PeopleService,
    private readonly cadences: EffectiveCadenceService,
  ) {}

  /** Seeds any type missing a row with its factory default. Idempotent —
   * only inserts what's missing, so it's safe to run on every boot. */
  async onModuleInit(): Promise<void> {
    const existing = await this.overrides.find();
    const present = new Set(existing.map((row) => row.relationshipType));
    const missing = RELATIONSHIP_TYPES.filter((type) => !present.has(type));
    if (!missing.length) return;

    await this.overrides.save(
      missing.map((type) =>
        this.overrides.create({ relationshipType: type, days: FACTORY_CADENCE_DAYS[type] }),
      ),
    );
  }

  /** Full config, factory defaults and user overrides alike — one row per
   * type, always. */
  async getOverrides(): Promise<CadenceMap> {
    return this.cadences.map();
  }

  /**
   * Upserts whatever types are present in the payload; types absent from it
   * are left untouched (they already hold either a prior override or the
   * factory default seeded at startup — never blank).
   *
   * Inheritance model (spec Open Decision #1 — live inheritance): a person with
   * customCadenceDays === null always follows the *current* default, so a
   * changed default moves them with no writes at all. `applyToExisting` then
   * means "pin this value onto them", which is what stops a later default
   * change from moving them again.
   */
  async replaceOverrides(dto: UpdateCadencesDto): Promise<CadenceMap> {
    const previous = await this.getOverrides();
    const next = dto.overrides;
    const changedTypes = RELATIONSHIP_TYPES.filter((type) => next[type] !== undefined);

    if (changedTypes.length) {
      await this.overrides.save(
        changedTypes.map((type) =>
          this.overrides.create({ relationshipType: type, days: next[type] as number }),
        ),
      );
    }

    if (dto.applyToExisting) {
      const moved = changedTypes.filter((type) => next[type] !== previous[type]);
      for (const type of moved) {
        await this.people.pinCadence(type, next[type] as number);
      }
    }

    return this.getOverrides();
  }

  /** FR-5.6 — reset to defaults snaps every row back to its factory value;
   * rows themselves are never deleted now that GET always needs a full set. */
  async clearOverrides(): Promise<CadenceMap> {
    await this.overrides.save(
      RELATIONSHIP_TYPES.map((type) =>
        this.overrides.create({ relationshipType: type, days: FACTORY_CADENCE_DAYS[type] }),
      ),
    );
    return this.getOverrides();
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
