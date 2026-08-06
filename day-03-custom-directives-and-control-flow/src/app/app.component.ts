import { Component } from '@angular/core';
import { TextHighlightDirective } from './text-highlight.directive';

@Component({
  selector: 'app-root',
  imports: [TextHighlightDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'day-03-custom-directives-and-control-flow';
}
