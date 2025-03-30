
import { Building, CAFApplication, CAFSummary, Region } from "@/types/caf";

// Base SharePoint site URL - this should be updated to your specific SharePoint site
const SHAREPOINT_SITE_URL = "https://your-tenant.sharepoint.com/sites/your-site";
const CAF_APPLICATIONS_LIST_NAME = "CAFApplications";
const BUILDINGS_LIST_NAME = "Buildings";

// Helper function to handle authentication and fetch data from SharePoint
async function fetchFromSharePoint(endpoint: string) {
  try {
    // SharePoint REST API requires authentication
    // This implementation uses browser's authentication context
    // The user must be logged into Microsoft 365
    const response = await fetch(`${SHAREPOINT_SITE_URL}/_api/web/lists/getbytitle('${endpoint}')/items`, {
      method: "GET",
      headers: {
        "Accept": "application/json;odata=nometadata",
        "Content-Type": "application/json"
      },
      credentials: "include" // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`SharePoint API error: ${response.status}`);
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error("Error fetching from SharePoint:", error);
    throw error;
  }
}

// POST/PATCH helper function for updating SharePoint items
async function updateSharePointItem(listName: string, itemId: string, data: any) {
  try {
    const response = await fetch(
      `${SHAREPOINT_SITE_URL}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
      {
        method: "PATCH",
        headers: {
          "Accept": "application/json;odata=nometadata",
          "Content-Type": "application/json",
          "X-HTTP-Method": "MERGE",
          "IF-MATCH": "*"
        },
        body: JSON.stringify(data),
        credentials: "include"
      }
    );

    if (!response.ok) {
      throw new Error(`SharePoint API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating SharePoint item:", error);
    throw error;
  }
}

// Get CAF applications from SharePoint list
export async function getCAFApplications(): Promise<CAFApplication[]> {
  try {
    const items = await fetchFromSharePoint(CAF_APPLICATIONS_LIST_NAME);
    
    // Map SharePoint list items to our CAFApplication type
    return items.map((item: any) => ({
      id: item.ID.toString(),
      title: item.Title || "",
      building: item.Building || "",
      region: item.Region || "",
      requestedAmount: Number(item.RequestedAmount) || 0,
      purchaseAmount: Number(item.PurchaseAmount) || 0,
      approvalStatus: item.ApprovalStatus || "Pending",
      eventType: item.EventType || "One-time",
      tenantsAttended: Number(item.TenantsAttended) || 0,
      pdfLink: item.PDFLink || ""
    }));
  } catch (error) {
    console.error("Error getting CAF applications:", error);
    return [];
  }
}

// Get buildings from SharePoint list
export async function getBuildings(): Promise<Building[]> {
  try {
    const items = await fetchFromSharePoint(BUILDINGS_LIST_NAME);
    
    // Map SharePoint list items to our Building type
    return items.map((item: any) => ({
      id: item.ID.toString(),
      name: item.Title || "",
      address: item.Address || "",
      region: item.Region || "",
      originalBudget: Number(item.OriginalBudget) || 0,
      budgetAfterPurchase: Number(item.BudgetAfterPurchase) || 0
    }));
  } catch (error) {
    console.error("Error getting buildings:", error);
    return [];
  }
}

// Update CAF application
export async function updateCAFApplication(id: string, data: Partial<CAFApplication>): Promise<boolean> {
  // Map our data to SharePoint column names
  const sharePointData: any = {};
  
  if (data.tenantsAttended !== undefined) {
    sharePointData.TenantsAttended = data.tenantsAttended;
  }
  // Add other fields that might be updated

  return updateSharePointItem(CAF_APPLICATIONS_LIST_NAME, id, sharePointData);
}

// Get overall CAF summary with regions
export async function getCAFSummary(): Promise<CAFSummary> {
  try {
    const [cafApplications, buildings] = await Promise.all([
      getCAFApplications(),
      getBuildings()
    ]);
    
    // Group buildings by region
    const buildingsByRegion = buildings.reduce((acc, building) => {
      if (!acc[building.region]) {
        acc[building.region] = [];
      }
      acc[building.region].push(building);
      return acc;
    }, {} as Record<string, Building[]>);
    
    // Group CAF applications by region
    const cafsByRegion = cafApplications.reduce((acc, caf) => {
      if (!acc[caf.region]) {
        acc[caf.region] = [];
      }
      acc[caf.region].push(caf);
      return acc;
    }, {} as Record<string, CAFApplication[]>);
    
    // Calculate regions summary
    const regions: Region[] = Object.keys(buildingsByRegion).map(regionName => {
      const regionBuildings = buildingsByRegion[regionName] || [];
      const regionCAFs = cafsByRegion[regionName] || [];
      
      const totalOriginalBudget = regionBuildings.reduce((sum, b) => sum + b.originalBudget, 0);
      const totalBudgetAfterPurchase = regionBuildings.reduce((sum, b) => sum + b.budgetAfterPurchase, 0);
      const totalApplications = regionCAFs.length;
      const approvedApplications = regionCAFs.filter(caf => caf.approvalStatus === "Approved").length;
      
      return {
        id: regionName.toLowerCase().replace(/\s+/g, '-'),
        name: regionName,
        buildings: regionBuildings,
        cafApplications: regionCAFs,
        totalOriginalBudget,
        totalBudgetAfterPurchase,
        totalApplications,
        approvedApplications,
        approvalRate: totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0
      };
    });
    
    // Calculate overall summary
    const totalApplications = cafApplications.length;
    const approvedApplications = cafApplications.filter(caf => caf.approvalStatus === "Approved").length;
    const oneTimeEvents = cafApplications.filter(caf => caf.eventType === "One-time").length;
    const recurringEvents = cafApplications.filter(caf => caf.eventType === "Recurring").length;
    const tenantLedEvents = cafApplications.filter(caf => caf.eventType === "Tenant-led").length;
    
    return {
      totalApplications,
      approvedApplications,
      approvalRate: totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0,
      oneTimeEvents,
      recurringEvents,
      tenantLedEvents,
      regions,
      totalOriginalBudget: regions.reduce((sum, r) => sum + r.totalOriginalBudget, 0),
      totalBudgetAfterPurchase: regions.reduce((sum, r) => sum + r.totalBudgetAfterPurchase, 0)
    };
  } catch (error) {
    console.error("Error getting CAF summary:", error);
    throw error;
  }
}

// Get a specific region with its buildings and CAFs
export async function getRegionById(id: string): Promise<Region | null> {
  try {
    const summary = await getCAFSummary();
    return summary.regions.find(r => r.id === id) || null;
  } catch (error) {
    console.error(`Error getting region with ID ${id}:`, error);
    return null;
  }
}

// Get a specific building by ID
export async function getBuildingById(id: string): Promise<Building | null> {
  try {
    const buildings = await getBuildings();
    return buildings.find(b => b.id === id) || null;
  } catch (error) {
    console.error(`Error getting building with ID ${id}:`, error);
    return null;
  }
}

// Get CAF applications for a specific building
export async function getCAFApplicationsForBuilding(buildingName: string): Promise<CAFApplication[]> {
  try {
    const cafApplications = await getCAFApplications();
    return cafApplications.filter(caf => caf.building === buildingName);
  } catch (error) {
    console.error(`Error getting CAF applications for building ${buildingName}:`, error);
    return [];
  }
}

// Get a specific CAF application by ID
export async function getCAFApplicationById(id: string): Promise<CAFApplication | null> {
  try {
    const cafApplications = await getCAFApplications();
    return cafApplications.find(caf => caf.id === id) || null;
  } catch (error) {
    console.error(`Error getting CAF application with ID ${id}:`, error);
    return null;
  }
}
