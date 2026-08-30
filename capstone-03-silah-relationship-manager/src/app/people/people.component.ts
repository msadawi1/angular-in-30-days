import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { PeopleService } from '../core/services/people-store.service';
import { CadenceConfigService } from '../core/services/cadence-config.service';
import { StatusService } from '../core/services/status.service';
import { RelationshipItemComponent } from '../dashboard/by-relationship/relationship-item/relationship-item.component';
import { PersonComponent } from "../shared/ui/person/person.component";
import { CardComponent } from "../shared/ui/card/card.component";
import { PeopleListComponent } from "./people-list/people-list.component";

@Component({
  selector: 'app-people',
  imports: [PersonComponent, CardComponent, PeopleListComponent],
  templateUrl: './people.component.html',
  styleUrl: './people.component.css',
})
export class PeopleComponent implements OnInit {
  private peopleService = inject(PeopleService);
  private cadenceConfigService = inject(CadenceConfigService);
  private statusService = inject(StatusService);
  private destroyRef = inject(DestroyRef);

  peopleWithStatus = this.statusService.peopleWithStatus;

  ngOnInit(): void {
    // populate people & cadence data on load
    const peopleSub = this.peopleService.loadPeople().subscribe();
    const cadenceSub = this.cadenceConfigService.loadUserCadenceConfig().subscribe();
    this.destroyRef.onDestroy(() => {
      cadenceSub.unsubscribe();
      peopleSub.unsubscribe();
    });
  }
}
