import { Component } from '@angular/core';

// inline CSS/HTML take presednece
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: 'app.component.css'
})
export class AppComponent {
  title = 'Angular Tutorial Day #1';
  description = 'Setup, Architecture & Components'
}
