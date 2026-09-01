# صلة (Silah) — Complete Build Specification

**One-line:** A relationship-maintenance app that tells you who you've been neglecting and reminds you to reach out, so keeping in touch stops depending on memory.

**Stack:** Angular 19 standalone (single app) · NestJS API (AI-generated) · PostgreSQL or SQLite · Real HTTP.

---

# PART 1 — PRODUCT

## 1.1 Problem statement

Maintaining relationships fails not from lack of care but from lack of *salience*. You don't decide to neglect an aunt for eight months — she simply never crosses your mind on a day you had time. Existing tools don't solve this: contact apps store data but never surface it, calendars need you to know the date in advance, and generic reminder apps make you manually re-schedule after every single interaction.

Silah inverts this: instead of you remembering people, the app surfaces them based on elapsed time against a per-person expected cadence.

## 1.2 Users and scope

Single user, own device. No multi-user, sharing, or collaboration. No authentication in v1 (see NFR-1 for why, and what replaces it).

## 1.3 User stories

**Setup**
- **US-1** — As a user, I want to add a person with just a name and relationship type, so that adding people is fast enough that I actually do it.
- **US-2** — As a user, I want each relationship type to come with a sensible default contact cadence, so that I don't have to think about numbers for every person.
- **US-3** — As a user, I want to override the cadence for a specific person, so that a mother on weekly and a friend abroad on quarterly can coexist.
- **US-4** — As a user, I want to set roughly when I last spoke to someone by tapping one option rather than typing a date, so that adding a person stays a few seconds of work.
- **US-5** — As a user, I want to store phone/email and personal notes, so that when the app tells me to reach out, I can act immediately without switching apps.
- **US-17** — As a user, I want to change the default cadence for a whole relationship type, so that if my sense of "how often is right for a colleague" differs from the app's, I fix it once instead of per person.

**Daily loop**
- **US-6** — As a user, I want to open the app and immediately see who is most overdue, so that I know who to contact today without scanning a full list.
- **US-7** — As a user, I want to log a contact in one tap directly from the list, so that logging never feels like admin work.
- **US-8** — As a user, I want to record what kind of contact it was (call/visit/message), so that a two-minute text isn't recorded as equivalent to a visit.
- **US-9** — As a user, I want to see a person's contact history before reaching out, so that I can remember what we last discussed.
- **US-10** — As a user, I want to log a contact that happened in the past by tapping a rough option, so that forgetting to log for a few days doesn't corrupt my data or cost me a date picker.

**Reminders**
- **US-11** — As a user, I want a browser notification when people become overdue, so that the app reminds me instead of me remembering the app.
- **US-12** — As a user, I want to control whether and when notifications fire, so that the app doesn't become noise I ignore.

**Staying honest**
- **US-15** — As a user, I want to see how many people I'm currently behind on, so that I have a single signal of how I'm doing.

**Finding people**
- **US-16** — As a user, I want to search by name and filter by relationship type or status, so that the list stays usable past ~30 people.

## 1.4 Use cases

### UC-1: Add a person
- **Trigger:** User taps "Add person."
- **Precondition:** None.
- **Main flow:**
  1. User enters name and picks a relationship type.
  2. App pre-fills cadence from that type's current default (user-configured value if set, otherwise factory default).
  3. User optionally overrides cadence, adds phone/email, notes, and important dates.
  4. User taps **one** "last spoke" chip — no typing, no date picker (see FR-1.4).
  5. App validates, checks for a name duplicate, saves.
  6. New person appears with a status computed from the chosen chip, or `never_contacted` if "Never" was chosen.
- **Edge cases:**
  - Duplicate name → warn, allow override (namesakes are legitimate).
  - Changing relationship type after manually overriding cadence → the manual value is kept, not clobbered.
  - Backend unreachable → form retains input, shows error, allows retry. Never silently discards typed data.

### UC-2: Review who needs attention
- **Trigger:** User opens the app, or taps a notification.
- **Precondition:** ≥1 person exists.
- **Main flow:**
  1. App loads people and computes each one's status and urgency ratio.
  2. Dashboard shows overdue first (most urgent first), then never-contacted, then due-soon.
  3. Each entry shows name, relationship, how long it's been, and a one-tap log action.
- **Edge cases:**
  - Zero people → onboarding empty state prompting UC-1, not a blank screen.
  - Nobody overdue → positive confirmation state, not an empty list.

