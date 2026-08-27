import { Component, input } from '@angular/core';
import { PersonInfo } from '../needs-attention.component';

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
  person = input.required<PersonInfo>()
}
