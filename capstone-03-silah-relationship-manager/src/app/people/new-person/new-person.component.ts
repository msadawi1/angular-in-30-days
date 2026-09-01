import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Relationship } from '../../core/models/relationship.model';
import { relationshipBaselineToken } from '../../core/tokens/relationship-baseline.token';
import { RelationshipLabelPipe } from '../../shared/pipes/relationship-label.pipe';
import { PeopleService } from '../../core/services/people-store.service';

type ImportantDateGroup = FormGroup<{
  label: FormControl<string>;
  date: FormControl<string>;
}>;

/** Mirrors the backend's PHONE_PATTERN (backend/src/common/validators.ts). */
const PHONE_PATTERN = /^\+?[\d][\d\s().-]{5,24}$/;

/** A person needs at least one way to reach them (people.service.ts#assertReachable). */
function reachableValidator(group: AbstractControl): ValidationErrors | null {
  const email = group.get('email')?.value;
  const phone = group.get('phone')?.value;
  return email || phone ? null : { reachable: true };
}

type ContactInfoGroup = FormGroup<{
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
}>;

@Component({
  selector: 'app-new-person',
  imports: [ReactiveFormsModule, RouterLink, RelationshipLabelPipe],
  templateUrl: './new-person.component.html',
  styleUrl: './new-person.component.css',
})
export class NewPersonComponent {
  readonly relationshipOptions = inject(relationshipBaselineToken);

  private peopleService = inject(PeopleService);
  private router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80)],
    }),
    relationshipType: new FormControl<Relationship>('other', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    customCadenceDays: new FormControl<number | null>(null, {
      validators: [Validators.min(1), Validators.max(365)],
    }),
    contactInfo: new FormGroup<ContactInfoGroup['controls']>(
      {
        email: new FormControl<string | null>(null, { validators: [Validators.email] }),
        phone: new FormControl<string | null>(null, {
          validators: [Validators.pattern(PHONE_PATTERN)],
        }),
      },
      { validators: [reachableValidator] },
    ),
    notes: new FormControl<string | null>(null),
    importantDates: new FormArray<ImportantDateGroup>([this.createImportantDateGroup()]),
    lastContactDate: new FormControl<string | null>(null),
  });

  get contactInfo() {
    return this.form.controls.contactInfo;
  }

  get showReachableError() {
    return (
      !!this.contactInfo.errors?.['reachable'] &&
      (this.contactInfo.controls.email.touched || this.contactInfo.controls.phone.touched)
    );
  }

  get importantDates() {
    return this.form.controls.importantDates;
  }

  addImportantDate() {
    this.importantDates.push(this.createImportantDateGroup());
  }

  removeImportantDate(index: number) {
    this.importantDates.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.peopleService
      .createPerson({
        name: value.name,
        relationshipType: value.relationshipType,
        customCadenceDays: value.customCadenceDays,
        email: value.contactInfo.email,
        phone: value.contactInfo.phone,
        notes: value.notes,
        lastContactDate: value.lastContactDate,
        importantDates: value.importantDates,
      })
      .subscribe(() => this.router.navigate(['/people']));
  }

  private createImportantDateGroup(label = '', date = ''): ImportantDateGroup {
    return new FormGroup({
      label: new FormControl(label, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      date: new FormControl(date, { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
