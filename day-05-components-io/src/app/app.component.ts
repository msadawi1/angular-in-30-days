import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { DUMMY_USERS } from '../data/dummy-users';
import { UserComponent } from './user/user.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, UserComponent]
})
export class AppComponent {
  users = DUMMY_USERS;

  onSelectUser(id: string) {
    console.log({ id });
  }
}
