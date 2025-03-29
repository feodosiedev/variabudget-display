
import { Building, Region, BudgetSummary } from "@/types/budget";

// Mock data for buildings across regions
export const buildings: Building[] = [
  // North Region Buildings
  { id: "n1", name: "North Tower A", budgeted: 250000, actual: 245000, region: "north" },
  { id: "n2", name: "North Plaza", budgeted: 175000, actual: 180000, region: "north" },
  { id: "n3", name: "North Heights", budgeted: 300000, actual: 290000, region: "north" },
  { id: "n4", name: "Northview Center", budgeted: 220000, actual: 235000, region: "north" },
  // Add more North buildings as needed...
  
  // South Region Buildings
  { id: "s1", name: "South Complex", budgeted: 280000, actual: 275000, region: "south" },
  { id: "s2", name: "South Square", budgeted: 195000, actual: 190000, region: "south" },
  { id: "s3", name: "Southgate Mall", budgeted: 350000, actual: 360000, region: "south" },
  { id: "s4", name: "South Ridge", budgeted: 240000, actual: 230000, region: "south" },
  // Add more South buildings as needed...
  
  // East Region Buildings
  { id: "e1", name: "East Tower", budgeted: 260000, actual: 255000, region: "east" },
  { id: "e2", name: "Eastside Plaza", budgeted: 185000, actual: 195000, region: "east" },
  { id: "e3", name: "East Park", budgeted: 320000, actual: 310000, region: "east" },
  { id: "e4", name: "Eastview Center", budgeted: 230000, actual: 240000, region: "east" },
  // Add more East buildings as needed...
  
  // West Region Buildings
  { id: "w1", name: "West Tower", budgeted: 270000, actual: 260000, region: "west" },
  { id: "w2", name: "Westside Mall", budgeted: 190000, actual: 200000, region: "west" },
  { id: "w3", name: "West Heights", budgeted: 340000, actual: 330000, region: "west" },
  { id: "w4", name: "Westview Office", budgeted: 250000, actual: 260000, region: "west" },
  // Add more West buildings as needed...
];

// Calculate region summaries
export const getRegions = (): Region[] => {
  const regionIds = ["north", "south", "east", "west"];
  const regionNames = ["North Region", "South Region", "East Region", "West Region"];
  
  return regionIds.map((regionId, index) => {
    const regionBuildings = buildings.filter(building => building.region === regionId);
    const totalBudgeted = regionBuildings.reduce((sum, building) => sum + building.budgeted, 0);
    const totalActual = regionBuildings.reduce((sum, building) => sum + building.actual, 0);
    const variance = totalBudgeted - totalActual;
    const variancePercentage = (variance / totalBudgeted) * 100;
    
    return {
      id: regionId,
      name: regionNames[index],
      buildings: regionBuildings,
      totalBudgeted,
      totalActual,
      variance,
      variancePercentage
    };
  });
};

// Get overall budget summary
export const getBudgetSummary = (): BudgetSummary => {
  const regions = getRegions();
  const totalBudgeted = regions.reduce((sum, region) => sum + region.totalBudgeted, 0);
  const totalActual = regions.reduce((sum, region) => sum + region.totalActual, 0);
  const variance = totalBudgeted - totalActual;
  const variancePercentage = (variance / totalBudgeted) * 100;
  
  return {
    totalBudgeted,
    totalActual,
    variance,
    variancePercentage,
    regions
  };
};

// Get a specific region by ID
export const getRegionById = (id: string): Region | undefined => {
  return getRegions().find(region => region.id === id);
};

// Get a specific building by ID
export const getBuildingById = (id: string): Building | undefined => {
  return buildings.find(building => building.id === id);
};
