# Day 05 - Components Input/Output

- In Angular, you can define components to take inputs from their properties.

## @Input Decorator (Older method, newer projects use signals)

- You can use the @Input decorator to define an input property for a component:

``` ts
@Component({...})
export class UserComponent {
  @Input() value!: number;
}
```

- You can also configure it to be required:

``` ts
@Component({...})
export class UserComponent {
  @Input({ required: true }) value!: number;
}
```

- Then in the template:

``` html
<app-user [value]="users[0].value">
```

## Signal Inputs

- You can use the new `input()` signal function to define component inputs rather than the @Input decorator in newer projects
- Passing the input from outside the component has no changes.

``` ts
@Component({...})
export class UserComponent {
  value = input.required<string>();
}
```

``` html
<app-user [value]="users[0].value">
```

- However, you should use the value as a signal, thus calling it as a function and using `computed` rather than getters.

## @Output Decorator for Custom Events

- You can output custom events from a component to its parent component using `@Output` decorator and an `EventEmitter` object.

``` ts
export class UserComponent {
  @Input({ required: true }) id!: string;

  @Output() select = new EventEmitter<string>();

  onSelectUser() {
    this.select.emit(this.id)
  }
}
```

- Then in the parent's template, handle the event as you normally do with built-in events:

``` html
<app-user
        [id]="users[0].id"
        [name]="users[0].name"
        [avatar]="users[0].avatar"
        (select)="onSelectUser($event)"
      />
```
- The `$event` argument holds the custom event's payload, in this case the user id.

## `output` Function

- The `output<T>()` function replaces the need of `new EventEmitter` but does the exact thing at the end, emits a custom event. Event handing doesn't change.

``` ts
export class UserComponent {
  @Input({ required: true }) id!: string;

  // @Output() select = new EventEmitter<string>();
  select = output<string>()

  onSelectUser() {
    this.select.emit(this.id)
  }
}
```

## Handling Forms: FormsModule

- Importing `FormsModule` to a component introduces it to the set of directives provided by the forms module.

- This includes `ngModel` and `ngSubmit`. First is used for two-way binding (discussed earlier)
- FormsModule prevents the browser's default behavior when submitting a form in a `<form>` tag (prevent sending a request because it's handled in the client side)
- We can handle form submission by binding `ngSubmit` property on the form element to a handler.