### UC-3: Log a contact
- **Trigger:** User taps "Log contact" from the list or the person's page.
- **Precondition:** Person exists.
- **Main flow:**
  1. User taps a contact type chip; date defaults to today.
  2. If it wasn't today, user taps a "when" chip (Today / Yesterday / A few days ago / About a week ago). An exact date picker exists but is collapsed behind "pick exact date."
  3. Notes are optional and never block saving.
  4. App saves the log and updates `lastContactDate`.
  5. Person's status recomputes; they leave the overdue list immediately.
- **Edge cases:**
  - Backdated log older than the current `lastContactDate` → save for history, do **not** move `lastContactDate` backwards.
  - Future date → rejected.
  - Save fails → roll back the optimistic status change and surface the error.

### UC-4: Change a relationship type's default cadence
- **Trigger:** User edits a cadence value on the Settings page.
- **Precondition:** None.
- **Main flow:**
  1. User adjusts the number for one or more types.
  2. App shows how many existing people currently follow each changed default.
  3. On save, the new default applies to **people added from now on**. Existing people are unaffected.
  4. Newly added people of that type now pre-fill with the new value.
- **Edge cases:**
  - User explicitly opts into "apply to existing people who follow this default" → those people update too. Anyone with a manual override is never touched, either way.
  - "Reset to defaults" restores the factory values from the injected baseline.
  - Value outside 1–365 → rejected before save.

## 1.5 Explicitly out of scope for v1

Multi-user/auth · contact import from phone · SMS/email sending from the app · recurring calendar events · gift/occasion budgeting · relationship graph between people · mobile native app.

---

# PART 2 — DOMAIN MODEL & CORE LOGIC

## 2.1 Entities

```ts
type RelationshipType =
  | 'immediate_family' | 'extended_family' | 'close_friend'
  | 'friend' | 'colleague' | 'other';

type ContactType = 'call' | 'visit' | 'message' | 'other';

type PersonStatus =
  | 'never_contacted' | 'on_track' | 'due_soon' | 'overdue';

interface Person {
  id: string;
  name: string;
  relationshipType: RelationshipType;
  phone: string | null;
  email: string | null;
  customCadenceDays: number | null;    // null = follows the type default
  notes: string | null;
  importantDates: ImportantDate[];
  lastContactDate: string | null;      // ISO date; null = never contacted
  createdAt: string;
  updatedAt: string;
  // Server-computed, present only on responses (§2.3, §4.3):
  status: PersonStatus;
  dueInDays: number | null;            // cadence days remaining; negative once overdue
}

interface ImportantDate {
  id: string;
  label: string;                        // "Birthday", "Anniversary"
  date: string;                         // ISO date
}

interface ContactLog {
  id: string;
  personId: string;
  type: ContactType;
  date: string;                         // ISO date, never in the future
  notes: string | null;
  createdAt: string;
}

interface CadenceConfig {
  // user-editable overrides, partial — missing keys fall back to factory
  [K in RelationshipType]?: number;
}
```

**Deviation from an earlier draft:** this spec once kept the add-flow chip's estimate in its own `initialContactEstimate` field, separate from `lastContactDate`, so the timeline would never imply a logged contact that never happened. The backend collapses that into `lastContactDate` directly — `POST /api/people` accepts `lastContactDate` straight from the chip, and there is no second field. Two consequences:

- A newly added person can read as "last contacted a month ago" with an empty contact timeline, because the chip value is no longer distinguishable from a logged contact.
- Deleting a person's only log rewinds `lastContactDate` to `null`, not back to the chip's estimate — it's gone once a log has superseded it (see FR-2.5).

## 2.2 Relationship configuration

Two layers:

1. **Factory baseline** — immutable, shipped with the app, injected as a constant.
2. **User overrides** — persisted, editable in Settings, layered on top at read time.

```
cadenceFor(type) = userOverrides[type] ?? FACTORY_BASELINE[type].defaultCadenceDays
```

| Type | Label | Factory cadence |
|---|---|---|
| `immediate_family` | Immediate Family | 7 days |
| `extended_family` | Extended Family | 30 days |
| `close_friend` | Close Friend | 14 days |
| `friend` | Friend | 45 days |
| `colleague` | Colleague | 90 days |
| `other` | Other | 60 days |

The factory layer isn't redundant — it's what "Reset to defaults" reads from, and it guarantees `cadenceFor()` always returns a number regardless of what the user has or hasn't customised.

