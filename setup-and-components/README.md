# Setup and Components

**Concepts:** Angular architecture & setting up a project
**Time:** ~4
**Sources:**

## How Angular v19 Works (zone-full)

> **One sentence:** Angular is a *compiler* that turns your class + HTML + CSS into a plain JS function with hardcoded DOM instructions, plus a *runtime* that decides when to re-run that function.

---

## 0. The core mental model

| | React | Angular |
|---|---|---|
| Component is a… | function | class |
| Runs… | **every render** | **once** (`new` at creation) |
| Template | JSX → `createElement` | separate DSL → compiled function |
| Update strategy | build new tree → diff → patch | saved node refs → `!==` check → assign |
| State | `useState` (reconnect each render) | class field (just persists) |
| Stale closures | yes, a whole category of bugs | impossible — `this.x` reads at call time |
| Memoization | `useMemo` / `useCallback` needed | nothing to memoize |
| Mutation | breaks things | fine |

**Everything below follows from row 2.** The class instance is created once and never re-invoked, so there are no hooks, no dependency arrays, and no referential-identity games.

---

## 1. The compilation pipeline

Three separate materials become one component at **build time**:

<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <g stroke="currentColor" fill="none" stroke-width="1.5" font-family="ui-monospace, monospace" font-size="12">
    <rect x="10" y="15" width="150" height="38" rx="4"/>
    <text x="24" y="39" fill="currentColor" stroke="none">@Component ts</text>
    <rect x="10" y="66" width="150" height="38" rx="4"/>
    <text x="24" y="90" fill="currentColor" stroke="none">template html</text>
    <rect x="10" y="117" width="150" height="38" rx="4"/>
    <text x="24" y="141" fill="currentColor" stroke="none">styles css</text>
    <path d="M165 34 L225 88 M165 85 L225 90 M165 136 L225 92" stroke-dasharray="3 3"/>
    <rect x="230" y="60" width="120" height="70" rx="4" stroke-width="2"/>
    <text x="248" y="90" fill="currentColor" stroke="none">Angular</text>
    <text x="248" y="108" fill="currentColor" stroke="none">Compiler</text>
    <path d="M355 95 L400 95"/>
    <path d="M392 90 L400 95 L392 100" fill="currentColor"/>
    <rect x="405" y="15" width="300" height="165" rx="4" stroke-width="2"/>
    <text x="420" y="38" fill="currentColor" stroke="none">MyComponent.ɵcmp = {</text>
    <text x="436" y="60" fill="currentColor" stroke="none">selectors: [['app-x']]</text>
    <text x="436" y="82" fill="currentColor" stroke="none">decls: 2, vars: 1</text>
    <text x="436" y="104" fill="currentColor" stroke="none">styles: [ scoped css ]</text>
    <text x="436" y="126" fill="currentColor" stroke="none">template: fn(rf, ctx)</text>
    <text x="420" y="150" fill="currentColor" stroke="none">}</text>
    <text x="420" y="172" fill="currentColor" stroke="none" font-size="11">class itself: untouched</text>
    <text x="405" y="212" fill="currentColor" stroke="none" font-size="11">A component = your ordinary class</text>
    <text x="405" y="230" fill="currentColor" stroke="none" font-size="11">+ a compiled blob stapled to it.</text>
  </g>
</svg>

### Stage 1 — Metadata is *read*, not executed

`@Component({...})` looks like a function call but **never runs** in a normal build. The compiler opens the `.ts` file and reads the object literal as static text.

```ts
const sel = getSelector();
@Component({ selector: sel })   // ❌ compiler cannot evaluate this
```

> 💡 Most of Angular's "why is this so rigid?" traces back to exactly this constraint.

### Stage 2 — HTML → AST

