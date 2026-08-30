import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Dashboard - Silah',
    data: { navLabel: 'Dashboard' }
  },
  {
    path: 'people',
    component: NotFoundComponent, // TODO: replace with real profile page
    title: 'People - Silah',
    data: { navLabel: 'People' }
  },
  {
    path: 'settings',
    component: NotFoundComponent,
    title: 'Settings - Silah',
    data: { navLabel: 'Settings' }
  },
  {
    path: 'people/:id',
    component: NotFoundComponent, // TODO: replace with real profile page
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
