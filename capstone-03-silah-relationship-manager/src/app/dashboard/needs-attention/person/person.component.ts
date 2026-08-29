import { Component, computed, inject, input } from '@angular/core';
import { Person } from '../../../core/models/person.model';
import { relationshipBaselineToken } from '../../../core/tokens/relationship-baseline.token';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-person',
  host: {
    '[class.on-track]': 'person().status === "on_track"',
    '[class.due-soon]': 'person().status === "due_soon"',
    '[class.never-contacted]': 'person().status === "never_contacted"',
    '[class.overdue]': 'person().status === "overdue"',
  },
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {
  person = input.required<Person>()

  private relationshipBaseline = inject(relationshipBaselineToken);

  relationshipLabel = computed(
    () => this.relationshipBaseline.find((entry) => entry.value === this.person().relationshipType)?.label
      ?? this.person().relationshipType,
  );

  daysSinceContact = computed(() => {
    const lastContactDate = this.person().lastContactDate;
    if (!lastContactDate) return null;

    const elapsedMs = Date.now() - new Date(lastContactDate).getTime();
    return Math.floor(elapsedMs / MS_PER_DAY);
  });
}
