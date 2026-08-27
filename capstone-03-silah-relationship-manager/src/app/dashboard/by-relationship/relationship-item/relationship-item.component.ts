import { Component, input } from '@angular/core';

@Component({
  selector: 'app-relationship-item',
  imports: [],
  templateUrl: './relationship-item.component.html',
  styleUrl: './relationship-item.component.css'
})
export class RelationshipItemComponent {
  label = input.required()
  count = input.required()
}
