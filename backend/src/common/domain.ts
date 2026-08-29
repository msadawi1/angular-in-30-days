export const RELATIONSHIP_TYPES = [
  'immediate_family',
  'extended_family',
  'close_friend',
  'friend',
  'colleague',
  'other',
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

export const CONTACT_TYPES = ['call', 'visit', 'message', 'other'] as const;

export type ContactType = (typeof CONTACT_TYPES)[number];

/**
 * Factory baseline (spec §2.2). Immutable, shipped with the app.
 * The server keeps its own copy because it needs an effective cadence when
 * materialising `applyToExisting` writes; the client has the same table behind
 * the RELATIONSHIP_BASELINE injection token.
 */
export const FACTORY_CADENCE_DAYS: Readonly<Record<RelationshipType, number>> = Object.freeze({
  immediate_family: 7,
  extended_family: 30,
  close_friend: 14,
  friend: 45,
  colleague: 90,
  other: 60,
});

export const MIN_CADENCE_DAYS = 1;
export const MAX_CADENCE_DAYS = 365;
