# Forms - Managing Inputs, Error Handling, Values & Validation

- Angular provides two managed ways of handling forms:

1. Template-driven forms: simple but hard to scale, helpful when we have simple minimal forms
2. Reactive forms: more robust and scalable, helpful when the app has many forms

## Template-driven Forms

- Done using the provided `FormsModule` and two-way binding (though, optional)
- Angular provides access to the form state in the compnoent's class using the `ngForm` directive along with `ngModel` (which requires inputs to have a name property that's used to build the ngForm form state object).
- Setup is implicit using directives.

### Form Structure
- Note: two-way binding isn't used here as we don't want to keep an internal state of the submitted values (everything is hanlded template-side)

``` html
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" name="email" ngModel />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" name="password" ngModel />
    </div>

    <button class="button">Login</button>
  </div>
</form>
```

### Validation

- Validating form inputs is done using HTML attributes
- Angular won't prevent form submission if any input is invalid, but rather modify the returned form state object to specify that the input is invalid, which then allows us to handle the invalid case (adding feedback).

> The built-in HTML attributes, along with special Angular validation attributes are all registered as Angular directives, Angular takes control of the validation and disables the default browser behavior.

**Adding user feedback:** Angular provides some form controls properties that can be used to detect when an input is invalid to provide some user feedback, these properties have corresponding element classes provided by Angular to allow us to add styling, most important:
1. `invalid` property, `ng-invalid` class (validation didn't pass)
2. `dirty` property, `ng-pristine` class (user entered a value)
3. `touched` property, `ng-touched` class (user touched the input)

## Reactive Forms

- The reactive form approach is driven from the component's class by defining the form as `FormGroup` with multiple properties of `FormControl`, which are the form inputs:
1. Define the form in the class using `FormGroup` and `FormConrol` class objects
2. Connect the template to the form using `formGroup` (for parent) and `formControlNme` (for inputs) using property binding
3. Handle submission using `ngSubmit` event (available in `ReactiveFormsModule` as well)

- While template-driven approach uses `FormsModule`, reactive approach uses `ReactiveFormsModule`

### Validation

- Adding validators to reactive form controls is simple, just use the `validators` property when instantiating the control instance in the options.
- Validators are functions that either return null (if passed) or return an error if not passed.
- Angular provide static popular validators in `Validators` from `@angular/forms`

### Nested Form Groups

- Reactive forms provide support for nesting form groups.
- This is done simply by grouping related controls in a `FormGroup` value assigned to the root's form group property.
- This is useful when grouping controls such as addresses, password & confirmation, day, month & year, etc.
- You still need to assign a shared parent of the nested form controls to a form group (the related controls form group parent) in the template, using `formGroup` or `formGroupName`.

### Form Arrays

- We sometimes want to have a list of inputs related to a subject such as choose multiple options inputs.
- Angular provides `FormArrays` that let us map form controls to form inputs related to the same subject.
- `formControlName` of the different inputs thus will be the index of that control, not a name.
- The parent of the inputs must have the `formArrayName` directive that takes the form array name's property.
