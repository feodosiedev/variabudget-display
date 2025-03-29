
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Building } from "@/types/budget";
import { getBuildingById, getRegionById } from "@/data/budgetData";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

const BuildingDetail = () => {
  const { regionId, buildingId } = useParams<{ regionId: string; buildingId: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [regionName, setRegionName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // Small delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        if (buildingId) {
          const buildingData = getBuildingById(buildingId);
          if (buildingData) {
            setBuilding(buildingData);
            
            if (regionId) {
              const regionData = getRegionById(regionId);
              if (regionData) {
                setRegionName(regionData.name);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching building data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [buildingId, regionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading building data...</div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
          <Link to={regionId ? `/region/${regionId}` : "/"} className="flex items-center text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {regionId ? `Back to ${regionName || "Region"}` : "Back to Dashboard"}
          </Link>
          <div className="text-destructive">Building not found.</div>
        </main>
      </div>
    );
  }

  const percentSpent = (building.actual / building.budgeted) * 100;
  const isOverBudget = building.actual > building.budgeted;
  const variance = building.budgeted - building.actual;
  const variancePercentage = (variance / building.budgeted) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <Link to={regionId ? `/region/${regionId}` : "/"} className="flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          {regionId ? `Back to ${regionName || "Region"}` : "Back to Dashboard"}
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{building.name}</h1>
          <p className="text-muted-foreground">{regionName}</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(building.budgeted)}</div>
              <p className="text-xs text-muted-foreground">
                Allocated for this building
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actual Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(building.actual)}</div>
              <p className="text-xs text-muted-foreground">
                Current spend to date
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
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
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Overall Budget Usage</span>
                  <div className="text-sm">
                    <span className={isOverBudget ? 'text-destructive' : ''}>
                      {formatCurrency(building.actual)}
                    </span>
                    <span className="text-muted-foreground"> / {formatCurrency(building.budgeted)}</span>
                  </div>
                </div>
                <Progress 
                  value={percentSpent > 100 ? 100 : percentSpent}
                  className={`h-2 ${isOverBudget ? 'bg-destructive/20' : 'bg-secondary/20'}`}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {percentSpent.toFixed(1)}% of budget used
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BuildingDetail;
