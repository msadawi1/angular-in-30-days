import { Pipe, PipeTransform } from '@angular/core';
import { Relationship } from '../../core/models/relationship.model';

/** Display names for the relationship types. Presentation only — the cadence
 * baseline behind `relationshipBaselineToken` carries the domain values. */
const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  immediate_family: 'Immediate Family',
  extended_family: 'Extended Family',
  close_friend: 'Close Friend',
  friend: 'Friend',
  colleague: 'Colleague',
  other: 'Other',
};

@Pipe({ name: 'relationshipLabel' })
export class RelationshipLabelPipe implements PipeTransform {
  transform(type: Relationship): string {
    return RELATIONSHIP_LABELS[type] ?? type;
  }
}
