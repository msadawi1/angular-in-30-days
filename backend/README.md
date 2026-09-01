# Silah API

NestJS + SQLite backend for the Silah relationship manager, built to
`capstone-03-silah-relationship-manager/spec.md` Part 4.

Deliberately a separate project. It shares no code, no types, no build and no
`node_modules` with the Angular app — the only contract between them is the HTTP
surface below. Duplicating the handful of type definitions on the client is the
price of that independence, and it is the right trade: a shared types package
would couple the two builds and make the "swap the store from in-memory to
`HttpClient`" phase a refactor of both sides at once.

## Run it

```bash
cd backend
npm install
npm run seed        # optional: 6 people covering every status branch
npm run start:dev   # http://localhost:3000/api
```

`npm run build` then `npm run start:prod` for the compiled version.

Config is read from the environment, all with working defaults — see
`.env.example`. `PORT=3000`, `DATABASE_PATH=silah.sqlite`,
`CORS_ORIGIN=http://localhost:4200`.

## Auth

None. Spec NFR-1's placeholder `X-Api-Key` guard was removed — single user,
single device, not worth the extra moving part in v1.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/health` | Public. Liveness only. |
| `GET` | `/api/people` | `?search=&type=` |
| `POST` | `/api/people` | 201 with the created person |
| `GET` | `/api/people/check-name` | `?name=&excludeId=` → `{ exists }` |
| `GET` | `/api/people/:id` | |
| `DELETE` | `/api/people/:id` | 204, cascades logs and important dates |
| `GET` | `/api/people/:id/logs` | Newest first |
| `POST` | `/api/people/:id/logs` | `{ type, date?, notes? }`; date defaults to today |
| `DELETE` | `/api/logs/:id` | Returns the person with `lastContactDate` recomputed |
| `GET` | `/api/config/cadences` | Full six-type map — factory rows are seeded on boot, so this is never partial |
| `GET` | `/api/config/cadences/usage` | Per-type count of active people still on the default (FR-5.4) |
| `PUT` | `/api/config/cadences` | `{ overrides, applyToExisting? }`; replaces the whole map |
| `DELETE` | `/api/config/cadences` | Reset to factory (FR-5.6) |

`/usage` is the one addition to the spec's endpoint list: FR-5.4 needs a count
the client cannot derive without loading every person.

### Errors

Every failure — validation, 404, bad key, unhandled throw — comes back in one
shape, so the Angular interceptor never inspects status codes (NFR-4):

```json
{ "error": { "code": "VALIDATION_FAILED", "message": "...", "fields": { "name": "..." } } }
```

Codes: `VALIDATION_FAILED`, `NOT_FOUND`, `UNAUTHORIZED`, `INTERNAL`. `fields` is
present only when a specific field is at fault, and its keys match the request
body paths so a form can map them straight onto controls.

## What the server enforces

- `lastContactDate` only ever moves **forward** on a new log (FR-2.2) — a
  backdated log is kept for history but does not rewrite the person as less
  recently contacted.
- Deleting a log rewinds `lastContactDate` to the newest remaining log, or
  `null` when none is left (FR-2.5).
- Future dates are rejected on contact logs and on `lastContactDate`.
- A person must have a phone or an email (FR-3.4), checked on create.
- Deleting a person deletes their logs and important dates.
- Unknown body keys are rejected rather than ignored.

Every person resource also carries `status` and `dueInDays`, computed server-side
from the same §2.3 algorithm using the current effective cadence. This is a
convenience, not the source of truth: the client still runs its own `computed()`
chain (spec §4.2) so a local, unsaved cadence-settings edit recomputes statuses
immediately (FR-5.7) without waiting on a round trip.

### Deviation: no `initialContactEstimate`

The spec keeps the add-flow's "last spoke" chip (FR-1.4) in its own field so the
timeline never shows a contact that did not happen. That field is dropped here.
`POST /api/people` accepts `lastContactDate` directly instead, and the client's
status baseline collapses to `lastContactDate ?? createdAt`.

Two consequences to know about:

- A newly added person can read as "last contacted a month ago" with an empty
  contact timeline, because the chip value is no longer distinguishable from a
  logged contact.
- Deleting a person's only log rewinds `lastContactDate` to `null`, not back to
  the date the add-flow set. The chip value is gone once a log supersedes it.

## Cadence inheritance — the decision behind `customCadenceDays: null`

Spec Open Decision #1 leaves this to the implementer, and FR-5.3 and §4.3 pull in
opposite directions. This server implements **live inheritance**:

- `customCadenceDays: null` means "follows the current effective default",
  always. Changing a default in Settings moves everyone who has not overridden,
  with no writes to the people table.
- `applyToExisting: true` then **pins** the new number onto those people
  (`customCadenceDays = newValue`), so a later default change no longer moves
  them. This is the batch update §4.3 describes.
- People with a manual override are never touched by either path (FR-5.5).

The cost is the deviation from FR-5.3: existing non-overridden people do shift
when a default changes. The gain is that `null` stays meaningful forever, so the
Settings screen never degrades into a no-op — which is the failure mode the spec
warns about. Switching to the snapshot model later means one change in
`CadenceService.replaceOverrides`.

## Schema

`synchronize: true` — a single-user learning project against a disposable local
file. Swap it for migrations before any deployment where the data matters.

Tables: `people`, `important_dates`, `contact_logs`, `cadence_overrides`.
Dates that are day-granular (`lastContactDate`, log `date`,
important dates) are stored as `YYYY-MM-DD` strings, deliberately: the domain has
no time-of-day, and `Date` columns would drag timezone drift into comparisons
that are supposed to be plain calendar arithmetic.
