# Day 04 — Signals and Effect

## Signals

- A signal is a wrapper around an instance member (either simple or complex DS) that notifies consumers when a changed to the value has happened. 
- Signals are read using getter functions e.g. `value()`.
- Signals are either read-write or read-only.

### Why Signals?

- Signals help Angular detect changes in a component when its value changes. Rather than relying on `zone.js` to monkey-patch the async APIs of the browser to detect when something has happened, Angular can know where that change has happened using signals, avoiding full-tree scan for changes. 

- Using the following configuration lets Angular 19 update the UI only when a signal value has changed. Changing the component's instance variables (using events) won't trigger a UI change.
``` ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

- Note: Angular re-renders an OnPush component's subtree when:

#### 1. Input changes (parent → child)
- A `[binding]` passed from the parent template changes
- Angular compares old vs new with `==`
- Mutating a property *inside* the child does **not** count

#### 2. Angular handles an event (anywhere in the subtree)
- `(click)`, `(input)`, any `(event)` binding
- `@Output()` emissions
- `@HostListener()` methods
- Triggers a full top-down CD pass through the **whole subtree** — not just the component that owns the handler

#### Everything else → no re-render (unless a signal or manual trigger says otherwise)
- `setTimeout` / `setInterval` callbacks
- Promise / `async`-`await` resolutions
- WebSocket / HTTP responses outside triggers 1 & 2
- Mutating a plain class field that isn't caused by 1 or 2

### Writable Signals (set, update)

- Computed signals are read-only, and they get their initail value from other signals.
- Computer signals are defined using the `computed()` function.

``` ts 
const count: WritableSignal<number> = signal(0);
```

- Writable signals (`WritableSignal`) provide two methods to update thier value. 

1. .set(): assigns a value directly
2. .update(): assigns a value but lets you access the previous signal value

- Signals are created using `signal()` function from Angular core.

``` ts
const count = signal(0);
// Signals are getter functions - calling them reads their value.
console.log('The count is: ' + count());

count.set(3);

// Increment the count by 1.
count.update(value => value + 1);
```

### Computed Signals (read-only)

- Computed signals are read-only, and they get their initail value from other signals.
- Computed signals are defined using the `computed()` function.
- Computed values are both lazy-evaluated and memoized (only evaluate the value when value is first read)
- If you then change `count`, Angular knows that `doubleCount`'s cached value is no longer valid, and the next time you read `doubleCount` its new value will be calculated.

``` ts 
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

> IMPORTANT Note: computed signals dependency array is dynamic, only read dependency signals perform recalculation. 

``` ts
const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `The count is ${count()}.`;
  } else {
    return 'Nothing to see here!';
  }
});
```
- Here, if `showCount` is `false`, changing `count` doesn't perform recalculation of the computed signal, becuase the dependency's branch is not reached.
- If `showCount` becomes `true`, then changing `count` perform signal recalculation. 

### Effects

- An effect is an operation that runs whenever one or more signal values change. You can create an `effect` with the `effect` function.
- Note that effects always run at least once.
- Effects are strictly tied to **injector context**, they only run where the injector context is available (constructors or field initializers, or manual injectors).
``` ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

- You can cleanup functions that do long-running operations (such as an async API call) with `onCleanup` callback param to `effect`
- The callback is invoked before the next effect run or when it's destroyed

``` ts
effect((onCleanup) => {
  const user = currentUser();
  const timer = setTimeout(() => {
    console.log(`3 second ago, the user became ${user}`);
  }, 3000);
  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

- If user navigates away from the page that has the effect, the timeout will be cleared.

### Linked Signals

**The problem**
A plain `signal()` has no live connection to another signal — even if initialized from one:
``` ts
selectedTab = signal(defaultTab()); // evaluates ONCE, then frozen
```
When `defaultTab` changes later, `selectedTab` never updates. It's just a stale value, not a "dependent" signal.

**Why a callback fixes it (advanced)**
Angular tracks dependencies by setting a "who's asking" flag *before* running a callback, then invoking it. Any signal read *inside* that callback auto-registers as a dependency.
→ A plain **value** argument evaluates too early (before tracking is armed) — no registration possible.
→ A **callback** stays unevaluated until the tracking function runs it — registration works.
This is why `computed()` and `linkedSignal()` both take functions, not values.

**Simple form** — auto-resets on every dependency change
```typescript
const selectedTab = linkedSignal(() => defaultTab());
```
- Recomputes whenever a signal read inside the callback changes (like `computed`)
- Still **settable**, unlike `computed`: `selectedTab.set('tab2')` 
- Catch: any manual `.set()` is **wiped out** the next time the dependency changes — recompute always overwrites

**Advanced form** — conditional reset, using the previous value
```typescript
const selectedTab = linkedSignal({
  source: () => tabList(),                         // the dependency
  computation: (newTabList, previous) => {
    // previous.value  = old selectedTab value
    // previous.source = old tabList value
    return newTabList.includes(previous.value)
      ? previous.value       // still valid → keep it
      : newTabList[0];       // invalid → fall back to default
  },
  equal: (a, b) => a.id === b.id, // a is old, b is new value
});
```
- `computation` gets the **new** dependency value **and** a `previous` object (`{ value, source }`)
- Lets you decide: keep the old value if it's still valid, else fall back
- This is the key upgrade over plain `computed()` — `computed()` has no memory of what it held before
- `equal` overrides the default Angular behavior of comparison (`Object.is()`) so it prevents unnecessary renders.
