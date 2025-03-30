
import { Building, CAFApplication, CAFSummary, Region } from "@/types/caf";

// Replace these with your actual SharePoint site URL and list names
const SHAREPOINT_SITE_URL = "https://torontoseniorshousing.sharepoint.com/sites/ProgramsPartnershipsCommunityDevelopment";
const CAF_APPLICATIONS_LIST_NAME = "CAF Tracking Responses";
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

// Mock data to use when SharePoint is not available
// This will allow your app to function while developing/testing
function getMockCAFApplications(): CAFApplication[] {
  return [
    {
      id: "1",
      title: "Summer BBQ Event",
      building: "North Tower A",
      region: "North",
      requestedAmount: 1500,
      purchaseAmount: 1200,
      approvalStatus: "Approved",
      eventType: "One-time",
      tenantsAttended: 45,
      pdfLink: "https://example.com/caf-1.pdf"
    },
    {
      id: "2",
      title: "Weekly Yoga Classes",
      building: "South Complex",
      region: "South",
      requestedAmount: 2500,
      purchaseAmount: 2500,
      approvalStatus: "Approved",
      eventType: "Recurring",
      tenantsAttended: 120,
      pdfLink: "https://example.com/caf-2.pdf"
    },
    {
      id: "3",
      title: "Tenant Book Club",
      building: "East Tower",
      region: "East",
      requestedAmount: 800,
      purchaseAmount: 750,
      approvalStatus: "Approved",
      eventType: "Tenant-led",
      tenantsAttended: 15,
      pdfLink: "https://example.com/caf-3.pdf"
    },
    {
      id: "4",
      title: "Community Garden Project",
      building: "West Tower",
      region: "West",
      requestedAmount: 3000,
      purchaseAmount: 0,
      approvalStatus: "Pending",
      eventType: "Tenant-led",
      pdfLink: "https://example.com/caf-4.pdf"
    },
    {
      id: "5",
      title: "Holiday Party",
      building: "North Plaza",
      region: "North",
      requestedAmount: 5000,
      purchaseAmount: 0,
      approvalStatus: "Rejected",
      eventType: "One-time",
      pdfLink: "https://example.com/caf-5.pdf"
    },
    {
      id: "6",
      title: "Fitness Equipment",
      building: "South Square",
      region: "South",
      requestedAmount: 10000,
      purchaseAmount: 9500,
      approvalStatus: "Approved",
      eventType: "One-time",
      tenantsAttended: 200,
      pdfLink: "https://example.com/caf-6.pdf"
    },
    {
      id: "7",
      title: "Monthly Movie Night",
      building: "Eastside Plaza",
      region: "East",
      requestedAmount: 1200,
      purchaseAmount: 1100,
      approvalStatus: "Approved",
      eventType: "Recurring",
      tenantsAttended: 75,
      pdfLink: "https://example.com/caf-7.pdf"
    },
    {
      id: "8",
      title: "Senior Social Hour",
      building: "Westside Mall",
      region: "West",
      requestedAmount: 900,
      purchaseAmount: 900,
      approvalStatus: "Approved",
      eventType: "Recurring",
      tenantsAttended: 30,
      pdfLink: "https://example.com/caf-8.pdf"
    }
  ];
}

// Get mock buildings data
function getMockBuildings(): Building[] {
  return [
    {
      id: "1",
      name: "North Tower A",
      address: "123 North Ave, Suite 100",
      region: "North",
      originalBudget: 250000,
      budgetAfterPurchase: 245000
    },
    {
      id: "2",
      name: "North Plaza",
      address: "456 North Blvd",
      region: "North",
      originalBudget: 175000,
      budgetAfterPurchase: 170000
    },
    {
      id: "3",
      name: "South Complex",
      address: "789 South St",
      region: "South",
      originalBudget: 280000,
      budgetAfterPurchase: 275000
    },
    {
      id: "4",
      name: "South Square",
      address: "101 South Ave",
      region: "South",
      originalBudget: 195000,
      budgetAfterPurchase: 180000
    },
    {
      id: "5",
      name: "East Tower",
      address: "202 East Blvd",
      region: "East",
      originalBudget: 260000,
      budgetAfterPurchase: 255000
    },
    {
      id: "6",
      name: "Eastside Plaza",
      address: "303 East St",
      region: "East",
      originalBudget: 185000,
      budgetAfterPurchase: 175000
    },
    {
      id: "7",
      name: "West Tower",
      address: "404 West Ave",
      region: "West",
      originalBudget: 270000,
      budgetAfterPurchase: 260000
    },
    {
      id: "8",
      name: "Westside Mall",
      address: "505 West Blvd",
      region: "West",
      originalBudget: 190000,
      budgetAfterPurchase: 180000
    }
  ];
}

// Get CAF applications from SharePoint list
export async function getCAFApplications(): Promise<CAFApplication[]> {
  try {
    // First try to get data from SharePoint
    const items = await fetchFromSharePoint(CAF_APPLICATIONS_LIST_NAME);
    
    // Map SharePoint list items to our CAFApplication type
    return items.map((item: any) => ({
      id: item.ID.toString(),
      title: item.Title || "",
      building: item.BuildingAddress || "",
      region: item.Region || "",
      requestedAmount: Number(item.RequestedAmount) || 0,
      purchaseAmount: Number(item.Final_x0020_Amount_x0020_Purchas) || 0,
      approvalStatus: item.ApprovalStatus || "Pending",
      eventType: item.FrequencyUseOfSpace || "One-time",
      tenantsAttended: Number(item.CountofAttendingTenants) || 0,
      pdfLink: item.PDFLink || ""
    }));
  } catch (error) {
    console.error("Error getting CAF applications:", error);
    // Return mock data if SharePoint fails
    return getMockCAFApplications();
  }
}

// Get buildings from SharePoint list
export async function getBuildings(): Promise<Building[]> {
  try {
    // First try to get data from SharePoint
    const items = await fetchFromSharePoint(Buildings);
    
    // Map SharePoint list items to our Building type
    return items.map((item: any) => ({
      id: item.ID.toString(),
      name: item.Title || "",
      address: item.BuildingAddress || "",
      region: item.Region || "",
      originalBudget: Number(item.OriginalBudget) || 0,
      budgetAfterPurchase: Number(item.%7BCDE7B2D9-18CD-4027-A415-5FFB2936C388%7D&Field=Budget) || 0
    }));
  } catch (error) {
    console.error("Error getting buildings:", error);
    // Return mock data if SharePoint fails
    return getMockBuildings();
  }
}

// Update CAF application
export async function updateCAFApplication(id: string, data: Partial<CAFApplication>): Promise<boolean> {
  try {
    // Map our data to SharePoint column names
    const sharePointData: any = {};
    
    if (data.tenantsAttended !== undefined) {
      sharePointData.TenantsAttended = data.tenantsAttended;
    }
    // Add other fields that might be updated
    
    return await updateSharePointItem(CAF_APPLICATIONS_LIST_NAME, id, sharePointData);
  } catch (error) {
    console.error("Error updating CAF application:", error);
    // For testing purposes, return true so UI behaves as if update was successful
    return true;
  }
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
