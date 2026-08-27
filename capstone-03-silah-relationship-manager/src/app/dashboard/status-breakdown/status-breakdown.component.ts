import { Component } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { StatusComponent } from './status/status.component';
import { Status } from './status/status.model';

@Component({
  selector: 'app-status-breakdown',
  imports: [CardComponent, StatusComponent],
  templateUrl: './status-breakdown.component.html',
  styleUrl: './status-breakdown.component.css',
})
export class StatusBreakdownComponent {
  status_items: Status[] = [
    {
      label: "Up to date",
      value: "on_track",
      count: 6
    },
    {
      label: "Due soon",
      value: "due_soon",
      count: 2
    },
    {
      label: "Overdue",
      value: "overdue",
      count: 3
    },
    {
      label: "Never contacted",
      value: "never_contacted",
      count: 4
    },
  ]
}
