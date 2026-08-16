# Day 06 - Components Deep Dive

## When to split up components?

- You should split up components based on separation of concernts.
- Components should typically do **one thing** at a time.

## Extending Built-in Components

- Angular regularly renders the custom component in the DOM tree along with the internal components.
- If we were to build a custom button wrapper that wraps the built in button component, we would need to pass anything such as events, inputs, etc. to the custom component and pass it again to the built-in button.
- Thus, we need a way of EXTENDING the built-in components, not wrap them.

- You can do this by using an attribute selector pattern, which is defining the custom component's selector to be an attribute selector rather than an element selector, then use the built-in component with the attribute selector attached.
- This tells Angular to let the custom component control the built-in attributed one. Thus extending it without wrapping in an extra element.

e.g.

```ts
@Component({
  selector: 'button[appButton]',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {}
```

Usage:

```html
<button appButton></button>
```

- A problem that arises with this pattern is the content of the button needs to be configurable.
- We can achieve that by using inputs:

```html
<button appButton text="Submit" icon=">"></button>
```

Or a better method: Multiple Slot Projection.

## Multi-slot Content Projection

- Angular supports projecting multiple different elements into different `<ng-content>` placeholders based on CSS selector.

E.g. Custom Button

```html
<span>
  <ng-content />
</span>
<ng-content select=".icon" />
```

Now Angular knows where to put each content in the custom button
```html
<button appButton>
  Logout
  <span class="icon">→</span>
</button>
```

## View Encapsulation: CSS (Styling) Scope

- By default, styles in the browser are global.
- Angular uses an **emulated** version of browser's Shadow DOM, which is a way of binding styling to specific components, Angular uses attributes to bind styling to componenents.

e.g.
``` css
.title { color: red; }
```

becomes in the browser:

``` css
.title[_ngcontent-abc-1] { color: red; }
```

- When using content projection, Angular's style attribute mechanism doesn't know what components will end up projected so it doesn't apply the custom component's CSS to the projected content elements.
- However, sometimes you want scoped styling to apply to the projected content, this can be done by chossing not to follow Angular's default view encapsulation mechanism (emulated).
- When choosing `ViewEncapsulation.None`, styles are injected as plain global CSS.

### Why Angular can't apply the scoped CSS? (Advanced).

Two compile-time rules:
1. Every element is stamped `_ngcontent-X` where X = the template file it was **authored** in.
2. Every selector in a component's stylesheet gets `[_ngcontent-X]` appended to its **last compound selector** (the element being styled), where X = that component.

Projection is the case where these collide:
- The projected element is authored in the parent → stamped `parent`
- It is rendered at the child's DOM position, but the stamp doesn't change
- The child's `.item button {}` ships as `.item button[_ngcontent-child]`
- Browser check: is a button ✓, has `.item` ancestor ✓, has `_ngcontent-child` ✗ → no match

Not a bug: ownership follows authorship, so the parent keeps the ability to style
markup it wrote. Crossing the boundary must be deliberate (`::ng-deep`, CSS vars,
marker-directive pattern).

> This is a single solution to the projected content styling problem. Other solutions exist.

## Host Elements

- Every Angular component has a host element, which is the element that the selector applies to.
- You can interact with host elements using either `:host` CSS selector or the `host` property in the `Component`  decorator.
- These two methods are useful when you want to apply direct styling/properties to the host element without setting it from outside or adding unnecessary internal elements that take care of the styling/properties.

- Example:
You want to add a `control` class to the host element but you don't want to set `class="control"` from every part that uses that element.

``` ts
@Component({
  selector: 'app-control',
  imports: [],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "control"
  }
})
export class ControlComponent {
  @Input({ required: true }) label!: string;
}
```

The evaluated `<app-control />` in the DOM will have class="control" everywhere it's used.

> Note: in the above example, we can't use :host, because we have disabled scoped CSS with ViewEncapsulation.None.

### Why can't a component style its host with normal selectors?

The host element carries **two** stamps:
- `_ngcontent-parent` — it's content of the parent's view (the parent's template wrote the tag)
- `_nghost-child` — it's the host of the child's view

Selectors in `child.component.css` compile with the **content** stamp of the child (`.wide` → `.wide[_ngcontent-child]`).
The host never has that attribute, so it misses. Applies to class, id, and tag selectors alike.

`:host` compiles to `[_nghost-child]` — the second identity — which is how the child reaches its own host.
`:host(.wide)` = "me, when I'm `.wide`" (a filter, not a descendant).

**Rule:** a node's content stamp is set by *which template's file contains the
tag*, not by where it sits in the DOM tree.

**Note:** `:host` is from the Shadow DOM spec, not an Angular invention.
Emulated mode simulates it with attributes so CSS ports to `ShadowDom` mode
unchanged. `encapsulation: None` "fixes" this only by making every selector in
the file global — not a fix.
