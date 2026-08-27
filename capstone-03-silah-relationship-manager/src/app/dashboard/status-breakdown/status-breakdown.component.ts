import { Component } from '@angular/core';
import { CardComponent } from "../../shared/ui/card/card.component";
import { StatusComponent } from "./status/status.component";

@Component({
  selector: 'app-status-breakdown',
  imports: [CardComponent, StatusComponent],
  templateUrl: './status-breakdown.component.html',
  styleUrl: './status-breakdown.component.css'
})
export class StatusBreakdownComponent {

}
