import { Component } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { RelationshipItemComponent } from './relationship-item/relationship-item.component';

@Component({
  selector: 'app-by-relationship',
  imports: [CardComponent, RelationshipItemComponent],
  templateUrl: './by-relationship.component.html',
  styleUrl: './by-relationship.component.css',
})
export class ByRelationshipComponent {
  relationshipCount = [
    {
      label: 'Immediate Family',
      count: 1,
    },
    {
    label: 'Extended Family',
    count: 2
  },
  {
    label: "Friend",
    count: 1
  },
  {
    label: "Close Friend",
    count: 4
  },
  {
    label: "Collegue",
    count: 3
  },
  {
    label: "Other",
    count: 2
  },
  ];
}
