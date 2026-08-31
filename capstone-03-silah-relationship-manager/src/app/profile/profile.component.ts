import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CardComponent } from "../shared/ui/card/card.component";

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