## 2.3 Status computation — the core algorithm

**Where it runs:** both sides, deliberately. The client computes it as pure derived state (`computed()`, §4.2) so a local, unsaved cadence-settings edit recomputes every status immediately, with no round trip (FR-5.7). The server (`person-view.ts`) computes the same algorithm and stamps `status` + `dueInDays` onto every `Person` it returns, using the current effective cadence — a convenience for any consumer that isn't running the Angular store, not a replacement for the client chain.

```
cadence      = person.customCadenceDays ?? cadenceFor(person.relationshipType)
baselineDate = person.lastContactDate ?? person.createdAt
daysSince    = daysBetween(baselineDate, today)
urgency      = daysSince / cadence        // normalized, cross-cadence comparable
```

Evaluated in strict priority order — first match wins:

| # | Condition | Status |
|---|---|---|
| 1 | `lastContactDate === null` | `never_contacted` |
| 2 | `urgency > 1.0` | `overdue` |
| 3 | `urgency > 0.8` | `due_soon` |
| 4 | otherwise | `on_track` |

**Two decisions worth understanding, because they're the design:**

- **Urgency is a *ratio*, not raw days overdue.** Three days late on a 7-day cadence (urgency 1.43) is genuinely more urgent than five days late on a 90-day cadence (urgency 1.06). Sorting by raw days would rank these backwards and make the dashboard useless.
- **`never_contacted` still accrues urgency** — it falls back to `createdAt`, so someone added and ignored for six months does surface. But it renders as its own status with distinct copy ("Never contacted") rather than a misleading "180 days overdue." Neutral in *wording*, not in *visibility*.

## 2.4 Sorting and grouping

Dashboard order: `overdue` (urgency desc) → `never_contacted` (urgency desc) → `due_soon` (urgency desc). `on_track` is not shown on the dashboard; it lives on the full people list.

---

# PART 3 — REQUIREMENTS

## 3.1 Functional — people

- **FR-1.1** Create a person with name + relationship type as the only required fields.
- **FR-1.2** Pre-fill cadence from `cadenceFor(type)` — the user's configured value if present, otherwise the factory default. User may override with any integer 1–365.
- **FR-1.3** If the user changes relationship type *after* manually overriding cadence, preserve the manual value. If they have not overridden it, it follows the newly selected type's current default.
- **FR-1.4** Capture "last spoke" via a **single tap on a preset chip** — never a text field or date picker. Chips and their mappings:

  | Chip | Sets `lastContactDate` to |
  |---|---|
  | Today | today |
  | A few days ago | today − 3 |
  | About a week ago | today − 7 |
  | About a month ago | today − 30 |
  | Longer ago | today − 90 |
  | Never contacted | `null` |

  Default selection is **Never contacted**, so skipping the question entirely is valid and does not misrepresent history.
- ~~**FR-1.5** Edit any field after creation.~~ **Removed.** The backend has no update endpoint — a person's fields, once created, are fixed short of delete-and-recreate. `people/:id/edit` is dropped from the route table (§4.5) and `PersonFormPage` only ever runs in create mode.
- **FR-1.7** Hard-delete a person and cascade-delete their logs, behind an explicit confirmation.
- **FR-1.8** Manage a variable-length list of important dates per person (add/remove) — only at creation time, since there is no edit flow (see FR-1.5).
- **FR-1.9** A person's detail view states plainly which cadence source is in effect — "Follows Close Friend default (14 days)" vs "Custom: 10 days" — so the inheritance is never invisible.

## 3.2 Functional — contact logs

- **FR-2.1** Log a contact with type + date. Type is chosen by tapping a chip. Date defaults to today and is adjusted by tapping a "when" chip (Today / Yesterday / A few days ago / About a week ago); an exact date picker is available but collapsed. Future dates are rejected.
- **FR-2.2** On save, set `lastContactDate` to the log date **only if** it is later than the current value.
- **FR-2.4** Display a person's logs newest-first. Notes are optional and never required to save.
- **FR-2.5** Delete an individual log; afterwards recompute `lastContactDate` as the newest remaining log's date, or `null` if none exists. (No `initialContactEstimate` floor — see §2.1 deviation note.)

## 3.3 Functional — forms & validation

