# Data and Event Binding

**Concepts:** Data and event binding in Angular
**Time:** ~5h

- Accessing member fields of the class instance inside the HTML template

## Data and Event Binding

### Data Binding (one-way)

1. Interpolation

- Can be done using `{{ classFieldName }}`  inside the HTML template, preferred for string interpolation inside element tags

2. Property Binding

- Can be done using `[propertyName]="classFieldName"` on the element, preferred when using a variable inside an HTML property/attribute
> Note: Angular bind the value to the underlying DOM object not the HTML attribute, binding to the `src` property also sets the HTML attribute `src` because they match. However, if you try `aria-label`, binding won't work because Angular searches for a aria-label proprty which doesn't exist. You can fix that by binding to the attribute directly by explicitly mentionting its an attribute: `[attr.aria-label]` rather than `[aria-label]`.

### Event Binding (one-way)

- Accessing methods of the class instance inside the HTML template to be invoked upon an event
- Done using `(event)="method()"` syntax

### Two-way Binding

- Two way binding is a shorthand to simultaneously bind a value into an element, while also giving that element the ability to propagate changes back through this binding.
- Used to keep component data in sync with a form control as a user interacts with the control. 

- Done using:
1. Import the `FormsModule` from `@angular/forms`
2. Use the `ngModel` directive with the two-way binding syntax (e.g., [(ngModel)])
3. Assign it the state that you want it to update (e.g., `firstName`)

## Directives

- Directives are TS classes that add addtional behavior to elements in the app, Angular adds them to HTML elements through a selector
- Directives can be built-in or user-defined (custom directives)

### Types of Directives in Angular

1. Components — define reusable UI with their own template.
2. Attribute directives — change the appearance or behavior of an existing element, component, or directive.
3. Structural directives — change the DOM layout by adding or removing elements.

``` HTML 
<!-- Structural -->
<p *ngIf="isLoggedIn">Hello</p>

<!-- Attribute -->
<input appAutoFocus>

<!-- Component -->
<app-user-card></app-user-card>
```

#### Built-in directives

##### 1. Attribute directives

1. NgClass: adds or removes CSS classes from an element conditionally
2. NgStyle: adds or removes CSS inline styles from an element conditionally
3. NgModel: used for two-way data binding to an HTML form element

To use any of the three: import it into the component's `imports` array. (Note: `ngModel` uses `FormsModule`)

``` ts
@Component({
  selector: 'app-root',
  imports: [NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly welcomeMessage = 'Welcome Back';
  isLoggedIn = false

  currentStyles = {
    "color": this.isLoggedIn ? "black" : "red"
  }
}
```

``` html
<h1 [ngStyle]="currentStyles">
  {{ welcomeMessage }}
</h1>
```

> Note: for single style or class, use class or style binding. e.g. `<h1 [class.active]="isActive">Hello</h1>` or `<h1 [style.color]="isActive ? 'black' : 'red'">Hello</h1>`

##### 2. Structural Directives

1. NgIf: conditionally show or hide a view from the component
2. NgFor: repeat a node
3. NgSwitch: swtich among alternative views

- To use any of the three, you have to import it in the component and append it to the `imports` list
- Using them requires a special astrisk before the keyword such as `*ngIf` or `*ngFor`

``` html
<app-item-detail *ngIf="isActive" [item]="item"></app-item-detail>
```

