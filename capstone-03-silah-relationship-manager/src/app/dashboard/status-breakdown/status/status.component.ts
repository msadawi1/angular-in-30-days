import { Component, input } from '@angular/core';
import { Status } from './status.model';

@Component({
  selector: 'app-status',
  imports: [],
  host: {
    '[class.on-track]': 'statusData().value === "on_track"',
    '[class.due-soon]': 'statusData().value === "due_soon"',
    '[class.never-contacted]': 'statusData().value === "never_contacted"',
    '[class.overdue]': 'statusData().value === "overdue"',
  },
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  statusData = input.required<Status>();
}
