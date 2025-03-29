
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBuildingById, getRegionById } from "@/services/sharePointService";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

const BuildingDetail = () => {
  const { buildingId, regionId } = useParams<{ buildingId: string; regionId: string }>();
  
  const { data: building, isLoading: isLoadingBuilding, isError: isErrorBuilding } = useQuery({
    queryKey: ['building', buildingId],
    queryFn: () => {
      if (!buildingId) throw new Error("Building ID is required");
      return getBuildingById(buildingId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: region, isLoading: isLoadingRegion } = useQuery({
    queryKey: ['region', regionId],
    queryFn: () => {
      if (!regionId) throw new Error("Region ID is required");
      return getRegionById(regionId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!regionId,
  });

  const isLoading = isLoadingBuilding || isLoadingRegion;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading building data from SharePoint...</div>
      </div>
    );
  }

  if (isErrorBuilding || !building) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
          <Link to={regionId ? `/region/${regionId}` : "/"} className="flex items-center text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {region ? region.name : "Dashboard"}
          </Link>
          <div className="text-destructive">Building not found or error loading data.</div>
        </main>
      </div>
    );
  }

  const percentSpent = (building.actual / building.budgeted) * 100;
  const isOverBudget = building.actual > building.budgeted;
  const variance = building.budgeted - building.actual;
  const variancePercentage = building.budgeted > 0 ? (variance / building.budgeted) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <Link to={regionId ? `/region/${regionId}` : "/"} className="flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {region ? region.name + " Region" : "Dashboard"}
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{building.name}</h1>
          <p className="text-muted-foreground">{region ? region.name + " Region" : "Building Detail"}</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(building.budgeted)}</div>
              <p className="text-xs text-muted-foreground">Allocated budget</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actual Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(building.actual)}</div>
              <p className="text-xs text-muted-foreground">Current spend to date</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-secondary'}`}>
                {formatCurrency(variance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {isOverBudget 
                  ? `Over budget by ${Math.abs(variancePercentage).toFixed(1)}%`
                  : `Under budget by ${variancePercentage.toFixed(1)}%`
                }
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Budget Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span>Spend Progress</span>
                <span>
                  {formatCurrency(building.actual)} / {formatCurrency(building.budgeted)}
                  ({percentSpent.toFixed(1)}%)
                </span>
              </div>
              <Progress 
                value={percentSpent > 100 ? 100 : percentSpent} 
                className={isOverBudget ? 'bg-destructive/20' : 'bg-secondary/20'}
                indicatorClassName={isOverBudget ? 'bg-destructive' : 'bg-secondary'}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BuildingDetail;
