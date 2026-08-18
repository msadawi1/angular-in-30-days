import { Component } from '@angular/core';

type User = {
  id: number
  name: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isSignedIn: boolean = true

  readonly users: User[] = [
    { id: 0, name: "Mohammed" },
    { id: 1, name: "Sadawi" }
  ]

  onSignIn() {
    this.isSignedIn = true
  }

  onSignOut() {
    this.isSignedIn = false
  }
}
