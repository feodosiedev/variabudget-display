export interface Building {
  id: string;
  address: string;  // Changed from name to address
  budgeted: number;  // Original Budget
  actual: number;    // Budget After Purchase
  region: string;    // Region (north-west, south-west, north-east, south-east)
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
