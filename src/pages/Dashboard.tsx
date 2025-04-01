import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCAFSummary } from "@/services/sharePointService";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import {
  Building,
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  ClipboardCheck,
  FileText,
  MapPin,
  Percent,
} from "lucide-react";
import RegionList from "@/components/RegionList";

const Dashboard = () => {
  console.log("Dashboard component initialized");
  
  const { data: cafSummary, isLoading, isError, error } = useQuery({
    queryKey: ['cafSummary'],
    queryFn: getCAFSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Debug info for the CAF summary and regions
  useEffect(() => {
    if (cafSummary) {
      console.log("CAF Summary loaded:", cafSummary);
      console.log("Regions found:", cafSummary.regions.length);
      console.log("Region details:", cafSummary.regions.map(r => ({
        name: r.name,
        buildingCount: r.buildings.length,
        applicationCount: r.cafApplications.length,
      })));
    }
    if (isError) {
      console.error("Error loading CAF Summary:", error);
    }
  }, [cafSummary, isError, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted" />
          <div className="text-lg">Loading data from SharePoint...</div>
        </div>
      </div>
    );
  }

  if (isError || !cafSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive text-center">
          <div className="text-lg font-semibold mb-2">Error loading data</div>
          <div className="text-sm">Please check that the SharePoint connection is configured correctly.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">CAF Applications Dashboard</h1>
          <p className="text-muted-foreground">Track CAF applications and budgets by region</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Applications Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">CAF Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cafSummary.totalApplications}</div>
              <div className="flex items-center mt-1">
                <ClipboardCheck className="mr-1 h-4 w-4 text-primary" />
                <span className="text-sm">
                  {cafSummary.approvedApplications} approved
                  <Badge variant="outline" className="ml-2">
                    {cafSummary.approvalRate.toFixed(0)}%
                  </Badge>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Budget Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(cafSummary.totalOriginalBudget)}</div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(cafSummary.totalBudgetAfterPurchase)} remaining
                </span>
              </div>
              <Progress
                value={(cafSummary.totalRemainingBudget / cafSummary.totalOriginalBudget) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>

          {/* Event Types */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Event Types</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">One-time</span>
                  </div>
                  <span className="text-sm font-medium">{cafSummary.oneTimeEvents}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Recurring</span>
                  </div>
                  <span className="text-sm font-medium">{cafSummary.recurringEvents}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Tenant-led</span>
                  </div>
                  <span className="text-sm font-medium">{cafSummary.tenantLedEvents}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regions Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Regions</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cafSummary.regions.length}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {cafSummary.regions.reduce((total, region) => total + region.buildings.length, 0)} buildings total
              </div>
              <div className="mt-3">
                {cafSummary.regions.slice(0, 3).map(region => (
                  <Link
                    key={region.id}
                    to={`/region/${region.id}`}
                    className="flex items-center justify-between text-sm py-1 hover:text-primary"
                  >
                    <span>{region.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
                {cafSummary.regions.length > 3 && (
                  <div className="text-xs text-center mt-1 text-muted-foreground">
                    +{cafSummary.regions.length - 3} more regions
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regions List */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Regions ({cafSummary.regions.length})</h2>
          </div>

          {cafSummary.regions.length === 0 ? (
            <div className="p-6 text-center border rounded-lg bg-muted/10">
              <MapPin className="h-10 w-10 mx-auto mb-2 text-muted" />
              <h3 className="text-lg font-medium mb-1">No Regions Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                No regions found in the Excel file. Please ensure your Excel file has a 'Region' column with region names.
              </p>
            </div>
          ) : (
            <RegionList regions={cafSummary.regions} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
