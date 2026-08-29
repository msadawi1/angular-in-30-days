import { InjectionToken, Provider } from '@angular/core';
import { Relationship, RelationshipBaseline } from '../models/relationship.model';

const RELATIONSHIP_BASELINE: { value: Relationship; label: string; defaultCadenceDays: number }[] =
  [
    {
      value: 'immediate_family',
      label: 'Immediate Family',
      defaultCadenceDays: 7,
    },
    {
      value: 'extended_family',
      label: 'Extended Family',
      defaultCadenceDays: 30,
    },
    {
      value: 'close_friend',
      label: 'Close Friend',
      defaultCadenceDays: 14,
    },
    {
      value: 'friend',
      label: 'Friend',
      defaultCadenceDays: 45,
    },
    {
      value: 'colleague',
      label: 'Colleague',
      defaultCadenceDays: 90,
    },
    {
      value: 'other',
      label: 'Other',
      defaultCadenceDays: 60,
    },
  ];

export const relationshipBaselineToken = new InjectionToken<RelationshipBaseline>(
  'relationship.default.baseline',
);

export const relationshipBaselineProvider: Provider = {
  provide: relationshipBaselineToken,
  useValue: RELATIONSHIP_BASELINE,
};
