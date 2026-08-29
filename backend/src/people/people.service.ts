import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { AppException } from '../common/app-error';
import { RelationshipType } from '../common/domain';
import { isFuture } from '../common/dates';
import { ContactLog } from '../contact-logs/contact-log.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { QueryPeopleDto } from './dto/query-people.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ImportantDate } from './important-date.entity';
import { Person } from './person.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person) private readonly people: Repository<Person>,
    @InjectRepository(ContactLog) private readonly logs: Repository<ContactLog>,
  ) {}

  async findAll(query: QueryPeopleDto): Promise<Person[]> {
    const builder = this.people
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.importantDates', 'importantDate')
      .orderBy('person.name', 'ASC');

    if (query.type) {
      builder.andWhere('person.relationshipType = :type', { type: query.type });
    }
    if (query.search) {
      builder.andWhere('person.name LIKE :search', { search: `%${query.search}%` });
    }

    return builder.getMany();
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.people.findOne({ where: { id } });
    if (!person) throw AppException.notFound(`No person with id ${id}.`);
    return person;
  }

  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const builder = this.people
      .createQueryBuilder('person')
      .where('person.name = :name COLLATE NOCASE', { name });

    if (excludeId) {
      builder.andWhere('person.id != :excludeId', { excludeId });
    }

    return (await builder.getCount()) > 0;
  }

  async create(dto: CreatePersonDto): Promise<Person> {
    this.assertReachable(dto.phone ?? null, dto.email ?? null);
    this.assertNotFuture(dto.lastContactDate ?? null, 'lastContactDate');

    return this.people.manager.transaction(async (manager) => {
      const repository = manager.getRepository(Person);
      const person = await repository.save(
        repository.create({
          name: dto.name,
          relationshipType: dto.relationshipType,
          phone: dto.phone ?? null,
          email: dto.email ?? null,
          customCadenceDays: dto.customCadenceDays ?? null,
          notes: dto.notes ?? null,
          lastContactDate: dto.lastContactDate ?? null,
        }),
      );

      await this.replaceImportantDates(manager, person.id, dto.importantDates ?? []);
      return this.reload(manager, person.id);
    });
  }

  async update(id: string, dto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);

    const phone = dto.phone !== undefined ? dto.phone : person.phone;
    const email = dto.email !== undefined ? dto.email : person.email;
    this.assertReachable(phone ?? null, email ?? null);

    if (dto.lastContactDate !== undefined) {
      this.assertNotFuture(dto.lastContactDate ?? null, 'lastContactDate');
    }

    Object.assign(person, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.relationshipType !== undefined && { relationshipType: dto.relationshipType }),
      ...(dto.phone !== undefined && { phone: dto.phone ?? null }),
      ...(dto.email !== undefined && { email: dto.email ?? null }),
      ...(dto.customCadenceDays !== undefined && {
        customCadenceDays: dto.customCadenceDays ?? null,
      }),
      ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
      ...(dto.lastContactDate !== undefined && {
        lastContactDate: dto.lastContactDate ?? null,
      }),
    });

    return this.people.manager.transaction(async (manager) => {
      await manager.getRepository(Person).save(person);

      if (dto.importantDates !== undefined) {
        await this.replaceImportantDates(manager, person.id, dto.importantDates);
      }
      return this.reload(manager, person.id);
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    // Cascade delete is a server responsibility (spec §4.3). Done explicitly
    // rather than left to a PRAGMA, so it holds whatever the driver decides.
    await this.people.manager.transaction(async (manager) => {
      await manager.getRepository(ContactLog).delete({ personId: id });
      await manager.getRepository(ImportantDate).delete({ personId: id });
      await manager.getRepository(Person).delete({ id });
    });
  }

  /**
   * FR-2.2 — a log only ever moves lastContactDate forward. Backdated logs are
   * kept for history but must not rewrite the person as less recently contacted.
   */
  async applyContactDate(person: Person, date: string): Promise<Person> {
    if (!person.lastContactDate || date > person.lastContactDate) {
      person.lastContactDate = date;
    }
    return this.people.save(person);
  }

  /**
   * FR-2.5 — after a log is deleted, lastContactDate falls back to the newest
   * remaining log, or null when none is left. Any date the add-flow set is lost
   * once a log has superseded it; that is the cost of collapsing the estimate
   * into this one field.
   */
  async recomputeLastContactDate(person: Person): Promise<Person> {
    person.lastContactDate = await this.resolveLastContactDate(person.id);
    return this.people.save(person);
  }

  /** FR-5.4 — how many active people currently follow each type's default. */
  async countFollowingDefault(): Promise<Record<string, number>> {
    const rows = await this.people
      .createQueryBuilder('person')
      .select('person.relationshipType', 'type')
      .addSelect('COUNT(person.id)', 'count')
      .where('person.customCadenceDays IS NULL')
      .groupBy('person.relationshipType')
      .getRawMany<{ type: string; count: string }>();

    return rows.reduce<Record<string, number>>((counts, row) => {
      counts[row.type] = Number(row.count);
      return counts;
    }, {});
  }

  /**
   * FR-5.5 — pin a cadence onto everyone who was following the default, so a
   * later default change no longer moves them. People with a manual override
   * are never touched by either path.
   */
  async pinCadence(type: RelationshipType, days: number): Promise<number> {
    const result = await this.people.update(
      { relationshipType: type, customCadenceDays: IsNull() },
      { customCadenceDays: days },
    );
    return result.affected ?? 0;
  }

  private async resolveLastContactDate(personId: string): Promise<string | null> {
    const newest = await this.logs.findOne({
      where: { personId },
      order: { date: 'DESC' },
    });
    return newest?.date ?? null;
  }

  /**
   * FR-1.8 — the client always sends the whole list, so the rows are replaced
   * wholesale. Written explicitly instead of via TypeORM relation cascade,
   * which nullifies orphans and cannot: `personId` is NOT NULL.
   */
  private async replaceImportantDates(
    manager: EntityManager,
    personId: string,
    rows: { label: string; date: string }[],
  ): Promise<void> {
    const repository = manager.getRepository(ImportantDate);
    await repository.delete({ personId });

    if (rows.length) {
      await repository.save(
        rows.map((row) => repository.create({ personId, label: row.label, date: row.date })),
      );
    }
  }

  private async reload(manager: EntityManager, id: string): Promise<Person> {
    const person = await manager.getRepository(Person).findOne({ where: { id } });
    if (!person) throw AppException.notFound(`No person with id ${id}.`);
    return person;
  }

  /** FR-3.4 — a person you cannot contact defeats the app's purpose. */
  private assertReachable(phone: string | null, email: string | null): void {
    if (!phone && !email) {
      throw AppException.validation('A person needs at least a phone number or an email.', {
        phone: 'provide a phone number or an email',
        email: 'provide a phone number or an email',
      });
    }
  }

  private assertNotFuture(date: string | null, field: string): void {
    if (date && isFuture(date)) {
      throw AppException.validation(`${field} cannot be in the future.`, {
        [field]: 'must not be in the future',
      });
    }
  }
}
