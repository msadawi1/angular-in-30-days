export interface InvestementData {
    initialInvestement: number;
    annualInvestement: number;
    expectedReturn: number;
    duration: number;
}

interface YearInvestementResult {
    year: number;
    interest: number,
    valueEndOfYear: number,
    annualInvestement: number,
    totalInterest: number,
    totalAmountInvested: number,
}

export type YearlyInvestementResults = YearInvestementResult[]

