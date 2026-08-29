import { computed, inject, Injectable } from '@angular/core';
import { PeopleService } from './people-store.service';
import { CadenceConfigService } from './cadence-config.service';
import { relationshipBaselineToken } from '../tokens/relationship-baseline.token';
import { Relationship } from '../models/relationship.model';
import { Status } from '../models/status.model';

const DUE_SOON_THRESHOLD = 0.8;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private peopleService = inject(PeopleService);
  private cadenceConfigService = inject(CadenceConfigService);
  private relationshipBaseline = inject(relationshipBaselineToken);

  peopleWithStatus = computed(() => {
    const people = this.peopleService.loadedPeople();
    const overrides = this.cadenceConfigService.loadedUserCadenceConfig();

    if (!people || !overrides) return undefined;

    const today = new Date();
    return people.map((person) => {
      const cadenceDays = this.cadenceFor(person.relationshipType, overrides);
      const daysSince = person.lastContactDate
        ? this.daysBetween(person.lastContactDate, today)
        : null;

      return {
        ...person,
        status: this.computeStatus(daysSince, cadenceDays),
        // Only meaningful once there's a baseline to count forward from.
        dueInDays: daysSince === null ? null : cadenceDays - daysSince,
      };
    });
  });

  private cadenceFor(type: Relationship, overrides: Partial<Record<Relationship, number>>): number {
    return (
      overrides[type] ??
      this.relationshipBaseline.find((entry) => entry.value === type)!.defaultCadenceDays
    );
  }

  private computeStatus(daysSince: number | null, cadenceDays: number): Status {
    if (daysSince === null) return 'never_contacted';

    const urgency = daysSince / cadenceDays;
    if (urgency > 1) return 'overdue';
    if (urgency > DUE_SOON_THRESHOLD) return 'due_soon';
    return 'on_track';
  }

  private daysBetween(from: string, to: Date): number {
    const fromMs = new Date(from).getTime();
    return Math.floor((to.getTime() - fromMs) / MS_PER_DAY);
  }
}
