import { Component, computed, inject, input, signal } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { Person } from '../../core/models/person.model';
import { PersonComponent } from '../../shared/ui/person/person.component';
import { Relationship } from '../../core/models/relationship.model';
import { Status } from '../../core/models/status.model';
import { relationshipBaselineToken } from '../../core/tokens/relationship-baseline.token';
import { statusOptionsToken } from '../../core/tokens/status.token';

@Component({
  selector: 'app-people-list',
  imports: [CardComponent, PersonComponent],
  templateUrl: './people-list.component.html',
  styleUrl: './people-list.component.css',
})
export class PeopleListComponent {
  people = input.required<Person[]>();
  selectedFilters = signal<{ relationshipType: string; status: string }>({
    relationshipType: 'all',
    status: 'all',
  });

  readonly relationshipOptions = inject(relationshipBaselineToken);
  readonly statusOptions = inject(statusOptionsToken);

  filteredPeopleWithStatus = computed(() => {
    let filteredPeople = this.people();
    const selectedStatus = this.selectedFilters().status;
    const selectedType = this.selectedFilters().relationshipType;

    if (selectedStatus !== 'all') {
      filteredPeople = filteredPeople.filter((person) => person.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filteredPeople = filteredPeople.filter((person) => person.relationshipType === selectedType);
    }

    return filteredPeople;
  });

  onTypeChange(filter: string) {
    this.selectedFilters.update((oldValue) => ({
      ...oldValue,
      relationshipType: filter,
    }));
  }

  onStatusChange(filter: string) {
    this.selectedFilters.update((oldValue) => ({
      ...oldValue,
      status: filter,
    }));
  }
}
