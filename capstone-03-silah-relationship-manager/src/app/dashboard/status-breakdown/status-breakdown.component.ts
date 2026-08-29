import { Component, computed, input } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { StatusComponent } from './status/status.component';
import { Status } from '../../core/models/status.model';

@Component({
  selector: 'app-status-breakdown',
  imports: [CardComponent, StatusComponent],
  templateUrl: './status-breakdown.component.html',
  styleUrl: './status-breakdown.component.css',
})
export class StatusBreakdownComponent {
  countPerStatus = input.required<Record<Status, number>>();

  statusItems = computed<{ label: string; value: Status; count: number }[]>(() => [
    {
      label: 'Up to date',
      value: 'on_track',
      count: this.countPerStatus().on_track,
    },
    {
      label: 'Due soon',
      value: 'due_soon',
      count: this.countPerStatus().due_soon,
    },
    {
      label: 'Overdue',
      value: 'overdue',
      count: this.countPerStatus().overdue,
    },
    {
      label: 'Never contacted',
      value: 'never_contacted',
      count: this.countPerStatus().never_contacted,
    },
  ]);
}
