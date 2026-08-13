import { Injectable } from '@angular/core';
import { InvestementData, YearlyInvestementResults } from './investement.model';

@Injectable({
  providedIn: 'root',
})
export class InvestementService {
  private investementResults?: YearlyInvestementResults = undefined;

  calculateInvestmentResults(investementData: InvestementData) {
    const annualData = [];
    let { initialInvestement, annualInvestement, expectedReturn, duration } = investementData;

    let investmentValue = initialInvestement;

    for (let i = 0; i < duration; i++) {
      const year = i + 1;
      const interestEarnedInYear = investmentValue * (expectedReturn / 100);
      investmentValue += interestEarnedInYear + annualInvestement;
      const totalInterest = investmentValue - annualInvestement * year - initialInvestement;
      annualData.push({
        year: year,
        interest: interestEarnedInYear,
        valueEndOfYear: investmentValue,
        annualInvestement: annualInvestement,
        totalInterest: totalInterest,
        totalAmountInvested: initialInvestement + annualInvestement * year,
      });
    }

    this.investementResults = annualData;
  }

  getInvestementResults() {
    return this.investementResults;
  }
}