- **FR-3.1** Name: required, 2–80 chars, trimmed.
- **FR-3.2** Phone: optional, but must match a valid pattern if present.
- **FR-3.3** Email: optional, valid format if present.
- **FR-3.4** **Cross-field:** at least one of phone or email must be provided — a person you can't contact defeats the app's purpose.
- **FR-3.5** **Async:** on name blur, check the API for an existing person with that name; show a non-blocking warning (not an error — namesakes are legitimate).
- **FR-3.6** Each important-date entry requires both a label and a valid date; incomplete rows block submit.
- **FR-3.7** Submit is disabled while invalid or while a save is in flight.
- **FR-3.8** Closing a dirty form prompts for confirmation.

## 3.4 Functional — dashboard, reminders, search

- **FR-4.1** Dashboard shows grouped, sorted attention list per §2.4.
- **FR-4.2** Each dashboard entry exposes a one-tap "log contact" that defaults to today + type `call`, saving without opening a dialog.
- **FR-4.4** Stats bar: total active people, count overdue, count due soon, longest current neglect.
- **FR-4.5** Search by name, debounced, server-side.
- **FR-4.6** Filter by relationship type and by status; filters compose with search.
- **FR-4.7** Request browser notification permission only on explicit user action, never on load.
- **FR-4.8** When permission is granted and overdue count transitions upward, fire one summary notification. Never fire more than once per day.
- **FR-4.9** Notifications can be disabled in settings; the preference persists.

## 3.5 Functional — cadence settings

