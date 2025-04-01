import { Building, CAFApplication, CAFSummary, Region } from "@/types/caf";
import { SPFI, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { toast } from "@/components/ui/use-toast";
import { SharePointConfig } from "@/utils/sharePointConfig";

// Initialize PnP JS with SharePoint context
let sp: SPFI | null = null;

try {
  // Initialize the SharePoint connection
  // In a real scenario, this would authenticate with SharePoint
  // For now, we just initialize the library to keep the code structure
  sp = spfi(SharePointConfig.siteUrl);
  console.log("SharePoint connection initialized");
} catch (error) {
  console.error("Error initializing SharePoint connection:", error);
  sp = null;
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
      console.log("SharePoint not initialized, using mock data");
      throw new Error("SharePoint connection not initialized");
    }

    // Normally, this would fetch data from SharePoint
    // Since we don't have a real connection, this will throw an error and fall back to mock data
    console.log("Attempting to fetch buildings from SharePoint");
    
    // In a real implementation, this would be:
    // const spBuildings = await sp.web.lists.getByTitle(SharePointConfig.lists.buildings).items.select(...).getAll();
    // For now, we'll throw an error to use mock data
    throw new Error("SharePoint API calls not implemented");
    
  } catch (error) {
    // Fallback to mock data
    console.log("Falling back to mock building data");
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
      console.log("SharePoint not initialized, using mock data");
      throw new Error("SharePoint connection not initialized");
    }

    // Normally, this would fetch data from SharePoint
    // Since we don't have a real connection, this will throw an error and fall back to mock data
    console.log("Attempting to fetch CAF applications from SharePoint");
    
    // In a real implementation, this would be:
    // const spApplications = await sp.web.lists.getByTitle(SharePointConfig.lists.cafApplications).items.select(...).getAll();
    // For now, we'll throw an error to use mock data
    throw new Error("SharePoint API calls not implemented");
    
  } catch (error) {
    // Fallback to mock data
    console.log("Falling back to mock CAF data");
    const { cafApplications } = await import("@/data/cafData");
    return handleSharePointError(error, cafApplications, "Error fetching CAF applications");
  }
}

// Get CAF summary
export async function getCAFSummary(): Promise<CAFSummary> {
  try {
    console.log("Fetching CAF summary data");
    const buildings = await getBuildings();
    const applications = await getCAFApplications();
    
    console.log(`Retrieved ${buildings.length} buildings and ${applications.length} applications`);
    
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

    console.log(`Processed data: ${regions.length} regions, ${totalApplications} applications`);

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

// Update CAF application (this would be a real update in SharePoint in a real implementation)
export async function updateCAFApplication(id: string, data: Partial<CAFApplication>): Promise<boolean> {
  try {
    // Check if SharePoint is initialized
    if (!sp) {
      console.log("SharePoint not initialized, cannot update CAF application");
      throw new Error("SharePoint connection not initialized");
    }

    // In a real implementation, this would update the SharePoint list item
    console.log(`Mock update for CAF application ${id}`, data);
    
    // Simulate success for now
    toast({
      title: "Success",
      description: "CAF application updated successfully (mock update)",
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
