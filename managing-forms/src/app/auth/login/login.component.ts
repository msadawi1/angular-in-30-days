import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = viewChild.required<NgForm>('form');
  destroyRef = inject(DestroyRef);
  readonly STORAGE_KEY = 'login-form-input';

  constructor() {
    /**
     * afterNextRender runs once the component has finished rendering for a single time only
     * NgForm provide a valueChanges observable that pushes changed values to subscribers, subscribing
     * to it gives us the latest values that we can use. The subscription is initialized inside afterNextRender
     * because we want to subscribe only after the template is done rendering, not when the TS class is initialized.
     *
     * The observable interface `next` will register the callback and run it on every emitted value.
     */
    afterNextRender(() => {
      let savedForm = window.localStorage.getItem(this.STORAGE_KEY);
      let savedEmailInput = '';
      if (savedForm) {
        savedEmailInput = JSON.parse(savedForm).email;
        setTimeout(() => {
          this.form().setValue({
            email: savedEmailInput,
            password: '',
          });
        }, 1);
      }

      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              this.STORAGE_KEY,
              JSON.stringify({
                email: value.email,
              }),
            ),
        });

      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  onSubmit(formData: NgForm) {
    if (formData.form.invalid) return;

    console.log(formData.form);
    const enteredEmail = formData.value.email;
    const enteredPassword = formData.value.password;

    console.log({
      enteredEmail,
      enteredPassword,
    });
  }
}
