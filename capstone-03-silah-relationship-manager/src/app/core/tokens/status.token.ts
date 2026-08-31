import { InjectionToken, Provider } from '@angular/core';
import { Status } from '../models/status.model';

export type StatusOptions = { value: Status; label: string }[];

const STATUS_OPTIONS: StatusOptions = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'due_soon', label: 'Due Soon' },
  { value: 'never_contacted', label: 'Never Contacted' },
  { value: 'on_track', label: 'Up To Date' },
];

export const statusOptionsToken = new InjectionToken<StatusOptions>('status.options.token');

export const statusOptionsProvider: Provider = {
  provide: statusOptionsToken,
  useValue: STATUS_OPTIONS,
};
