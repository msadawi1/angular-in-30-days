import { Component } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { PersonComponent } from './person/person.component';
import { Person } from '../../core/models/person.model';
import { Status } from '../status-breakdown/status/status.model';

export type PersonInfo = Pick<Person, "id" | "name" | "relationshipType" | "lastContactDate"> & {
  status: Status['value']
}

@Component({
  selector: 'app-needs-attention',
  imports: [CardComponent, PersonComponent],
  templateUrl: './needs-attention.component.html',
  styleUrl: './needs-attention.component.css',
})
export class NeedsAttentionComponent {
  persons: PersonInfo[] = [
    {
      id: 'p1',
      name: 'Ahmed Hassan',
      relationshipType: 'friend',
      lastContactDate: '2026-08-15',
      status: 'due_soon'
    },
    {
      id: 'p2',
      name: 'Fatima Ali',
      relationshipType: 'immediate_family',
      lastContactDate: '2026-07-20',
      status: "on_track"
    },
    {
      id: 'p3',
      name: 'Omar Khaled',
      relationshipType: 'extended_family',
      lastContactDate: null,
      status: "never_contacted"
    },
  ];
}
