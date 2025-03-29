
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Region } from "@/types/budget";
import { getRegionById } from "@/data/budgetData";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import BuildingList from "@/components/BuildingList";

const RegionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // Small delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        if (id) {
          const data = getRegionById(id);
          if (data) {
            setRegion(data);
          }
        }
      } catch (error) {
        console.error("Error fetching region data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading region data...</div>
      </div>
    );
  }

  if (!region) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="text-destructive">Region not found.</div>
        </main>
      </div>
    );
  }

  const isOverBudget = region.variance < 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{region.name}</h1>
          <p className="text-muted-foreground">{region.buildings.length} Buildings</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(region.totalBudgeted)}</div>
              <p className="text-xs text-muted-foreground">
                Planned spending for region
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actual Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(region.totalActual)}</div>
              <p className="text-xs text-muted-foreground">
                Current spending to date
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-secondary'}`}>
                {formatCurrency(region.variance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {isOverBudget 
                  ? `Over budget by ${Math.abs(region.variancePercentage).toFixed(1)}%`
                  : `Under budget by ${region.variancePercentage.toFixed(1)}%`
                }
              </p>
            </CardContent>
          </Card>
        </div>
        
        <BuildingList buildings={region.buildings} regionId={region.id} />
      </main>
    </div>
  );
};

export default RegionDetail;
