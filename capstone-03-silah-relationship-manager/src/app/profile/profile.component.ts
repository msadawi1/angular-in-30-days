import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardComponent } from '../shared/ui/card/card.component';
import { PeopleService } from '../core/services/people-store.service';
import { Person } from '../core/models/person.model';
import { ContactLogService } from '../core/services/contact-log.service';
import { ContactLog } from '../core/models/contact-log.model';
import { ProfileOverviewComponent } from "./profile-info/profile-overview.component";
import { ContactHistoryComponent } from "./contact-history/contact-history.component";

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CardComponent, ProfileOverviewComponent, ContactHistoryComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  person = signal<Person | undefined>(undefined);
  contactLogs = signal<ContactLog[] | undefined>(undefined);

  private peopleService = inject(PeopleService);
  private contactLogService = inject(ContactLogService);
  private activatedRoute = inject(ActivatedRoute);

  private personId = this.activatedRoute.snapshot.params['id'];

  ngOnInit(): void {
    this.peopleService.loadPerson(this.personId).subscribe({
      next: (person) => this.person.set(person),
    });
    this.contactLogService.loadPersonContactLogs(this.personId).subscribe({
      next: (logs) => this.contactLogs.set(logs),
    });
  }
}