Angular has its own HTML parser (not the browser's). It understands `{{ }}`, `[prop]`, `(event)`, `*ngIf`, `@for`, `#ref`.

```
Element(h1)
├── attr: class="title"
└── children:
    ├── Text("Hello ")
    └── Interpolation( PropertyRead(name) )
```

Expressions inside `{{ }}` go to a **second, separate parser**. That mini-language is *not JavaScript* — no arrow functions, no `new`, no assignments, no `await`.

### Stage 3 — Code generation

```js
function GreetingComponent_Template(rf, ctx) {
  if (rf & 1) {                            // CREATE — runs once
    elementStart(0, 'h1');                 //   slot 0 = new <h1>
    text(1);                               //   slot 1 = new text node
    elementEnd();
  }
  if (rf & 2) {                            // UPDATE — runs on every check
    advance(1);                            //   move cursor to slot 1
    textInterpolate1('Hello ', ctx.name);  //   compare, maybe write
  }
}
```

| Symbol | Meaning |
|---|---|
| `rf` | render flags — `1` = create, `2` = update (bitwise, since the first pass is `3`) |
| `ctx` | **your class instance**. `ctx.name` *is* `this.name` |
| `advance(1)` | bumps an internal cursor so the next instruction knows which slot it means |
| `decls: 2` | reserve 2 DOM slots |
| `vars: 1` | reserve 1 previous-value slot |

### Stage 4 — CSS scoping (fake Shadow DOM)

Every element in the template gets a junk attribute stamped on it, and the CSS is rewritten to demand it:

```html
<h1 class="title" _ngcontent-abc-1>
```
```css
.title[_ngcontent-abc-1] { color: red; }
```

A `.title` in a *different* component carries a different attribute, so the selector misses it. Plain CSS specificity — no real Shadow DOM. This is `ViewEncapsulation.Emulated`, the default, and it's why your styles can't reach into children.

### Stage 5 — Attach to the class

```js
GreetingComponent.ɵcmp = { selectors, decls, vars, styles, template };
```

No magic. `ɵ` just marks "Angular internals". Why on the class? Because a parent template holding `<app-greeting>` has only the **class** in hand (from `imports`), and needs a route: `TheClass.ɵcmp.template`.

### Stage 6 — Runtime

```js
const instance = new GreetingComponent();   // your class, normally
const lView = new Array(3);                 // decls(2) + vars(1)

Template(1, instance);   // CREATE  → <h1> + text node exist
Template(2, instance);   // UPDATE  → "Hello Mohammed" written
// ...later...
Template(2, instance);   // UPDATE only. CREATE never runs again.
```

---

## 2. Why the generated code looks so strange

Write it by hand in vanilla JS first — **this is the entire model**:

```js
// SETUP: once
const h1 = document.createElement('h1');
const textNode = document.createTextNode('');
h1.appendChild(textNode);

// UPDATE: many times
let prevName;
function update(name) {
  if (name !== prevName) {
    textNode.data = 'Hello ' + name;   // ← the DOM update. That's it.
    prevName = name;
  }
}
```

Three things to notice:
1. **Two phases** — creation once, updates many.
2. **`textNode` is held in a variable** — never search the DOM again.
3. **`prevName` remembers** — skip pointless writes.

**The problem:** this only works for *one* `<h1>`. There is only **one** compiled function shared by all instances, so it can't use variables. It needs per-instance storage.

**The fix:** every instance gets its own array (an **LView**). "slot N" replaces named variables.

<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <g stroke="currentColor" fill="none" stroke-width="1.5" font-family="ui-monospace, monospace" font-size="12">
    <rect x="255" y="10" width="190" height="34" rx="4" stroke-width="2"/>
    <text x="268" y="32" fill="currentColor" stroke="none">ONE template fn</text>
    <path d="M300 46 L170 78 M400 46 L530 78" stroke-dasharray="3 3"/>
    <text x="30" y="78" fill="currentColor" stroke="none" font-size="11">instance A (name = "Mohammed")</text>
    <rect x="30" y="90" width="80" height="34"/><text x="52" y="112" fill="currentColor" stroke="none">&lt;h1&gt;</text>
    <rect x="110" y="90" width="80" height="34"/><text x="128" y="112" fill="currentColor" stroke="none">#text</text>
    <rect x="190" y="90" width="110" height="34" stroke-dasharray="4 2"/><text x="205" y="112" fill="currentColor" stroke="none">"Mohammed"</text>
    <text x="60" y="140" fill="currentColor" stroke="none" font-size="11">0</text>
    <text x="145" y="140" fill="currentColor" stroke="none" font-size="11">1</text>
    <text x="240" y="140" fill="currentColor" stroke="none" font-size="11">2 (prev value)</text>
    <text x="400" y="78" fill="currentColor" stroke="none" font-size="11">instance B (name = "Ali")</text>
    <rect x="400" y="90" width="80" height="34"/><text x="422" y="112" fill="currentColor" stroke="none">&lt;h1&gt;</text>
    <rect x="480" y="90" width="80" height="34"/><text x="498" y="112" fill="currentColor" stroke="none">#text</text>
    <rect x="560" y="90" width="90" height="34" stroke-dasharray="4 2"/><text x="583" y="112" fill="currentColor" stroke="none">"Ali"</text>
    <text x="30" y="178" fill="currentColor" stroke="none" font-size="11">solid = DOM slots (decls)   dashed = binding slots (vars)</text>
  </g>
</svg>

> **`decls` and `vars` are just "how big to make the array."** The compiler counted them at build time — which is *why* the template must be a restricted DSL. It can't count slots for code it can't statically analyse.

### 🔑 How the DOM updates

> Angular holds a JS reference to every node it created. To update: grab the node from the array slot, compare against the stored previous value, assign if different.
>
> `slot1.data = 'Hello Ali'`
>
> **No searching. No diffing. No tree comparison.** The compiler already worked out at build time that slot 1 is the only thing that can ever change.

---

## 3. When does the update pass run?

Here's the honest problem:

```js
this.name = 'Ali';   // plain assignment — JS gives NO hook, NO event
```

Nothing observes that. To know it happened, a framework must cheat. There are only three ways:

| # | Cheat | Who uses it |
|---|---|---|
| 1 | Make the user announce it (`setState()`) | React |
| 2 | Make assignment non-silent (setter / Proxy / wrapper) | Vue, **Angular signals** |
| 3 | Don't detect it — *guess when* it probably happened, re-check everything | **Classic Angular** |

### The reasoning behind #3

State never changes spontaneously. Something causes it, and that something is always: a DOM event, a timer, a network response, or a promise.

> If I can detect when *any async callback finishes*, I know when to re-check.

Angular never learns **what** changed — only **when** something might have.

### zone.js in ~6 lines

Loads *before* Angular and monkeypatches ~40 browser APIs:

```js
const original = window.setTimeout;
window.setTimeout = function (cb, delay) {
  return original(function () {
    cb();       // your code — may or may not have changed state
    tick();     // Angular: go re-check everything
  }, delay);
};
```

Same treatment for `addEventListener`, `Promise.then`, `XMLHttpRequest`, `requestAnimationFrame`…

**Click sequence:**
```
browser fires click
  → zone.js patched listener
    → your inc() runs, this.count++   (nothing has noticed yet)
    → handler returns
  → zone.js calls tick()              ← THIS is the answer
```

```js
function tick() {
  for (const cmp of everyComponentInTheApp) {   // ENTIRE tree, root → leaf
    cmp.ɵcmp.template(2, cmp.instance);         // update pass only
  }
}
```

This is **dirty checking**. Brute force, viable only because each check is an array read + a `!==`. The expensive part (touching DOM) still happens only where a value genuinely differs.

### Why it's still bad

- A `(mousemove)` binding = a **full-app tree walk per pixel**.
- A `setInterval` at 10ms = 100 full walks/second, forever, even with a static screen.
- zone.js patches globals before your code loads, breaks `async/await` unless downleveled, leaks around third-party libs, and costs bundle size.

### OnPush — the partial patch

`ChangeDetectionStrategy.OnPush` tells `tick()`: *skip my subtree unless my inputs changed by reference, an event fired in me, or I was explicitly marked dirty.*

This is where React-style immutability discipline shows up in Angular — and it's a **patch on a bad model, not a fix**. It narrows the walk; it doesn't eliminate it.

---

## 4. 🚀 The zoneless direction (default from v21)

Zoneless switches from **cheat #3 to cheat #2**. `count.set(5)` is a *function call*, so Angular learns precisely what changed and precisely which views read it. No guessing, no tree walk, no zone.js.

### Version timeline

| Version | Status |
|---|---|
| v18 (2024) | experimental — `provideExperimentalZonelessChangeDetection()` |
| **v19** | still experimental; **zone-based by default** ← *typical legacy codebase* |
| v20.2 | API **stabilized** — `provideZonelessChangeDetection()` |
| **v21** | **zoneless is the DEFAULT for new apps**; zone.js no longer shipped |
| v22 | default continues; migration path documented |

```ts
// v21+ : nothing to do. Just verify nobody re-enabled zones:
//   provideZoneChangeDetection()  ← must NOT be present

// v20 : opt in manually
bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection()]
});
```

Then delete it from the build entirely:
```bash
# remove "zone.js" and "zone.js/testing" from polyfills in angular.json
npm uninstall zone.js
```

### What triggers change detection now

Angular relies on **explicit notifications** instead of patched APIs. A view is marked dirty by:

1. **A signal read in a template updates** → Angular knows exactly which views depend on it
2. **A bound template or host listener fires** — e.g. `(click)`
3. **`ChangeDetectorRef.markForCheck()`** — called for you by `AsyncPipe`
4. **`ComponentRef.setInput()`**
5. **Attaching a view already marked dirty by one of the above**

<svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <g stroke="currentColor" fill="none" stroke-width="1.5" font-family="ui-monospace, monospace" font-size="11">
    <text x="20" y="18" fill="currentColor" stroke="none">ZONE-BASED: check every node</text>
    <circle cx="150" cy="45" r="14" stroke-width="3"/><text x="146" y="49" fill="currentColor" stroke="none">R</text>
    <path d="M139 56 L95 84 M161 56 L205 84"/>
    <circle cx="90" cy="95" r="14" stroke-width="3"/>
    <circle cx="210" cy="95" r="14" stroke-width="3"/>
    <path d="M80 106 L55 134 M100 106 L125 134 M200 106 L175 134 M220 106 L245 134"/>
    <circle cx="50" cy="145" r="14" stroke-width="3"/>
    <circle cx="130" cy="145" r="14" stroke-width="3"/>
    <circle cx="170" cy="145" r="14" stroke-width="3"/>
    <circle cx="250" cy="145" r="14" stroke-width="3"/>
    <text x="20" y="195" fill="currentColor" stroke="none">bold = checked</text>
    <text x="20" y="212" fill="currentColor" stroke="none">7 checks for 1 change</text>
    <line x1="340" y1="10" x2="340" y2="220" stroke-dasharray="4 4"/>
    <text x="390" y="18" fill="currentColor" stroke="none">ZONELESS: only the dirty path</text>
    <circle cx="520" cy="45" r="14" stroke-width="3"/><text x="516" y="49" fill="currentColor" stroke="none">R</text>
    <path d="M509 56 L465 84" stroke-width="3"/>
    <path d="M531 56 L575 84" stroke-dasharray="2 3" opacity="0.4"/>
    <circle cx="460" cy="95" r="14" stroke-width="3"/>
    <circle cx="580" cy="95" r="14" stroke-dasharray="2 3" opacity="0.4"/>
    <path d="M450 106 L425 134" stroke-dasharray="2 3" opacity="0.4"/>
    <path d="M470 106 L495 134" stroke-width="3"/>
    <path d="M570 106 L545 134 M590 106 L615 134" stroke-dasharray="2 3" opacity="0.4"/>
    <circle cx="420" cy="145" r="14" stroke-dasharray="2 3" opacity="0.4"/>
    <circle cx="500" cy="145" r="16" stroke-width="3"/><text x="495" y="150" fill="currentColor" stroke="none">✳</text>
    <circle cx="540" cy="145" r="14" stroke-dasharray="2 3" opacity="0.4"/>
    <circle cx="620" cy="145" r="14" stroke-dasharray="2 3" opacity="0.4"/>
    <text x="390" y="195" fill="currentColor" stroke="none">✳ = signal changed here</text>
    <text x="390" y="212" fill="currentColor" stroke="none">3 checks for 1 change</text>
  </g>
</svg>

### Benefits

| Benefit | Why |
|---|---|
| **Performance** | zone.js triggers synchronization more often than necessary because it has no insight into whether state actually changed. Signals target only the views that read them. |
| **Core Web Vitals** | zone.js carried real payload-size and startup-time overhead; it's gone from the bundle. |
| **Debugging** | Stack traces stop being buried in zone frames. No more "why didn't this update? oh, it ran outside the Angular zone." |
| **Ecosystem compatibility** | No monkeypatching means no waiting for patches for new browser APIs, and no libraries silently escaping the zone. `async`/`await` no longer needs downleveling. |
| **Predictability** | Change detection runs when *you* cause it, not when the browser happened to fire something. |

### Gotchas when migrating

- `NgZone.onStable` / `onUnstable` / `onMicrotaskEmpty` **never emit**; `isStable` is always `true`. Use `afterNextRender` / `afterEveryRender` instead.
- **Reactive forms**: `setValue`/`patchValue` update state and emit observables but **do not** schedule change detection. Pipe through `AsyncPipe`, call `markForCheck()`, or mirror into signals.
- **SSR**: zone.js used to decide when the app was "stable" enough to serialize. Use the `PendingTasks` service instead.
- `NgZone.run` / `runOutsideAngular` are still safe to keep — removing them can *hurt* libraries used by zone-based apps.
- Debug tool: `provideCheckNoChangesConfig({ exhaustive: true, interval: 1000 })` periodically throws if a binding updated without a notification.
- `OnPush` isn't required, but it's the recommended stepping stone — an `OnPush`-clean component is already zoneless-compatible.

---

## 5. Worked example

A search filter. Same feature, three ways.

### 5a. React (what you know)

```tsx
function StudentSearch({ students }: { students: Student[] }) {
  const [query, setQuery] = useState('');

  // recomputed every render; memo needed to avoid wasted work
  const results = useMemo(
    () => students.filter(s => s.name.toLowerCase().includes(query.toLowerCase())),
    [students, query]
  );

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <p>{results.length} found</p>
      <ul>{results.map(s => <li key={s.id}>{s.name}</li>)}</ul>
    </div>
  );
}
```
**Every keystroke:** whole function re-runs → new element tree → diff → patch.

---

### 5b. Angular, zone-based (v19 style — what legacy code looks like)

```ts
@Component({
  selector: 'app-student-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input [(ngModel)]="query" (ngModelChange)="recompute()" />
    <p>{{ results.length }} found</p>
    <ul>
      <li *ngFor="let s of results">{{ s.name }}</li>
    </ul>
  `
})
export class StudentSearchComponent {
  @Input() students: Student[] = [];
  query = '';
  results: Student[] = [];

