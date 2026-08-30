import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { IndicatorComponent } from './indicator/indicator.component';
import { StatusBreakdownComponent } from './status-breakdown/status-breakdown.component';
import { NeedsAttentionComponent } from './needs-attention/needs-attention.component';
import { ByRelationshipComponent } from './by-relationship/by-relationship.component';
import { ChevronRightIconComponent } from '../shared/ui/chevron-right-icon/chevron-right-icon.component';
import { PeopleService } from '../core/services/people-store.service';
import { StatusService } from '../core/services/status.service';
import { CadenceConfigService } from '../core/services/cadence-config.service';
import { Status } from '../core/models/status.model';
import { relationshipBaselineToken } from '../core/tokens/relationship-baseline.token';
import { RouterLink } from "@angular/router";

// Dashboard owns data fetching and passes them to children components
@Component({
  selector: 'app-dashboard',
  imports: [
    IndicatorComponent,
    StatusBreakdownComponent,
    NeedsAttentionComponent,
    ByRelationshipComponent,
    ChevronRightIconComponent,
    RouterLink
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private peopleService = inject(PeopleService);
  private cadenceConfigService = inject(CadenceConfigService);
  private relationshipBaseline = inject(relationshipBaselineToken);
  private statusService = inject(StatusService);
  private destroyRef = inject(DestroyRef);

  // reference the signal to always stay up to date with the data in the service
  people = this.peopleService.loadedPeople;
  peopleWithStatus = this.statusService.peopleWithStatus;

  needAttention = computed(() => {
    const peopleWithStatus = this.peopleWithStatus();
    if (!peopleWithStatus) return;
    return peopleWithStatus.filter(
      (person) =>
        person.status === 'due_soon' ||
        person.status === 'never_contacted' ||
        person.status === 'overdue',
    );
  });

  indicators = computed(() => {
    const peopleWithStatus = this.peopleWithStatus();
    const needAttention = this.needAttention();
    const people = this.people();

    if (!peopleWithStatus || !people || !needAttention) return;

    const upToDate = peopleWithStatus.filter((person) => person.status === 'on_track');

    return {
      peopleTracked: people.length,
      needAttention: needAttention.length,
      upToDate: upToDate.length,
    };
  });

  statusBreakdown = computed(() => {
    const peopleWithStatus = this.peopleWithStatus();
    if (!peopleWithStatus) return;

    // Every status starts at 0 so a status nobody currently has still renders
    // as a real count instead of `undefined`.
    const countPerStatus: Record<Status, number> = {
      overdue: 0,
      due_soon: 0,
      never_contacted: 0,
      on_track: 0,
    };

    for (const person of peopleWithStatus) {
      countPerStatus[person.status] += 1;
    }

    return countPerStatus;
  });

  countPerRelationship = computed(() => {
    const people = this.peopleService.loadedPeople();
    if (!people) return;

    const countPerRelationship = [];

    // iniitalize all values to 0
    for (const relationship of this.relationshipBaseline) {
      countPerRelationship.push({
        label: relationship.label,
        count: people.filter((person) => person.relationshipType === relationship.value).length,
      });
    }

    return countPerRelationship;
  });

  ngOnInit(): void {
    const peopleSub = this.peopleService.loadPeople().subscribe();
    const cadenceSub = this.cadenceConfigService.loadUserCadenceConfig().subscribe();
    this.destroyRef.onDestroy(() => {
      cadenceSub.unsubscribe();
      peopleSub.unsubscribe();
    });
  }
}
