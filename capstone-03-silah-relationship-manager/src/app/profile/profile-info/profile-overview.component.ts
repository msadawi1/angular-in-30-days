import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/ui/card/card.component';
import { NotesComponent } from './notes/notes.component';
import { ImportantDatesComponent } from './important-dates/important-dates.component';
import { DaysSincePipe } from '../../shared/pipes/days-since.pipe';
import { Person } from '../../core/models/person.model';

@Component({
  selector: 'app-profile-overview',
  imports: [CardComponent, NotesComponent, ImportantDatesComponent, DaysSincePipe, DatePipe],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.css',
})
export class ProfileOverviewComponent {
  person = input.required<Person>();
}
