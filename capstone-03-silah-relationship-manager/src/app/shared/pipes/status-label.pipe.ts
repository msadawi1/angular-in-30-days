import { inject, Pipe, PipeTransform } from '@angular/core';
import { Status } from '../../core/models/status.model';
import { statusOptionsToken } from '../../core/tokens/status.token';

/** Contact status to its display name. Falls back to the raw value so an
 * unknown status shows up instead of rendering blank. */
@Pipe({ name: 'statusLabel' })
export class StatusLabelPipe implements PipeTransform {
  private options = inject(statusOptionsToken);

  transform(status: Status): string {
    return this.options.find((option) => option.value === status)?.label ?? status;
  }
}
