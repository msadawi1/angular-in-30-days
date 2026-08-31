import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-notes',
  imports: [CardComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
})
export class NotesComponent {}
