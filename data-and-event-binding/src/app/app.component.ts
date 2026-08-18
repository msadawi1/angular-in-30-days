import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly welcomeMessage = 'Welcome Back';
  names = ["Mohammed", "Alsadawi"]
  readonly promptToSign = 'Please sign in to start'
  
  isLoggedIn = false
  readonly currentStyles = {
    "color": this.isLoggedIn ? "black" : "red"
  }
}