  recompute() {
    const q = this.query.toLowerCase();
    this.results = this.students.filter(s => s.name.toLowerCase().includes(q));
  }
}
```

**Every keystroke:**
1. zone.js's patched `addEventListener` catches the `input` event
2. `recompute()` runs, `this.results` is reassigned
3. Handler returns → **zone.js calls `tick()`**
4. `tick()` walks the **entire app** running every update pass
5. This component's `!==` check on `results.length` fails → DOM written

Steps 4 is pure waste. You typed in one input and every component in the app got checked.

---

### 5c. Angular, signals + zoneless (v21 default — write new code like this)

```ts
@Component({
  selector: 'app-student-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input [value]="query()" (input)="query.set($any($event.target).value)" />
    <p>{{ results().length }} found</p>
    <ul>
      @for (s of results(); track s.id) {
        <li>{{ s.name }}</li>
      }
    </ul>
  `
})
export class StudentSearchComponent {
  students = input.required<Student[]>();     // signal input
  query = signal('');                          // writable signal

  results = computed(() => {                   // auto-memoized, no dep array
    const q = this.query().toLowerCase();
    return this.students().filter(s => s.name.toLowerCase().includes(q));
  });
}
```

**Every keystroke:**
1. `(input)` listener fires → marks *this* component dirty (trigger #2)
2. `query.set(...)` runs → signal notifies its **exact** dependents (trigger #1)
3. `results` computed is invalidated — recomputed lazily, only when the template reads it
4. Angular schedules a check for **this view and its ancestors only**
5. Update pass runs → `!==` checks → DOM written

No `tick()`. No app-wide walk. No zone.js in the bundle.

### Side by side

| | React | Angular + zones | Angular + signals |
|---|---|---|---|
| What re-runs | whole component fn | every component's update pass | one component's update pass |
| Knows what changed? | no (diffs to find out) | no (compares to find out) | **yes** |
| Memoization | manual `useMemo` | manual / none | `computed()` automatic |
| Wasted work | tree diff | app-wide tree walk | none |

---

## 6. Cheat sheet

| Term | Meaning |
|---|---|
| **Ivy** | the current compiler + runtime |
| **`ɵcmp`** | static property on your class holding the compiled component definition |
| **LView** | the flat per-instance array: DOM node slots + previous-value slots |
| **`decls` / `vars`** | how many DOM slots / binding slots to allocate |
| **`rf`** | render flags — `1` create, `2` update |
| **`ctx`** | your class instance inside the template function |
| **dirty checking** | re-running all update passes and comparing values to find changes |
| **`tick()`** | one full change-detection pass over the component tree |
| **`OnPush`** | skip this subtree unless inputs changed by reference / event fired / marked dirty |
| **zoneless** | no zone.js; change detection scheduled by explicit notifications |
| **signal** | a value wrapped so reads are tracked and writes notify dependents |
| **`computed()`** | derived signal, lazily recomputed, auto-memoized |

---

## 7. The whole thing in three paragraphs

**Compilation.** Angular reads each `@Component`'s metadata statically — the decorator never executes — parses the template with its own HTML parser and its own restricted expression grammar, and emits a plain JS function split into a create pass and an update pass. The create pass builds DOM nodes once and stores direct references in a per-instance array; the update pass is nothing but hardcoded `newValue !== storedValue` checks at fixed integer offsets in that array, writing to a node only when a comparison fails. No virtual DOM, no diffing — the compiler already knew at build time exactly which nodes could change. CSS is scoped by stamping a unique attribute on every element and rewriting selectors to require it. All of it is packed into a `ɵcmp` static property on your otherwise-untouched class.

**Scheduling.** The hard problem is knowing *when* to run the update pass. JS gives no hook on `this.name = 'Ali'`, so classic Angular doesn't detect the change — it detects when a *callback finished*, on the reasoning that state changes always trace back to an event, timer, promise, or network response. zone.js patches those APIs and appends `tick()`, which walks the entire component tree. Angular never learns what changed, only that something might have. Brute force, viable only because each check is an array read and a `!==` — but a `mousemove` binding means a full-app walk per pixel.

**Consequences.** Because the class instance is created once and never re-invoked: no hooks, no dependency arrays, no stale closures, nothing to memoize, and mutation works fine. Because the compiler must count slots ahead of time, the template is a restricted DSL rather than JavaScript. And because the tree walk is the weak point, the modern direction eliminates it: `OnPush` prunes subtrees, and signals replace the guessing entirely — `set()` is a function call, so Angular learns exactly what changed and exactly which views read it. That's zoneless, the default since v21.

---

## References

- [Angular — Zoneless guide](https://angular.dev/guide/zoneless)
- [`provideZonelessChangeDetection` API](https://angular.dev/api/core/provideZonelessChangeDetection)
- [Angular — Skipping component subtrees (OnPush)](https://angular.dev/best-practices/skipping-subtrees)
- [Angular — Signals](https://angular.dev/guide/signals)

## Setting up a project

1. Install Angular CLI

``` cli
npm i -g angular@cli
```

2. Create a new project using Angular CLI
``` cli
ng new <project-name>
```

3. Running the app
``` cli
ng serve --open
```

The ng serve command launches the server, watches your files, as well as rebuilds the app and reloads the browser as you make changes to those files.

Note: --open to open browser automatically

## Angular Architecture

Angular is a single page application (SPA) framework, `index.html` is the default app template, while the bootstrapping boint is `main.ts`.

1. **Components** : Reusable UI pieces, has HTML & CSS bundled in a single file
2. **Services**: Shared logic
3. **Modules**: Groups of related components and services
4. **Templates**: HTML files with special Angular syntax

## Components

- Each Angular component has three parts:
1. TypeScript class
2. HTML template
3. CSS styles

- Templates and styles can be inline or via a file URL.

- Components are declared using the `@Component({})` decorator, example:
``` ts
import { Component } from '@angular/core'

@Component({
    selector: 'profile',
    'templateUrl: './profile.html',
    'styleUrl: './profile.css',
})
export class Profile() {
    name = 'Angular'
}
```
Notes:
Component member variables are accessible by the template*, either inline or external.

> *HTML templates don't live inside the generated bundle of the compiler. HTML templates don't really "access" the variables of the class during runtime. What happens instead is that Angular compiler takes the HTML template and the class and produces a renderer function, each template gets a unique renderer function. The renderer takes only the class instance (with its members) and produces the actual UI. The runtime in the browser only calls the renderer that produces the HTML using the class instance (for data), not the actual HTML template.

### Composing Components

- You build an application by composing multiple components together.
- From Angular 19, components are standalone by default. Before that, components couldn't function without being declared in an Angular module. (NgModule)
- NgModules are still supported in Angular 19+ but aren't the default (default is standalone componenst)

- To import and use a component inside another, you need to:
1. In your component's TypeScript file, add an import statement for the component you want to use.
2. In your @Component decorator, add an entry to the imports array for the component you want to use.
3. In your component's template, add an element that matches the selector of the component you want to use.

``` ts
// user-profile.ts
import {ProfilePhoto} from 'profile-photo.ts';
@Component({
  selector: 'user-profile',
  imports: [ProfilePhoto],
  template: `
    <h1>User profile</h1>
    <profile-photo /> <!-- use components by appending their selector tag in the template -->
    <p>This is the user profile page</p>
  `,
})
export class UserProfile {
  // Component behavior is defined in here
}
```

## Summary

List of most important things learnt during this day