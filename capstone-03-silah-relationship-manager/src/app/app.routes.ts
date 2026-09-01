import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PeopleComponent } from './people/people.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { NewPersonComponent } from './people/new-person/new-person.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Dashboard - Silah',
    data: { navLabel: 'Dashboard' },
  },
  {
    path: 'people',
    component: PeopleComponent,
    title: 'People - Silah',
    data: { navLabel: 'People' },
  },
  {
    path: 'people/new',
    component: NewPersonComponent,
  },
  {
    path: 'people/:id',
    component: ProfileComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings - Silah',
    data: { navLabel: 'Settings' },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
