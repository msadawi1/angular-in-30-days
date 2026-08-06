import { Component } from '@angular/core';

// inline CSS/HTML take presednece
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: 'app.component.css'
})
export class AppComponent {
  count = 0;
  toy = 0;

  handleToyChange() {
    this.toy++;
  }

  handleCountIncrement() {
    this.count++;
  }

  handleCountDecrement() {
    this.count--;
  }
}
