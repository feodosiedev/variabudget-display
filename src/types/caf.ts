export interface CAFApplication {
  id: string;
  title: string;
  building: string; // Building Address
  region: string;
  requestedAmount: number;
  purchaseAmount: number; // Final Amount Purchased
  approvalStatus: "Approved" | "Pending" | "Rejected";
  eventType: string; // CAF Type
  tenantsAttended?: number; // Count of Attending Tenants
  pdfLink?: string; // Attachment Links
  requiresUpdates: boolean; // Status
  frequency: "One-Time" | "Weekly" | "Monthly" | "Reoccurring"; // Frequency of Event
  category: string;
  scheduledDay?: string; // Part of CAF Reoccurring Dates
  recurrenceCount?: number; // Frequency of Event Reoccurring
  firstDate?: string; // First date CAF will take place
  applicantName?: string;
  daysOfWeek?: string[]; // Days of Week Requested
  otherFrequency?: string; // Other frequency for Use of Space
  typeOfFrequency?: string; // Type of Frequency
  receivedDate?: string; // Received Date
  approverName?: string; // Approver's Name
  approvalDate?: string; // Approval Date
  purchaserComment?: string; // Purchaser's Comment
  cafDescription?: string; // CAFDesc
}

export interface Building {
  id: string; // Building Code
  address: string; // Building Address
  region: string;
  originalBudget: number;
  budgetAfterPurchase: number;
  status?: string; // Status Requested amount
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
