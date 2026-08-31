import { InjectionToken, Provider } from '@angular/core';
import { RelationshipBaseline } from '../models/relationship.model';

/** Factory cadence defaults (spec §2.2). Display names live with the
 * `relationshipLabel` pipe — this table is domain data, not presentation. */
const RELATIONSHIP_BASELINE: RelationshipBaseline = [
  { value: 'immediate_family', defaultCadenceDays: 7 },
  { value: 'extended_family', defaultCadenceDays: 30 },
  { value: 'close_friend', defaultCadenceDays: 14 },
  { value: 'friend', defaultCadenceDays: 45 },
  { value: 'colleague', defaultCadenceDays: 90 },
  { value: 'other', defaultCadenceDays: 60 },
];

export const relationshipBaselineToken = new InjectionToken<RelationshipBaseline>(
  'relationship.default.baseline',
);

export const relationshipBaselineProvider: Provider = {
  provide: relationshipBaselineToken,
  useValue: RELATIONSHIP_BASELINE,
};
