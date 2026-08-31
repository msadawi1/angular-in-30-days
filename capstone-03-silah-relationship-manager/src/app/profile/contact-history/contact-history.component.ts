import { Component, input } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { ContactLog } from '../../core/models/contact-log.model';

@Component({
  selector: 'app-contact-history',
  imports: [CardComponent],
  templateUrl: './contact-history.component.html',
  styleUrl: './contact-history.component.css',
})
export class ContactHistoryComponent {
  contactLogs = input.required<ContactLog[]>();
}
