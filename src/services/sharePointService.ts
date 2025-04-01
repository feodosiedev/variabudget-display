
import { Building, CAFApplication, CAFSummary, Region } from "@/types/caf";
import { SPFI, spfi } from "@pnp/sp";
import { SPFetchClient } from "@pnp/nodejs";
import { LogLevel, PnPLogging } from "@pnp/logging";
import { toast } from "@/components/ui/use-toast";

// SharePoint configuration
const SP_SITE_URL = "https://your-sharepoint-site.sharepoint.com"; // Replace with your actual SharePoint site URL
const CAF_APPLICATIONS_LIST = "CAFApplications"; // Replace with your actual list name
const BUILDINGS_LIST = "Buildings"; // Replace with your actual list name

// Initialize PnP JS with SharePoint context
let sp: SPFI;

try {
  sp = spfi(SP_SITE_URL).using(
    SPFetchClient(SP_SITE_URL, {
      headers: {
        "Accept": "application/json;odata=verbose",
      },
    })
  ).using(
    PnPLogging(LogLevel.Warning)
  );
} catch (error) {
  console.error("Error initializing SharePoint connection:", error);
  // Fallback to mock data if initialization fails
  import("@/data/budgetData").then(({ buildings: budgetBuildings }) => {
    console.log("Fallback to mock budget data");
  });
  import("@/data/cafData").then(({ cafApplications }) => {
    console.log("Fallback to mock CAF data");
  });
}

// Error handling helper
const handleSharePointError = (error: any, fallbackData: any, errorMessage: string) => {
  console.error(errorMessage, error);
  toast({
    title: "Error",
    description: `Failed to fetch data from SharePoint: ${errorMessage}`,
    variant: "destructive",
  });
  return fallbackData;
};

// Get buildings from SharePoint
export async function getBuildings(): Promise<Building[]> {
  try {
    // Check if SharePoint is initialized
    if (!sp) {
      throw new Error("SharePoint connection not initialized");
    }

    // Fetch buildings from SharePoint list
    const spBuildings = await sp.web.lists.getByTitle(BUILDINGS_LIST).items.select(
      "Id", "Title", "Address", "Region", "OriginalBudget", "BudgetAfterPurchase"
    ).getAll();

    // Map SharePoint items to Building objects
    return spBuildings.map(item => ({
      id: item.Id,
      name: item.Title,
      address: item.Address,
      region: item.Region.toLowerCase().replace(" ", "-"),
      originalBudget: parseFloat(item.OriginalBudget) || 0,
      budgetAfterPurchase: parseFloat(item.BudgetAfterPurchase) || 0
    }));
  } catch (error) {
    // Fallback to mock data
    const { buildings: budgetBuildings } = await import("@/data/budgetData");
    return handleSharePointError(
      error, 
      budgetBuildings.map(building => ({
        id: building.id,
        name: building.address,
        address: building.address,
        region: building.region,
        originalBudget: building.budgeted,
        budgetAfterPurchase: building.actual
      })),
      "Error fetching buildings"
    );
  }
}

// Get CAF applications from SharePoint
export async function getCAFApplications(): Promise<CAFApplication[]> {
  try {
    // Check if SharePoint is initialized
    if (!sp) {
      throw new Error("SharePoint connection not initialized");
    }

    // Fetch CAF applications from SharePoint list
    const spApplications = await sp.web.lists.getByTitle(CAF_APPLICATIONS_LIST).items.select(
      "Id", "Title", "Building", "Region", "RequestedAmount", "PurchaseAmount", 
      "ApprovalStatus", "EventType", "TenantsAttended", "PdfLink", 
      "RequiresUpdates", "Frequency", "Category", "ScheduledDay",
      "RecurrenceCount", "FirstDate", "ApplicantName", "DaysOfWeek",
      "OtherFrequency", "TypeOfFrequency"
    ).getAll();

    // Map SharePoint items to CAFApplication objects
    return spApplications.map(item => ({
      id: item.Id,
      title: item.Title,
      building: item.Building,
      region: item.Region,
      requestedAmount: parseFloat(item.RequestedAmount) || 0,
      purchaseAmount: parseFloat(item.PurchaseAmount) || 0,
      approvalStatus: item.ApprovalStatus as "Approved" | "Pending" | "Rejected",
      eventType: item.EventType,
      tenantsAttended: parseInt(item.TenantsAttended) || undefined,
      pdfLink: item.PdfLink || undefined,
      requiresUpdates: item.RequiresUpdates === "Yes",
      frequency: item.Frequency as "One-Time" | "Weekly" | "Monthly" | "Reoccurring",
      category: item.Category,
      scheduledDay: item.ScheduledDay || undefined,
      recurrenceCount: parseInt(item.RecurrenceCount) || undefined,
      firstDate: item.FirstDate || undefined,
      applicantName: item.ApplicantName || undefined,
      daysOfWeek: item.DaysOfWeek ? item.DaysOfWeek.split(";") : undefined,
      otherFrequency: item.OtherFrequency || undefined,
      typeOfFrequency: item.TypeOfFrequency || undefined
    }));
  } catch (error) {
    // Fallback to mock data
    const { cafApplications } = await import("@/data/cafData");
    return handleSharePointError(error, cafApplications, "Error fetching CAF applications");
  }
}

