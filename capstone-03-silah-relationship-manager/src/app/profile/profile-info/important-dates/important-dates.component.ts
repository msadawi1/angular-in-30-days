import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ImportantDate } from '../../../core/models/important-date.model';

@Component({
  selector: 'app-important-dates',
  imports: [CardComponent, DatePipe],
  templateUrl: './important-dates.component.html',
  styleUrl: './important-dates.component.css',
})
export class ImportantDatesComponent {
  dates = input.required<ImportantDate[]>();
}
