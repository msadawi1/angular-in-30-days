import { Component, input } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { RelationshipItemComponent } from './relationship-item/relationship-item.component';

@Component({
  selector: 'app-by-relationship',
  imports: [CardComponent, RelationshipItemComponent],
  templateUrl: './by-relationship.component.html',
  styleUrl: './by-relationship.component.css',
})
export class ByRelationshipComponent {
  countPerRelationship = input.required<{ label: string; count: number }[]>()
}
