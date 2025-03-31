export interface CAFApplication {
  id: string;
  title: string;
  building: string;
  region: string;
  requestedAmount: number;
  purchaseAmount: number;
  approvalStatus: "Approved" | "Pending" | "Rejected";
  eventType: "Holiday Meal" | "Games" | "Social" | "Food" | "Equipment" | "Cultural Event" | string;
  tenantsAttended?: number;
  pdfLink?: string;
  requiresUpdates: boolean;
  frequency: "One-Time" | "Weekly" | "Monthly" | 'Reoccurring';
  category: string;
  scheduledDay?: string;
  recurrenceCount?: number;
  firstDate?: string;
  applicantName?: string;
  daysOfWeek?: string[];
  otherFrequency?: string;
  typeOfFrequency?: string;
}

export interface Building {
  id: string;
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
