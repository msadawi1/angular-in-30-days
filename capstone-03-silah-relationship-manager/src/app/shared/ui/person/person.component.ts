import { Component, computed, inject, input } from '@angular/core';
import { Person } from '../../../core/models/person.model';
import { relationshipBaselineToken } from '../../../core/tokens/relationship-baseline.token';
import { ChevronRightIconComponent } from '../../../shared/ui/chevron-right-icon/chevron-right-icon.component';
import { RouterLink } from '@angular/router';
import { RelationshipLabelPipe } from '../../pipes/relationship-label.pipe';
import { ContactLogService } from '../../../core/services/contact-log.service';

const days = (count: number) => `${count} day${count === 1 ? '' : 's'}`;

@Component({
  selector: 'app-person',
  imports: [ChevronRightIconComponent, RouterLink, RelationshipLabelPipe],
  host: {
    '[class.on-track]': 'person().status === "on_track"',
    '[class.due-soon]': 'person().status === "due_soon"',
    '[class.never-contacted]': 'person().status === "never_contacted"',
    '[class.overdue]': 'person().status === "overdue"',
  },
  templateUrl: './person.component.html',
  styleUrl: './person.component.css',
})
export class PersonComponent {
  person = input.required<Person>();
  showControls = input<boolean>(false);
  contactLogService = inject(ContactLogService);

  /** Reads the server-derived countdown; `dueInDays` is negative once overdue. */
  contactSummary = computed(() => {
    const { status, dueInDays } = this.person();

    if (status === 'never_contacted' || dueInDays === null) {
      return { className: 'never-contacted', text: 'Never contacted' };
    }
    if (status === 'overdue') {
      return { className: 'overdue', text: `${days(-dueInDays)} overdue` };
    }

    const className = status === 'due_soon' ? 'due-soon' : 'on-track';
    return {
      className,
      text: dueInDays === 0 ? 'contact today' : `contact in ${days(dueInDays)}`,
    };
  });

  onLogContact(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.contactLogService.toggleLogContact(this.person().id);
  }
}
