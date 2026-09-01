import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/ui/card/card.component';
import { ContactLog } from '../../core/models/contact-log.model';
import { LogTypeLabelPipe } from '../../shared/pipes/log-type-label.pipe';

@Component({
  selector: 'app-contact-history',
  imports: [CardComponent, DatePipe, LogTypeLabelPipe],
  templateUrl: './contact-history.component.html',
  styleUrl: './contact-history.component.css',
})
export class ContactHistoryComponent {
  contactLogs = input.required<ContactLog[]>();
}
