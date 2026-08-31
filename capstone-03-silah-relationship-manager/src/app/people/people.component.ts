import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PeopleService } from '../core/services/people-store.service';
import { PeopleListComponent } from './people-list/people-list.component';

@Component({
  selector: 'app-people',
  imports: [PeopleListComponent],
  templateUrl: './people.component.html',
  styleUrl: './people.component.css',
})
export class PeopleComponent implements OnInit {
  private peopleService = inject(PeopleService);
  private destroyRef = inject(DestroyRef);

  people = this.peopleService.loadedPeople;

  ngOnInit(): void {
    const peopleSub = this.peopleService.loadPeople().subscribe();
    this.destroyRef.onDestroy(() => peopleSub.unsubscribe());
  }
}
