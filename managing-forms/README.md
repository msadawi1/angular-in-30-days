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
