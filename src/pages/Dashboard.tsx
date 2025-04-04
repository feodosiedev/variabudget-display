import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBuildings, fetchCAFApplications } from "@/services/supabaseService";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";
import {
  CalendarCheck,
  FileText,
  Percent,
} from "lucide-react";
import RegionList from "@/components/RegionList";

const Dashboard = () => {
  console.log("Dashboard component initialized");

  const { data: buildings, isLoading: buildingsLoading } = useQuery({
    queryKey: ['buildings'],
    queryFn: fetchBuildings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const { data: cafApplications, isLoading: cafsLoading } = useQuery({
    queryKey: ['cafApplications'],
    queryFn: fetchCAFApplications,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const isLoading = buildingsLoading || cafsLoading;

  // Debug info for the data
  useEffect(() => {
    if (buildings && cafApplications) {
      console.log("Data loaded:", {
        buildingsCount: buildings.length,
        applicationsCount: cafApplications.length,
        eventFrequencies: cafApplications.reduce((acc, app) => {
          acc[app.frequency] = (acc[app.frequency] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });
    }
  }, [buildings, cafApplications]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted" />
          <div className="text-lg">Loading data from Supabase...</div>
        </div>
      </div>
    );
  }

  if (!buildings || !cafApplications) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive text-center">
          <div className="text-lg font-semibold mb-2">Error loading data</div>
          <div className="text-sm">Please check that the Supabase connection is configured correctly.</div>
        </div>
      </div>
    );
  }

  // Calculate region summaries
  const regions = ["north-west", "south-west", "north-east", "south-east"].map(regionId => {
    const regionBuildings = buildings.filter(b => b.region.toLowerCase().replace(" ", "-") === regionId);
    const regionApplications = cafApplications.filter(a => a.region.toLowerCase().replace(" ", "-") === regionId);

    return {
      id: regionId,
      name: regionId.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
      buildings: regionBuildings,
      cafApplications: regionApplications,
      totalOriginalBudget: regionBuildings.reduce((sum, b) => sum + b.originalBudget, 0),
      totalBudgetAfterPurchase: regionBuildings.reduce((sum, b) => sum + b.budgetAfterPurchase, 0),
      totalApplications: regionApplications.length,
      approvedApplications: regionApplications.filter(a => a.approvalStatus === "Approved").length,
      approvalRate: regionApplications.length > 0
        ? (regionApplications.filter(a => a.approvalStatus === "Approved").length / regionApplications.length) * 100
        : 0,
      totalRemainingBudget: regionBuildings.reduce((sum, b) => sum + b.originalBudget, 0) - regionBuildings.reduce((sum, b) => sum + b.budgetAfterPurchase, 0)
    };
  });

  // Calculate total budgets
  const totalOriginalBudget = buildings.reduce((sum, b) => sum + b.originalBudget, 0);
  const totalBudgetAfterPurchase = buildings.reduce((sum, b) => sum + b.budgetAfterPurchase, 0);
  const totalRemainingBudget = totalOriginalBudget - totalBudgetAfterPurchase;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">CAF Applications Dashboard</h1>
          <p className="text-muted-foreground">Track CAF applications and budgets by region</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cafApplications.length}</div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-muted-foreground">
                  {cafApplications.filter(a => a.approvalStatus === "Approved").length} approved
                </span>
              </div>
              <Progress
                value={(cafApplications.filter(a => a.approvalStatus === "Approved").length / cafApplications.length) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {((totalRemainingBudget / totalOriginalBudget) * 100).toFixed(1)}%
                </span>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalOriginalBudget)}</div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(totalRemainingBudget)} remaining
                </span>
              </div>
              <Progress
                value={(totalRemainingBudget / totalOriginalBudget) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                  <span className="text-sm font-medium">
                    {cafApplications.filter(a =>
                      a.frequency === "One-Time"
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Recurring</span>
                  </div>
                  <span className="text-sm font-medium">
                    {cafApplications.filter(a =>
                      a.frequency === "Reoccurring"
                    ).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regions List */}
        <RegionList regions={regions} />
      </main>
    </div>
  );
};

export default Dashboard;
