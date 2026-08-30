import { InjectionToken, Provider } from '@angular/core';
import { Status } from '../models/status.model';

const STATUS_OPTIONS: { value: Status; label: string }[] =
  [
    {
      value: 'overdue',
      label: 'Overdue',
    },
    {
      value: 'due_soon',
      label: 'Due Soon',
    },
    {
      value: 'never_contacted',
      label: 'Never Contacted',
    },
    {
      value: 'on_track',
      label: 'Up To Date',
    }
  ];

export const statusOptionsToken = new InjectionToken<{ value: Status; label: string }[]>(
  'status.options.token',
);

export const statusOptionsProvider: Provider = {
  provide: statusOptionsToken,
  useValue: STATUS_OPTIONS,
};
