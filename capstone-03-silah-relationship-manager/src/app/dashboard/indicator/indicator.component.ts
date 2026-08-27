import { Component, input } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-indicator',
  imports: [CardComponent],
  templateUrl: './indicator.component.html',
  styleUrl: './indicator.component.css',
})
export class IndicatorComponent {
  label = input.required<string>()
  count = input.required<number>()
}
