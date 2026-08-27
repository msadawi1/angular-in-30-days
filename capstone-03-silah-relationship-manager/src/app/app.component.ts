import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, DashboardComponent]
})
export class AppComponent {
  title = 'Silah - Bring People Closer';
}
