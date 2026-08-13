import { Component } from '@angular/core';
import { InvestementService } from '../investement.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-investment-results',
  imports: [CurrencyPipe],
  templateUrl: './investment-results.component.html',
  styleUrl: './investment-results.component.css'
})
export class InvestmentResultsComponent {
  constructor(private investementService: InvestementService) {}

  get results() {
    return this.investementService.getInvestementResults()
  }
}
