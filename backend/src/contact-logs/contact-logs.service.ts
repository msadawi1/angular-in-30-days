import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppException } from '../common/app-error';
import { isFuture, today } from '../common/dates';
import { PeopleService } from '../people/people.service';
import { Person } from '../people/person.entity';
import { ContactLog } from './contact-log.entity';
import { CreateContactLogDto } from './dto/create-contact-log.dto';

@Injectable()
export class ContactLogsService {
  constructor(
    @InjectRepository(ContactLog) private readonly logs: Repository<ContactLog>,
    private readonly people: PeopleService,
  ) {}

  /** FR-2.4 — newest first. */
  async findForPerson(personId: string): Promise<ContactLog[]> {
    await this.people.findOne(personId);
    return this.logs.find({
      where: { personId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async create(personId: string, dto: CreateContactLogDto): Promise<ContactLog> {
    const person = await this.people.findOne(personId);

    const date = dto.date ?? today();
    if (isFuture(date)) {
      throw AppException.validation('A contact cannot be logged in the future.', {
        date: 'must not be in the future',
      });
    }

    const log = await this.logs.save(
      this.logs.create({ personId, type: dto.type, date, notes: dto.notes ?? null }),
    );

    await this.people.applyContactDate(person, date);
    return log;
  }

  /** FR-2.5 — deleting a log rewinds lastContactDate to the next best source. */
  async remove(id: string): Promise<Person> {
    const log = await this.logs.findOne({ where: { id } });
    if (!log) throw AppException.notFound(`No contact log with id ${id}.`);

    const person = await this.people.findOne(log.personId);
    await this.logs.remove(log);
    return this.people.recomputeLastContactDate(person);
  }
}
