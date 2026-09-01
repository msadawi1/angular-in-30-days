import { afterRenderEffect, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { ContactLogService } from '../../core/services/contact-log.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactLog, ContactType } from '../../core/models/contact-log.model';
import { LogTypeLabelPipe } from '../../shared/pipes/log-type-label.pipe';
import { Person } from '../../core/models/person.model';

@Component({
  selector: 'app-log-contact-modal',
  imports: [ReactiveFormsModule, LogTypeLabelPipe],
  templateUrl: './log-contact-modal.component.html',
  styleUrl: './log-contact-modal.component.css',
})
export class LogContactModalComponent {
  personId = input.required<Person['id']>();

  form = new FormGroup({
    method: new FormControl<ContactType>('call', {
      validators: [Validators.required],
    }),
    date: new FormControl(this.today(), {
      validators: [Validators.required],
    }),
    notes: new FormControl(''),
  });

  private contactLogService = inject(ContactLogService);
  readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    afterRenderEffect(() => {
      this.dialogEl().nativeElement.showModal();
    });
  }

  onHide() {
    this.contactLogService.toggleLogContact(null);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === this.dialogEl().nativeElement) {
      this.onHide();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const contactLog: Pick<ContactLog, 'type' | 'date' | 'notes'> = {
      type: this.form.value.method!,
      date: this.form.value.date!,
      notes: this.form.value.notes ?? null,
    };

    this.contactLogService.addContactLogToPerson(contactLog).subscribe(() => this.onHide());
  }

  /** Local YYYY-MM-DD for today, matching the <input type="date"> value format. */
  private today(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }
}
