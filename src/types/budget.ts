
export interface Building {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
  region: string;
}

export interface Region {
  id: string;
  name: string;
  buildings: Building[];
  totalBudgeted: number;
  totalActual: number;
  variance: number;
  variancePercentage: number;
}

export interface BudgetSummary {
  totalBudgeted: number;
  totalActual: number;
  variance: number;
  variancePercentage: number;
  regions: Region[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
  icon?: string;
}
