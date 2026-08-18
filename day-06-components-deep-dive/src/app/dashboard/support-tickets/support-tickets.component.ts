import { Component } from '@angular/core';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { Ticket } from './ticket/ticket.model';
import { TicketComponent } from './ticket/ticket.component';

@Component({
  selector: 'app-support-tickets',
  imports: [NewTicketComponent, TicketComponent],
  templateUrl: './support-tickets.component.html',
  styleUrl: './support-tickets.component.css',
})
export class SupportTicketsComponent {
  tickets: Ticket[] = [];

  onAdd(ticketData: Pick<Ticket, 'title' | 'request'>) {
    this.tickets.push({
      id: Math.random().toString(),
      title: ticketData.title,
      request: ticketData.request,
      status: 'open',
    });
  }

  onTicketComplete(id: string) {
    let targetTicket = this.tickets.find((ticket) => ticket.id === id);
    if (!targetTicket) return;
    targetTicket.status = 'closed'
  }
}
