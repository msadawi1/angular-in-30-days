import { Component, input } from '@angular/core';
import { Relationship } from '../../../core/models/relationship.model';
import { RelationshipLabelPipe } from '../../../shared/pipes/relationship-label.pipe';

@Component({
  selector: 'app-relationship-item',
  imports: [RelationshipLabelPipe],
  templateUrl: './relationship-item.component.html',
  styleUrl: './relationship-item.component.css',
})
export class RelationshipItemComponent {
  relationship = input.required<{ relationship: Relationship; count: number }>();
}
