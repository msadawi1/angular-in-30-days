import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/ui/card/card.component';
import { NotesComponent } from './notes/notes.component';
import { ImportantDatesComponent } from './important-dates/important-dates.component';
import { DaysSincePipe } from '../../shared/pipes/days-since.pipe';
import { Person } from '../../core/models/person.model';
import { RelationshipLabelPipe } from '../../shared/pipes/relationship-label.pipe';
import { StatusLabelPipe } from '../../shared/pipes/status-label.pipe';
import { ContactLogService } from '../../core/services/contact-log.service';
import { relationshipBaselineToken } from '../../core/tokens/relationship-baseline.token';
import { CadenceConfigService } from '../../core/services/cadence-config.service';

@Component({
  selector: 'app-profile-overview',
  host: {
    '[class.on-track]': 'person().status === "on_track"',
    '[class.due-soon]': 'person().status === "due_soon"',
    '[class.never-contacted]': 'person().status === "never_contacted"',
    '[class.overdue]': 'person().status === "overdue"',
  },
  imports: [
    CardComponent,
    NotesComponent,
    ImportantDatesComponent,
    DaysSincePipe,
    DatePipe,
    RelationshipLabelPipe,
    StatusLabelPipe,
  ],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.css',
})
export class ProfileOverviewComponent {
  person = input.required<Person>();

  private contactLogService = inject(ContactLogService);
  private relationshipBaseline = inject(relationshipBaselineToken);
  private cadenceConfigService = inject(CadenceConfigService);

  constructor() {
    // The live per-type config only loads via the Settings page today — make
    // sure it's there too when landing straight on a profile (FR-2.2).
    if (!this.cadenceConfigService.loadedUserCadenceConfig()) {
      this.cadenceConfigService.loadUserCadenceConfig().subscribe();
    }
  }
  
  cadenceDays = computed(() => {
    const person = this.person();
    const liveConfig = this.cadenceConfigService.loadedUserCadenceConfig();
    const factoryDefault = this.relationshipBaseline.find(
      (baseline) => baseline.value === person.relationshipType,
    )?.defaultCadenceDays;

    return person.customCadenceDays ?? liveConfig?.[person.relationshipType] ?? factoryDefault;
  });

  isCustomCadence = computed(() => this.person().customCadenceDays !== null);

  onLogContact() {
    this.contactLogService.toggleLogContact(this.person());
  }
}
