
import { Building, Region, BudgetSummary } from "@/types/budget";

// Base SharePoint site URL - this should be updated to your specific SharePoint site
const SHAREPOINT_SITE_URL = "https://your-tenant.sharepoint.com/sites/your-site";
const BUILDINGS_LIST_NAME = "Buildings";
const REGIONS_LIST_NAME = "Regions";

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

// Get buildings from SharePoint list
export async function getBuildings(): Promise<Building[]> {
  try {
    const items = await fetchFromSharePoint(BUILDINGS_LIST_NAME);
    
    // Map SharePoint list items to our Building type
    // Adjust field names to match your SharePoint list columns
    return items.map((item: any) => ({
      id: item.Id.toString(),
      name: item.Title,
      budgeted: Number(item.Budgeted) || 0,
      actual: Number(item.Actual) || 0,
      region: item.RegionId || "",
    }));
  } catch (error) {
    console.error("Error getting buildings:", error);
    return [];
  }
}

// Get regions from SharePoint list
export async function getRegions(): Promise<Region[]> {
  try {
    const regions = await fetchFromSharePoint(REGIONS_LIST_NAME);
    const buildings = await getBuildings();
    
    // Map SharePoint list items to our Region type
    // Group buildings by region
    return regions.map((region: any) => {
      const regionBuildings = buildings.filter(b => b.region === region.Id.toString());
      const totalBudgeted = regionBuildings.reduce((sum, b) => sum + b.budgeted, 0);
      const totalActual = regionBuildings.reduce((sum, b) => sum + b.actual, 0);
      const variance = totalBudgeted - totalActual;
      const variancePercentage = totalBudgeted > 0 ? (variance / totalBudgeted) * 100 : 0;
      
      return {
        id: region.Id.toString(),
        name: region.Title,
        buildings: regionBuildings,
        totalBudgeted,
        totalActual,
        variance,
        variancePercentage
      };
    });
  } catch (error) {
    console.error("Error getting regions:", error);
    return [];
  }
}

// Get overall budget summary
export async function getBudgetSummary(): Promise<BudgetSummary> {
  try {
    const regions = await getRegions();
    
    const totalBudgeted = regions.reduce((sum, r) => sum + r.totalBudgeted, 0);
    const totalActual = regions.reduce((sum, r) => sum + r.totalActual, 0);
    const variance = totalBudgeted - totalActual;
    const variancePercentage = totalBudgeted > 0 ? (variance / totalBudgeted) * 100 : 0;
    
    return {
      totalBudgeted,
      totalActual,
      variance,
      variancePercentage,
      regions
    };
  } catch (error) {
    console.error("Error getting budget summary:", error);
    throw error;
  }
}

// Get a specific region by ID with its buildings
export async function getRegionById(id: string): Promise<Region | null> {
  try {
    const regions = await getRegions();
    return regions.find(r => r.id === id) || null;
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
