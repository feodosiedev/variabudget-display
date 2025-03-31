export interface CAFApplication {
  id: string;
  title: string;
  building: string;
  region: string;
  requestedAmount: number;
  purchaseAmount: number;
  approvalStatus: "Approved" | "Pending" | "Rejected";
  eventType: "One-time" | "Recurring" | "Tenant-led";
  tenantsAttended?: number;
  pdfLink?: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  region: string;
  originalBudget: number;
  budgetAfterPurchase: number;
}

export interface Region {
  id: string;
  name: string;
  buildings: Building[];
  cafApplications: CAFApplication[];
  totalOriginalBudget: number;
  totalBudgetAfterPurchase: number;
  totalRemainingBudget: number;
  totalApplications: number;
  approvedApplications: number;
  approvalRate: number;
}

export interface CAFSummary {
  totalApplications: number;
  approvedApplications: number;
  approvalRate: number;
  oneTimeEvents: number;
  recurringEvents: number;
  tenantLedEvents: number;
  regions: Region[];
  totalOriginalBudget: number;
  totalBudgetAfterPurchase: number;
  totalRemainingBudget: number;
}

export interface CAFStatistics {
  totalApplications: number;
  cafTypes: Map<string, number>;
  eventTypes: {
    oneTime: number;
    recurring: number;
    tenantLed: number;
  };
  regions: Map<string, number>;
  buildings: Map<string, number>;
}
