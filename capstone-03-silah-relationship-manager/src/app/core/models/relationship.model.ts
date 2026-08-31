export type Relationship =
  'immediate_family' | 'extended_family' | 'close_friend' | 'friend' | 'colleague' | 'other';

export type RelationshipBaseline = {
  value: Relationship;
  defaultCadenceDays: number;
}[];
