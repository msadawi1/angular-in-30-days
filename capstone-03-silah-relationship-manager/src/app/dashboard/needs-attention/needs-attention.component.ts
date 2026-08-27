import { Component } from '@angular/core';
import { CardComponent } from "../../shared/ui/card/card.component";
import { PersonComponent } from "./person/person.component";

@Component({
  selector: 'app-needs-attention',
  imports: [CardComponent, PersonComponent],
  templateUrl: './needs-attention.component.html',
  styleUrl: './needs-attention.component.css',
})
export class NeedsAttentionComponent {}
