import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvestementService } from '../investement.service';

@Component({
  selector: 'app-user-input',
  imports: [FormsModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.css',
})
export class UserInputComponent {
  initialInvestement = signal<string>('0');
  annualInvestement = signal<string>('0');
  expectedReturn = signal<string>('0');
  duration = signal<string>('5');

  constructor(private investementService: InvestementService) {}

  onCalculate() {
    this.investementService.calculateInvestmentResults({
      initialInvestement: +this.initialInvestement(),
      annualInvestement: +this.annualInvestement(),
      expectedReturn: +this.expectedReturn(),
      duration: +this.duration(),
    });
  }
}
