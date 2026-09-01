import { Pipe, PipeTransform } from '@angular/core';
import { ContactType } from '../../core/models/contact-log.model';

/** Display names for the ways a contact can be logged. */
const LOG_TYPE_LABELS: Record<ContactType, string> = {
  call: 'Phone call',
  visit: 'In person',
  message: 'Message',
  other: 'Other',
};

@Pipe({ name: 'logTypeLabel' })
export class LogTypeLabelPipe implements PipeTransform {
  transform(type: ContactType): string {
    return LOG_TYPE_LABELS[type] ?? type;
  }
}
