
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRegionById } from "@/services/sharePointService";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import BuildingList from "@/components/BuildingList";
import { ArrowLeft } from "lucide-react";

const RegionDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: region, isLoading, isError } = useQuery({
    queryKey: ['region', id],
    queryFn: () => {
      if (!id) throw new Error("Region ID is required");
      return getRegionById(id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading region data from SharePoint...</div>
      </div>
    );
  }

  if (isError || !region) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="text-destructive">Region not found or error loading data.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{region.name} Region</h1>
          <p className="text-muted-foreground">Region Budget Detail</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(region.totalBudgeted)}</div>
              <p className="text-xs text-muted-foreground">Total allocated budget</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actual Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(region.totalActual)}</div>
              <p className="text-xs text-muted-foreground">Current spend to date</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${region.variance < 0 ? 'text-destructive' : 'text-secondary'}`}>
                {formatCurrency(region.variance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {region.variance < 0 
                  ? `Over budget by ${Math.abs(region.variancePercentage).toFixed(1)}%`
                  : `Under budget by ${region.variancePercentage.toFixed(1)}%`
                }
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Buildings in {region.name} Region</CardTitle>
            </CardHeader>
            <CardContent>
              <BuildingList buildings={region.buildings} regionId={region.id} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RegionDetail;
