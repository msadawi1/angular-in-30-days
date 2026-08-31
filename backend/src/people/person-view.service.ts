import { Injectable } from '@nestjs/common';
import { today } from '../common/dates';
import { EffectiveCadenceService } from '../cadence/effective-cadence.service';
import { Person } from './person.entity';
import { PersonView, toPersonView } from './person-view';

/**
 * Shapes stored people into the API's person resource. Kept out of
 * `PeopleService` so persistence never handles objects carrying derived
 * fields that TypeORM would have to ignore on save.
 */
@Injectable()
export class PersonViewService {
  constructor(private readonly cadences: EffectiveCadenceService) {}

  async toView(person: Person): Promise<PersonView> {
    const [view] = await this.toViews([person]);
    return view;
  }

  /** One cadence read for the whole list, not one per person. */
  async toViews(people: Person[]): Promise<PersonView[]> {
    const cadences = await this.cadences.map();
    const now = today();

    return people.map((person) =>
      toPersonView(person, this.cadences.forPerson(person, cadences), now),
    );
  }
}
