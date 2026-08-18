import { Component, input, output, signal } from '@angular/core';
import { Ticket } from './ticket.model';

@Component({
  selector: 'app-ticket',
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  data = input.required<Ticket>()
  detailsVisible = signal<boolean>(false)
  complete = output<string>()

  onToggleDetails() {
    this.detailsVisible.update(prevValue => !prevValue)
  }

  onTicketComplete() {
    this.complete.emit(this.data().id);
  }
}
