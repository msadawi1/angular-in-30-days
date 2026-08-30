import { Component, input } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { PersonComponent } from '../../shared/ui/person/person.component';
import { Person } from '../../core/models/person.model';

@Component({
  selector: 'app-needs-attention',
  imports: [CardComponent, PersonComponent],
  templateUrl: './needs-attention.component.html',
  styleUrl: './needs-attention.component.css',
})
export class NeedsAttentionComponent {
  peopleNeedAttention = input.required<Person[]>();
}
