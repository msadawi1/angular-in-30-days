# Day 03 — Custom Directives and Control Flow

## Custom Attribuett Directives

- To create a new directive:

1. Generate the directive

``` bash
$ ng generate directive highlight
```

2. Import ElementRef from Angular core. ElementRef holds a reference to the DOM element to modify it directly through its `nativeElement` propert

3. Import `inject` from Angular core and use it in the directive constructor to inject the element reference to the DOM

``` ts
@Directive({
  selector: '[appTextHighlight]'
})
export class TextHighlightDirective {

  private element = inject(ElementRef)

  constructor() { 
    this.element.nativeElement.style.backgroundColor = 'yellow'
   }

}
```

4. Use the directive as a property to the DOM element

``` html 
<h1 appTextHighlight>
    {{ title }}
</h1>
```

> Angular creates an instance of the TextHighlightDirective class and injects a reference to the <h1> element into the directive's constructor, which sets the <h1> element's background style to yellow.

## Control Flow

- Angular templates (v17+) support control flow blocks that let you conditionally show, hide, and repeat elements. 
- These control flow blocks do not need importing

> This was previously done with built-in structural directives (ngFor, ngIf etc)

### Conditionals

- Sample template using @if, @else-if and @else
``` ts
@if (a > b) {
  {{a}} is greater than {{b}}
} @else if (b > a) {
  {{a}} is less than {{b}}
} @else {
  {{a}} is equal to {{b}}
}
```

- You can save the result of a conditional expression using `as`:

``` ts
@if (user.profile.settings.startDate; as startDate) {
  {{ startDate }} // rather than doing user.profile.settings.startDate again
}
```

### Loops

- The @for block loops through a collection and repeatedly renders the content of a block
- The collection can be any JavaScript iterable.
- Angular provides no support for loop flow statements such as `break` and `continue`

``` ts
@for (item of items; track item.id) {
  {{ item.name }}
}
```

- Each block rendered must have a unique-per-list track identifier.
- The identifer must be unique such as uuid or id for each item in the list.
- For static collections that never change, you can use $index to tell Angular to track each item by its index in the collection.

> Using track effectively can significantly improve your application's rendering performance when looping over data collections. If no unique option is available, you can specify `identity`. This tells Angular to track the item by its reference identity using the triple-equals operator (===). Avoid this option whenever possible as it can lead to significantly slower rendering updates, as Angular has no way to map which data item corresponds to which DOM nodes.

- Implicit variables to @for:

| Variable | Meaning                                       |
| -------- | --------------------------------------------- |
| `$count` | Number of items in a collection iterated over |
| `$index` | Index of the current row                      |
| `$first` | Whether the current row is the first row      |
| `$last`  | Whether the current row is the last row       |
| `$even`  | Whether the current row index is even         |
| `$odd`   | Whether the current row index is odd          |

- You can provide a fallback to @for when list is empty:

``` ts 
@for (item of items; track item.name) {
  <li> {{ item.name }}</li>
} @empty {
  <li aria-hidden="true"> There are no items. </li>
}
```

- Switch case (nothing is shown if no case hits and no default case):

``` ts
@switch (userPermissions) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('reviewer') {
    <app-reviewer-dashboard />
  }
  @case ('editor') {
    <app-editor-dashboard />
  }
  @default {
    <app-viewer-dashboard />
  }
}
```