- **FR-5.1** Settings exposes an editable cadence value for each of the six relationship types.
- **FR-5.2** Each value must be an integer 1–365; invalid values block save.
- **FR-5.3** **Resolved as live inheritance** (Open Decision #1, §7). `customCadenceDays === null` means "follows the *current* effective default" — a changed default moves every non-overridden person immediately, with no writes to the people table. This supersedes the earlier "future additions only" behavior; `null` never degrades into a value that was merely true at creation time.
- **FR-5.4** Before saving, show the number of existing people who follow each changed default (`GET /api/config/cadences/usage`), so the consequence of FR-5.3 — that they're about to move — is visible rather than assumed.
- **FR-5.5** Offer an explicit opt-in (`applyToExisting`) to *pin* the new value onto people currently following that default (`customCadenceDays = newValue`), so a later default change no longer moves them. People with a manual override are never affected by either path.
- **FR-5.6** "Reset to defaults" restores all six values from the injected factory baseline and clears stored overrides.
- **FR-5.7** Changing a default immediately recomputes statuses for any affected people, with no page reload.

## 3.6 Non-functional

- **NFR-1 — No authentication in v1.** Single user, single device. Adding auth means guards, token refresh, and a login flow — a whole separate learning block that would displace the topics this project exists to practice. The earlier placeholder `X-Api-Key` header has been removed entirely — single-user/single-device didn't justify the extra moving part, so the API is open with no request-level gate at all.
- **NFR-2 — Offline read tolerance.** The last-loaded people list and cadence config are cached to `localStorage` and rendered when the API is unreachable, with a clear stale-data banner. Writes are not queued offline; they fail loudly.
- **NFR-3 — Every async operation has three visible states:** loading, error, empty. No spinner-forever, no blank screen on failure.
- **NFR-4 — Errors are normalized** into a single shape before reaching any component, so no component ever branches on raw HTTP status codes.
- **NFR-5 — Components never import `HttpClient`.** All network access lives in services.
- **NFR-6 — Responsive down to 375px width.** The daily loop is a phone activity.
- **NFR-7 — No typing on any fast path.** Adding a person and logging contact must each be completable with taps alone. Free text (name, notes) is confined to deliberate, non-urgent flows.

---

# PART 4 — TECHNICAL SPEC

## 4.1 Project structure

```
src/app/
    tokens/
      relationship-baseline.token.ts   // factory defaults, immutable
      app-config.token.ts              // API base URL
    services/
      people-store.service.ts          // root — shared state + people HTTP
      cadence-config.service.ts        // root — user overrides over baseline
      contact-log.service.ts           // root — logs HTTP
      notification.service.ts          // root — browser Notification API
      settings.service.ts              // root — persisted user prefs
      person-form-draft.service.ts     // component-scoped
    interceptors/
      api.interceptor.ts
    models/
  shared/
    ui/
    directives/
      overdue-highlight.directive.ts
    pipes/
      days-since.pipe.ts
  features/
    dashboard/
    people/
      person-list/
      person-card/
      person-detail/
      person-form/
      important-dates-array/
      last-spoke-chips/                // FR-1.4
    contact-log/
      log-contact-dialog/
      contact-timeline/
    settings/
      cadence-settings/                // FR-5.x
      notification-settings/
```


## 4.2 State architecture

Two root services hold state. `PeopleStore` is the source of truth for people; `CadenceConfigService` for cadence overrides.

```
CadenceConfigService
  Writable: overrides : Partial<Record<RelationshipType, number>>
  Computed: effectiveCadences → baseline merged with overrides
  Method:   cadenceFor(type) → number

PeopleStore
  Writable signals:
    people      : Person[]
    loading     : boolean
    error       : AppError | null
    searchTerm  : string
    typeFilter  : RelationshipType | 'all'
    statusFilter: PersonStatus | 'all'

  Computed:
    peopleWithStatus → people mapped through §2.3, reading cadenceFor()
                       from CadenceConfigService — so a settings change
                       recomputes every status automatically (FR-5.7)
    overdue          → filter status==='overdue', sort urgency desc
    neverContacted   → filter status==='never_contacted', sort urgency desc
    dueSoon          → filter status==='due_soon', sort urgency desc
    visiblePeople    → peopleWithStatus through type + status filters
    stats            → { total, overdueCount, dueSoonCount, worstNeglect }
```

Components read computed signals and call store methods. They never mutate `people` directly.

## 4.3 API surface (NestJS)

No update endpoint (FR-1.5 removed) and no auth header (NFR-1) — both dropped from the earlier draft.

```
GET    /api/people?search=&type=
POST   /api/people
GET    /api/people/:id
DELETE /api/people/:id
GET    /api/people/check-name?name=&excludeId=  → { exists: boolean }

GET    /api/people/:id/logs
POST   /api/people/:id/logs
DELETE /api/logs/:id

GET    /api/config/cadences                     → full six-type map, factory + overrides merged
GET    /api/config/cadences/usage                → { [type]: countFollowingDefault } (FR-5.4)
PUT    /api/config/cadences                      → { overrides, applyToExisting: boolean }
DELETE /api/config/cadences                       → clear overrides (reset to factory)
```

`/config/cadences/usage` is the one addition beyond the earlier endpoint list: FR-5.4 needs a count the client can't derive without loading every person.

**Server responsibilities:** persistence, cascade delete, recomputing `lastContactDate` on log create/delete (FR-2.2, FR-2.5), rejecting future dates, and — when `applyToExisting` is true — batch-updating only those people whose `customCadenceDays` is `null`.

**Server also computes `status` and `dueInDays`** and stamps them onto every `Person` it returns (§2.3). The client's own `computed()` chain remains the source of truth for FR-5.7's no-reload recompute — the server fields are read on load, not depended on for reactivity.

**Error shape (all failures):**
```json
{ "error": { "code": "VALIDATION_FAILED", "message": "...", "fields": { "name": "..." } } }
```

## 4.4 HTTP interceptor

One functional interceptor: normalize every failure — network error, 4xx, 5xx, malformed body — into a single `AppError` shape so `catchError` handlers downstream never inspect status codes. There is no auth header to attach (NFR-1).

## 4.5 Routes

```
''                → redirect to /dashboard
'dashboard'       → DashboardPage
'people'          → PersonListPage
'people/new'      → PersonFormPage
'people/:id'      → PersonDetailPage
'settings'        → SettingsPage
'**'              → NotFoundPage
```
`people/:id/edit` is dropped — no update endpoint (FR-1.5). Apply `CanDeactivate` on the create form and settings routes for FR-3.8.

---

# PART 5 — TOPIC COVERAGE MAP

Every entry below is justified by a requirement, not by the syllabus.

### Components & templates
| Topic | Implementation | Driven by |
|---|---|---|
| Component splitting | Dashboard / PersonCard / PersonList / PersonDetail / ContactTimeline / StatsBar / ChipGroup | — |
| Interpolation, property, event binding | Throughout | — |
| `@if` | Loading / error / empty triads | NFR-3 |
| `@for` + `track` | People list (`track p.id`), timeline (`track log.id`), important dates array, cadence settings rows | FR-4.1, FR-5.1 |
| `@switch` | Status rendering — each branch is genuinely *different markup*: overdue shows days + CTA, never-contacted shows "log first contact" | §2.3 |
| Custom attribute directive | `appOverdueHighlight` — takes urgency, uses `ElementRef` + `inject` to set the card's accent | FR-4.1 |
| Multi-slot projection | `<app-panel>` with `[panel-header]`, `[panel-actions]` slots, reused across detail/timeline/settings | — |
| Extending built-in element | `button[appButton]` with variant/size inputs — every action button, including all chips | NFR-7 |
| `host: {...}` | On `appButton` (variant class binding, `disabled` attr) and the highlight directive | — |
| **`ViewEncapsulation.None`** | On `Panel`. Under emulated encapsulation, projected content carries the *parent's* `_ngcontent` stamp, so Panel structurally cannot style its own slot content. This is a real constraint, not a stylistic preference. | — |
| Template variable `#ref` | `#searchInput` — clear button calls `.focus()` without two-way binding | FR-4.5 |
| **Lifecycle hook where signals can't help** | `ngAfterViewInit` on the log dialog to focus the first chip — signals describe *state*, not *"the view now exists in the DOM."* No signal can express that timing. | UX |
| Built-in pipes | `DatePipe` (last contact, important dates), `DecimalPipe` (avg. days between contacts) | — |

> `CurrencyPipe` is deliberately excluded. There is no money in this domain and inventing a gift-budget feature to justify it would be exactly the kind of syllabus-driven design this spec is trying to avoid.

### Reactivity
| Topic | Implementation | Driven by |
|---|---|---|
| Writable signals | Store state per §4.2 | — |
| `computed` | The status/urgency/filter chain, plus `effectiveCadences` merging baseline with overrides | §2.3, §2.2 |
| **`linkedSignal`** | `cadenceDays` in the person form. Resets to `cadenceFor(type)` when relationship type changes, but preserves a manual override. Its computation now depends on **two** reactive sources — the selected type *and* the user's cadence config — so editing a default in Settings updates an open form correctly. This is FR-1.3 + FR-1.2 verbatim, and the single best `linkedSignal` fit in the app. | FR-1.2, FR-1.3 |
| `effect` | Two genuine side effects: (1) mirror `people` and cadence overrides to `localStorage` for offline reads; (2) fire the browser notification when overdue count transitions upward. Both push state *out* of Angular — exactly what effects are for. | NFR-2, FR-4.8 |

### Component I/O
| Topic | Implementation |
|---|---|
| `input.required<T>()` | `PersonCard.person`, `ContactTimeline.personId`, `ChipGroup.options` |
| Signal inputs (optional) | `Button.variant`, `StatusBadge.status` |
| `output()` | `PersonCard`: `logContact` (no `edit` — FR-1.5 removed, there's nowhere to navigate to) |
| `model()` | `SearchBar.value` and `ChipGroup.selected` — both genuine two-way: the parent needs to set/clear them programmatically while the child also writes to them |

### Services & DI
| Topic | Implementation | Justification |
|---|---|---|
| Feature service w/ shared state | `PeopleStore`, `CadenceConfigService` | — |
| `providedIn: 'root'` | `PeopleStore`, `CadenceConfigService`, `ContactLogService`, `NotificationService`, `SettingsService` — genuinely app-wide singletons | — |
| Component-level `providers` | `PersonFormDraftService` on `PersonFormPage` — each form instance needs its **own** draft/dirty state. A singleton would leak one form's unsaved edits into the next. | FR-3.8 |
| Service into service | `ContactLogService` → into `PeopleStore` (logging refreshes the person); `CadenceConfigService` → into `PeopleStore` (status depends on cadence) | FR-2.2, FR-5.7 |
| **`InjectionToken`** | `RELATIONSHIP_BASELINE` — the immutable factory cadences/labels/colors. Now genuinely load-bearing rather than decorative: it's the fallback that guarantees `cadenceFor()` always returns a number, and it's what "Reset to defaults" reads from. Distinct from the *mutable* override state in the service. Plus `APP_CONFIG` for the API base URL. | §2.2, FR-5.6 |

### Async & HTTP
| Topic | Implementation | Driven by |
|---|---|---|
| `HttpClient` full CRUD | All endpoints in §4.3 | — |
| RxJS operators | `debounceTime` + `distinctUntilChanged` + `switchMap` on search; `catchError` on every call; `tap` for store updates | FR-4.5 |
| Loading / error state | `loading` and `error` signals surfaced via `@if` | NFR-3 |
| HTTP isolated in services | Enforced | NFR-5 |
| Interceptor | §4.4 | NFR-4 |
| `takeUntilDestroyed` / `DestroyRef` | Search stream and any manual `.subscribe()` | — |

### Forms
| Topic | Implementation | Driven by |
|---|---|---|
| Reactive forms | Two: `PersonForm` (complex) and `CadenceSettingsForm` (simple, six numeric controls) | — |
| **Nested `FormGroup`** | `contactInfo: { phone, email }` | FR-3.2/3.3 |
| **`FormArray`** | `importantDates` — add/remove rows, each a `FormGroup` of `{ label, date }` | FR-1.8 |
| Sync validators | Name length, phone pattern, email format, cadence range 1–365 (both forms) | FR-3.1–3.3, FR-5.2 |
| **Async validator** | Name duplicate check against `/check-name` | FR-3.5 |
| **Cross-field validator** | On `contactInfo`: at least one of phone/email required | FR-3.4 |

### Additional (not in the original list, but required for production)
| Topic | Implementation |
|---|---|
| Routing + params | §4.5 |
| Route guard | `CanDeactivate` on dirty person and settings forms |
| Lazy loading | `loadComponent` on feature routes |
| Testing | At minimum: unit-test the §2.3 status algorithm and the §2.2 cadence merge (pure logic, high value), plus one component with `TestBed` + `useValue` swapping `PeopleStore` for a stub |

---

# PART 6 — BUILD PHASES

Ordered so you never need syntax you haven't learned. Phases 1 and 2 use only what you've already covered.

### Phase 1 — Static shell + reactivity (no backend, no routing)
Hardcode an in-memory array of people. Build: `RELATIONSHIP_BASELINE` token, `CadenceConfigService`, `PeopleStore` with signals + the full §2.3 computed chain, PersonCard, PersonList, StatsBar, ChipGroup, Panel with projection, `appButton`, `appOverdueHighlight`, StatusBadge, `@switch` status rendering, pipes.
**Done when:** the dashboard correctly sorts hardcoded people by urgency, and logging a contact via one tap moves someone out of the overdue group.
*This is the phase that proves you understand signals. Don't rush it.*

### Phase 2 — `linkedSignal`, effects, local persistence, cadence settings
Add the cadence-override `linkedSignal`, the `localStorage` effect, client-side search + filters, and the cadence settings screen with in-memory overrides.
**Done when:** editing a type default in Settings changes what new people pre-fill with, immediately moves every existing non-overridden person's status (live inheritance, FR-5.3), and data survives a refresh.

### Phase 3 — Routing
Split into the routes in §4.5, add lazy loading and the not-found route.

### Phase 4 — Backend + HTTP
Generate the NestJS API, swap store internals from in-memory to `HttpClient`, add the interceptor, loading/error states, move search server-side with `switchMap`, wire `takeUntilDestroyed`, persist cadence overrides via the config endpoints.
**Done when:** the app works against a real API and degrades gracefully when you kill the server.

### Phase 5 — Forms
`PersonForm` with the nested group, `FormArray`, all validators, plus `CadenceSettingsForm` and the `CanDeactivate` guard.

### Phase 6 — Notifications + polish
`NotificationService`, permission flow, the notification effect, responsive pass, tests for the status algorithm and cadence merge.

---

# PART 7 — OPEN DECISIONS

Judgment calls this spec deliberately leaves to you:

1. ~~**The cadence-default drift problem.**~~ **Resolved: live inheritance.** `customCadenceDays === null` always follows the *current* effective default; changing a default in Settings moves everyone who hasn't overridden, with no writes to the people table. `applyToExisting` (FR-5.5) pins the new value onto those people instead, so a later default change stops moving them. This keeps `customCadenceDays: null` meaningful forever, at the cost of the occasional surprising mass status shift the snapshot alternative would have avoided. See FR-5.3.
2. **Should `due_soon` fire notifications, or only `overdue`?** Earlier warning is more useful but risks notification fatigue.
3. **Should the 0.8 due-soon threshold be user-configurable?** Configurable is flexible; fixed is one less setting to explain. Note that you've now added one settings screen — a second lever might be one too many.
4. **Should contact *type* affect cadence?** Arguably a visit should count more than a text — but this adds real complexity to §2.3 and may not be worth it in v1.
5. **The "Longer ago" chip maps to a fixed −90 days.** For a 7-day cadence that's wildly overdue (urgency 12.8); for a 90-day colleague it's exactly at the line (urgency 1.0). An alternative is making the chips *relative* to the person's cadence ("about half a cycle ago", "a full cycle ago") — more accurate, less intuitive to read.
