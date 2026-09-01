import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/ui/card/card.component';
import { NotesComponent } from './notes/notes.component';
import { ImportantDatesComponent } from './important-dates/important-dates.component';
import { DaysSincePipe } from '../../shared/pipes/days-since.pipe';
import { Person } from '../../core/models/person.model';
import { RelationshipLabelPipe } from '../../shared/pipes/relationship-label.pipe';
import { StatusLabelPipe } from '../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-profile-overview',
  host: {
    '[class.on-track]': 'person().status === "on_track"',
    '[class.due-soon]': 'person().status === "due_soon"',
    '[class.never-contacted]': 'person().status === "never_contacted"',
    '[class.overdue]': 'person().status === "overdue"',
  },
  imports: [
    CardComponent,
    NotesComponent,
    ImportantDatesComponent,
    DaysSincePipe,
    DatePipe,
    RelationshipLabelPipe,
    StatusLabelPipe
  ],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.css',
})
export class ProfileOverviewComponent {
  person = input.required<Person>();
}
