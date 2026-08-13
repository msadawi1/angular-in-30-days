import { Component, Input, output } from '@angular/core';
import { type User } from './user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  @Input({ required: true }) isSelected!: boolean;
  @Input({ required: true }) user!: User;

  // @Output() select = new EventEmitter<string>();
  select = output<string>()

  get avatarPath() {
    return 'assets/users/' + this.user.avatar;
  }

  onSelectUser() {
    this.select.emit(this.user.id)
  }
}