// Get CAF summary
export async function getCAFSummary(): Promise<CAFSummary> {
  try {
    const buildings = await getBuildings();
    const applications = await getCAFApplications();
    
    // Calculate region summaries
    const regions = ["north-west", "south-west", "north-east", "south-east"].map(regionId => {
      const regionBuildings = buildings.filter(b => b.region === regionId);
      const regionApplications = applications.filter(a => a.region.toLowerCase().replace(" ", "-") === regionId);
      
      return {
        id: regionId,
        name: regionId.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        buildings: regionBuildings,
        cafApplications: regionApplications,
        totalOriginalBudget: regionBuildings.reduce((sum, b) => sum + b.originalBudget, 0),
        totalBudgetAfterPurchase: regionBuildings.reduce((sum, b) => sum + b.budgetAfterPurchase, 0),
        totalApplications: regionApplications.length,
        approvedApplications: regionApplications.filter(a => a.approvalStatus === "Approved").length,
        approvalRate: regionApplications.length > 0 
          ? (regionApplications.filter(a => a.approvalStatus === "Approved").length / regionApplications.length) * 100 
          : 0,
        totalRemainingBudget: regionBuildings.reduce((sum, b) => sum + (b.originalBudget - b.budgetAfterPurchase), 0)
      };
    });

    // Calculate overall summary
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(a => a.approvalStatus === "Approved").length;
    const oneTimeEvents = applications.filter(a => a.frequency === "One-Time").length;
    const recurringEvents = applications.filter(a => a.frequency === "Reoccurring").length;
    const tenantLedEvents = applications.filter(a => a.eventType === "Social").length;

    return {
      totalApplications,
      approvedApplications,
      approvalRate: totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0,
      oneTimeEvents,
      recurringEvents,
      tenantLedEvents,
      regions,
      totalOriginalBudget: buildings.reduce((sum, b) => sum + b.originalBudget, 0),
      totalBudgetAfterPurchase: buildings.reduce((sum, b) => sum + b.budgetAfterPurchase, 0),
      totalRemainingBudget: buildings.reduce((sum, b) => sum + (b.originalBudget - b.budgetAfterPurchase), 0)
    };
  } catch (error) {
    console.error("Error getting CAF summary:", error);
    return {
      totalApplications: 0,
      approvedApplications: 0,
      approvalRate: 0,
      oneTimeEvents: 0,
      recurringEvents: 0,
      tenantLedEvents: 0,
      regions: [],
      totalOriginalBudget: 0,
      totalBudgetAfterPurchase: 0,
      totalRemainingBudget: 0
    };
  }
}

// Get a specific region by ID
export async function getRegionById(id: string): Promise<Region | null> {
  try {
    const summary = await getCAFSummary();
    return summary.regions.find(region => region.id === id) || null;
  } catch (error) {
    console.error("Error getting region:", error);
    return null;
  }
}

// Get a specific building by ID
export async function getBuildingById(id: string): Promise<Building | null> {
  try {
    const buildings = await getBuildings();
    return buildings.find(building => building.id === id) || null;
  } catch (error) {
    console.error("Error getting building:", error);
    return null;
  }
}

// Get CAF applications for a specific building
export async function getCAFApplicationsForBuilding(buildingName: string): Promise<CAFApplication[]> {
  try {
    const applications = await getCAFApplications();
    return applications.filter(app => app.building === buildingName);
  } catch (error) {
    console.error("Error getting CAF applications for building:", error);
    return [];
  }
}

// Get a specific CAF application by ID
export async function getCAFApplicationById(id: string): Promise<CAFApplication | null> {
  try {
    const applications = await getCAFApplications();
    return applications.find(app => app.id === id) || null;
  } catch (error) {
    console.error("Error getting CAF application:", error);
    return null;
  }
}

// Update CAF application
export async function updateCAFApplication(id: string, data: Partial<CAFApplication>): Promise<boolean> {
  try {
    // Check if SharePoint is initialized
    if (!sp) {
      throw new Error("SharePoint connection not initialized");
    }

    // Prepare the data for SharePoint update
    const updateData: any = {};
    
    if (data.title) updateData.Title = data.title;
    if (data.building) updateData.Building = data.building;
    if (data.region) updateData.Region = data.region;
    if (data.requestedAmount !== undefined) updateData.RequestedAmount = data.requestedAmount.toString();
    if (data.purchaseAmount !== undefined) updateData.PurchaseAmount = data.purchaseAmount.toString();
    if (data.approvalStatus) updateData.ApprovalStatus = data.approvalStatus;
    if (data.eventType) updateData.EventType = data.eventType;
    if (data.tenantsAttended !== undefined) updateData.TenantsAttended = data.tenantsAttended.toString();
    if (data.pdfLink) updateData.PdfLink = data.pdfLink;
    if (data.requiresUpdates !== undefined) updateData.RequiresUpdates = data.requiresUpdates ? "Yes" : "No";
    if (data.frequency) updateData.Frequency = data.frequency;
    if (data.category) updateData.Category = data.category;
    if (data.scheduledDay) updateData.ScheduledDay = data.scheduledDay;
    if (data.recurrenceCount !== undefined) updateData.RecurrenceCount = data.recurrenceCount.toString();
    if (data.firstDate) updateData.FirstDate = data.firstDate;
    if (data.applicantName) updateData.ApplicantName = data.applicantName;
    if (data.daysOfWeek) updateData.DaysOfWeek = data.daysOfWeek.join(";");
    if (data.otherFrequency) updateData.OtherFrequency = data.otherFrequency;
    if (data.typeOfFrequency) updateData.TypeOfFrequency = data.typeOfFrequency;

    // Update the SharePoint list item
    await sp.web.lists.getByTitle(CAF_APPLICATIONS_LIST).items.getById(parseInt(id)).update(updateData);
    
    toast({
      title: "Success",
      description: "CAF application updated successfully",
    });
    
    return true;
  } catch (error) {
    console.error("Error updating CAF application:", error);
    
    toast({
      title: "Error",
      description: "Failed to update CAF application",
      variant: "destructive",
    });
    
    return false;
  }
}
