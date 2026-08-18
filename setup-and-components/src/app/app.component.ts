import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

// inline CSS/HTML take presednece
@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  templateUrl: './app.component.html',
  styleUrl: 'app.component.css'
})
export class AppComponent {
  
}
