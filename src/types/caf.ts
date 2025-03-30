
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
}
