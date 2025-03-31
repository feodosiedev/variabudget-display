import { Building, CAFApplication, CAFSummary, Region } from "@/types/caf";
import { buildings as budgetBuildings } from "@/data/budgetData";
import { cafApplications } from "@/data/cafData";

// Get buildings from CSV data
export async function getBuildings(): Promise<Building[]> {
  try {
    // Map budget buildings to CAF buildings
    return budgetBuildings.map(building => ({
      id: building.id,
      name: building.address,  // Use address as name for CAF building
      address: building.address,
      region: building.region,
      originalBudget: building.budgeted,
      budgetAfterPurchase: building.actual
    }));
  } catch (error) {
    console.error("Error getting buildings:", error);
    return [];
  }
}

// Get CAF applications from CSV data
export async function getCAFApplications(): Promise<CAFApplication[]> {
  try {
    return cafApplications;
  } catch (error) {
    console.error("Error getting CAF applications:", error);
    return [];
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
    const recurringEvents = applications.filter(a => a.frequency === "Weekly" || a.frequency === "Monthly").length;
    const tenantLedEvents = applications.filter(a => a.eventType === "Holiday Meal").length;

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

// Update CAF application (mock implementation)
export async function updateCAFApplication(id: string, data: Partial<CAFApplication>): Promise<boolean> {
  try {
    // In a real implementation, this would update the SharePoint list
    console.log("Updating CAF application:", id, data);
    return true;
  } catch (error) {
    console.error("Error updating CAF application:", error);
    return false;
  }
}
