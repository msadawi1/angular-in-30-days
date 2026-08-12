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




