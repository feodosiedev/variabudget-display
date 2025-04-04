import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBuildings, fetchCAFApplications } from "@/services/supabaseService";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { ArrowLeft, Building, CalendarCheck, ClipboardCheck, FileText, MapPin, Percent, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BuildingList from "@/components/BuildingList";

const RegionDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: buildings, isLoading: buildingsLoading } = useQuery({
    queryKey: ['buildings'],
    queryFn: fetchBuildings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: cafApplications, isLoading: cafsLoading } = useQuery({
    queryKey: ['cafApplications'],
    queryFn: fetchCAFApplications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = buildingsLoading || cafsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted" />
          <div className="text-lg">Loading region data from Supabase...</div>
        </div>
      </div>
    );
  }

  if (!buildings || !cafApplications || !id) {
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

  // Filter data for the current region
  const regionBuildings = buildings.filter(b => b.region.toLowerCase().replace(" ", "-") === id);
  const regionApplications = cafApplications.filter(a => a.region.toLowerCase().replace(" ", "-") === id);
  const regionName = id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  // Calculate region statistics
  const totalOriginalBudget = regionBuildings.reduce((sum, b) => sum + b.originalBudget, 0);
  const totalBudgetAfterPurchase = regionBuildings.reduce((sum, b) => sum + b.budgetAfterPurchase, 0);
  const totalRemainingBudget = totalOriginalBudget - totalBudgetAfterPurchase;
  const approvedApplications = regionApplications.filter(a => a.approvalStatus === "Approved").length;
  const approvalRate = regionApplications.length > 0 
    ? (approvedApplications / regionApplications.length) * 100 
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">{regionName}</h1>
          <p className="text-muted-foreground">Region overview and building details</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buildings</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{regionBuildings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{regionApplications.length}</div>
              <div className="flex items-center mt-1">
                <ClipboardCheck className="mr-1 h-4 w-4 text-primary" />
                <span className="text-sm">
                  {approvedApplications} approved
                  <Badge variant="outline" className="ml-2">
                    {approvalRate.toFixed(0)}%
                  </Badge>
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalOriginalBudget)}</div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(totalOriginalBudget - totalRemainingBudget)} remaining
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
                    {regionApplications.filter(a => a.frequency === "One-Time").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Recurring</span>
                  </div>
                  <span className="text-sm font-medium">
                    {regionApplications.filter(a => a.frequency === "Reoccurring").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buildings List */}
        <BuildingList 
          buildings={regionBuildings}
          cafApplications={regionApplications}
        />
      </main>
    </div>
  );
};

export default RegionDetail;
