import { Building, Region, BudgetSummary } from "@/types/budget";

// Parse CSV data from Building_Budgets_2025.csv
export const buildings: Building[] = [
  // North West Buildings
  { id: "BD01", address: "4455 Bathurst St", budgeted: 7946, actual: 7946, region: "north-west" },
  { id: "BD02", address: "2567 Yonge St", budgeted: 3000, actual: 2772, region: "north-west" },
  { id: "BD03", address: "3179 Yonge St", budgeted: 2904, actual: 2904, region: "north-west" },
  { id: "BD04", address: "12 King High Ave", budgeted: 818, actual: 818, region: "north-west" },
  { id: "BD05", address: "193 Wilson Avenue", budgeted: 3300, actual: 3300, region: "north-west" },
  { id: "BD06", address: "35 Park Home Avenue", budgeted: 7471, actual: 7471, region: "north-west" },
  { id: "BD07", address: "35 Shoreham Drive", budgeted: 8527, actual: 8527, region: "north-west" },
  { id: "BD08", address: "7 - 11 Arleta Ave", budgeted: 9821, actual: 9821, region: "north-west" },
  { id: "BD09", address: "6250 Bathurst St", budgeted: 10270, actual: 10270, region: "north-west" },
  { id: "BD10", address: "5430 Yonge St", budgeted: 6310, actual: 6310, region: "north-west" },
  { id: "BD15", address: "3036 Bathurst St", budgeted: 4224, actual: 4224, region: "north-west" },
  { id: "BD16", address: "3174 Bathurst St", budgeted: 4778, actual: 4778, region: "north-west" },
  { id: "BD17", address: "Flemington Rd", budgeted: 3353, actual: 3353, region: "north-west" },
  { id: "BD18", address: "1775 Eglinton Ave West", budgeted: 7920, actual: 7920, region: "north-west" },
  { id: "BD19", address: "55 Outlook Ave", budgeted: 7260, actual: 7260, region: "north-west" },
  { id: "BD20", address: "130 Vaughan Road", budgeted: 2614, actual: 2614, region: "north-west" },
  { id: "BD21", address: "650 Lawrence Ave West", budgeted: 396, actual: 396, region: "north-west" },
  { id: "BD72", address: "600 Rogers Rd", budgeted: 5280, actual: 5280, region: "north-west" },

  // South West Buildings
  { id: "BD11", address: "41 Mabelle Ave", budgeted: 9240, actual: 9138.75, region: "south-west" },
  { id: "BD12", address: "100 Cavelle Ave", budgeted: 7920, actual: 7920, region: "south-west" },
  { id: "BD13", address: "98 Cavelle Ave", budgeted: 2640, actual: 2640, region: "south-west" },
  { id: "BD14", address: "340 Royal York Rd", budgeted: 8105, actual: 8105, region: "south-west" },
  { id: "BD22", address: "18 Davenport Road", budgeted: 3379, actual: 3379, region: "south-west" },
  { id: "BD23", address: "423 Yonge St", budgeted: 8976, actual: 8976, region: "south-west" },
  { id: "BD24", address: "Rankin Crescent", budgeted: 7814, actual: 7814, region: "south-west" },
  { id: "BD25", address: "1447 King St West", budgeted: 1558, actual: 1558, region: "south-west" },
  { id: "BD26", address: "91 Augusta Ave", budgeted: 6785, actual: 6785, region: "south-west" },
  { id: "BD27", address: "West Lodge Ave", budgeted: 10481, actual: 10481, region: "south-west" },
  { id: "BD28", address: "34 Oxford St", budgeted: 4990, actual: 4990, region: "south-west" },
  { id: "BD29", address: "72 Clinton St", budgeted: 4145, actual: 4145, region: "south-west" },
  { id: "BD30", address: "168 John St", budgeted: 4752, actual: 4752, region: "south-west" },
  { id: "BD31", address: "2835 Lakeshore Blvd West", budgeted: 3907, actual: 3907, region: "south-west" },
  { id: "BD32", address: "250 Twelfth St", budgeted: 4699, actual: 4699, region: "south-west" },

  // North East Buildings
  { id: "BD33", address: "175 Cummer Ave", budgeted: 6494, actual: 6494, region: "north-east" },
  { id: "BD34", address: "4000 Don Mills Rd", budgeted: 10481, actual: 10481, region: "north-east" },
  { id: "BD35", address: "20 Sanderling Pl", budgeted: 2282, actual: 2259, region: "north-east" },
  { id: "BD36", address: "1700 Finch Ave E", budgeted: 7260, actual: 7260, region: "north-east" },
  { id: "BD37", address: "3825 Sheppard Ave E", budgeted: 7920, actual: 7920, region: "north-east" },
  { id: "BD38", address: "71 Merton St", budgeted: 4409, actual: 4409, region: "north-east" },
  { id: "BD39", address: "384 Mt Pleasant Rd", budgeted: 4092, actual: 4092, region: "north-east" },
  { id: "BD40", address: "2008 Pharmacy Ave", budgeted: 7735, actual: 7735, region: "north-east" },
  { id: "BD41", address: "1315 Neilson Rd", budgeted: 3326, actual: 3326, region: "north-east" },
  { id: "BD42", address: "1420 Victoria Park Ave", budgeted: 8712, actual: 8712, region: "north-east" },
  { id: "BD45", address: "120 Town Haven Ave", budgeted: 3960, actual: 3960, region: "north-east" },
  { id: "BD46", address: "2950 Lawrence Ave E", budgeted: 5306, actual: 5306, region: "north-east" },
  { id: "BD48", address: "65 Greencrest Circuit", budgeted: 10560, actual: 10560, region: "north-east" },
  { id: "BD49", address: "10 Deauville Lane", budgeted: 6521, actual: 6521, region: "north-east" },
  { id: "BD50", address: "12 Thorncliffe Park Drive", budgeted: 5782, actual: 5782, region: "north-east" },
  { id: "BD51", address: "130 Eglinton Ave E", budgeted: 7022, actual: 7022, region: "north-east" },
  { id: "BD52", address: "801 Mt Pleasant Road", budgeted: 4884, actual: 4884, region: "north-east" },

  // South East Buildings
  { id: "BD43", address: "575 Danforth Road", budgeted: 422, actual: 422, region: "south-east" },
  { id: "BD44", address: "17 Brimley Rd", budgeted: 8712, actual: 8712, region: "south-east" },
  { id: "BD47", address: "266 Donlands Ave", budgeted: 6706, actual: 6706, region: "south-east" },
  { id: "BD53", address: "7 Coatsworth Crescent", budgeted: 1267, actual: 1267, region: "south-east" },
  { id: "BD54", address: "828 Kingston Road", budgeted: 3881, actual: 3881, region: "south-east" },
  { id: "BD55", address: "133 Merrill Ave E", budgeted: 1109, actual: 1109, region: "south-east" },
  { id: "BD56", address: "50 Norway Ave", budgeted: 1135, actual: 1135, region: "south-east" },
  { id: "BD57", address: "3330 Danforth Ave", budgeted: 5122, actual: 5122, region: "south-east" },
  { id: "BD58", address: "2287 Gerrard St E", budgeted: 1003, actual: 1003, region: "south-east" },
  { id: "BD59", address: "717 Broadview Ave", budgeted: 1822, actual: 1822, region: "south-east" },
  { id: "BD60", address: "80 Danforth Ave", budgeted: 3458, actual: 3458, region: "south-east" },
  { id: "BD61", address: "230 River St", budgeted: 1350, actual: 660, region: "south-east" },
  { id: "BD62", address: "330 Gerrard St E", budgeted: 2600, actual: 2138, region: "south-east" },
  { id: "BD63", address: "252 Sackville St", budgeted: 4198, actual: 4198, region: "south-east" },
  { id: "BD64", address: "540 Queen St E", budgeted: 1162, actual: 1162, region: "south-east" },
  { id: "BD65", address: "585 King St E", budgeted: 3379, actual: 3379, region: "south-east" },
  { id: "BD66", address: "369 Page Ave", budgeted: 3670, actual: 3670, region: "south-east" },
  { id: "BD67", address: "55 Bleecker St", budgeted: 6864, actual: 6864, region: "south-east" },
  { id: "BD68", address: "859 Dundas St E", budgeted: 766, actual: 766, region: "south-east" },
  { id: "BD69", address: "9 Haldon Ave", budgeted: 5280, actual: 5280, region: "south-east" },
  { id: "BD70", address: "145 Strathmore Blvd", budgeted: 9214, actual: 9214, region: "south-east" },
  { id: "BD71", address: "310 Dundas St E", budgeted: 4382, actual: 4382, region: "south-east" }
];

// Calculate region summaries
export const getRegions = (): Region[] => {
  const regionIds = ["north-west", "south-west", "north-east", "south-east"];
  const regionNames = ["North West", "South West", "North East", "South East"];
  
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
