import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRegionById, getCAFApplicationsForBuilding } from "@/services/sharePointService";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { ArrowLeft, Building, CalendarCheck, FileText, MapPin, Percent, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BuildingList from "@/components/BuildingList";

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
        <div className="animate-pulse text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted" />
          <div className="text-lg">Loading region data from SharePoint...</div>
        </div>
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

  // Calculate event types count
  const oneTimeEvents = region.cafApplications.filter(caf => caf.eventType === "One-time").length;
  const recurringEvents = region.cafApplications.filter(caf => caf.eventType === "Recurring").length;
  const tenantLedEvents = region.cafApplications.filter(caf => caf.eventType === "Tenant-led").length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-primary" />
            {region.name} Region
          </h1>
          <p className="text-muted-foreground">CAF applications and budget summary</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(region.totalOriginalBudget)}</div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">Original Budget</p>
                <Badge variant="outline">
                  {formatCurrency(region.totalRemainingBudget)} remaining
                </Badge>
              </div>
              <Progress
                value={(region.totalRemainingBudget / region.totalOriginalBudget) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CAF Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{region.totalApplications}</div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">Total applications</p>
                <Badge variant="outline" className="bg-primary/10">
                  {region.approvedApplications} approved ({region.approvalRate.toFixed(0)}%)
                </Badge>
              </div>
              <Progress
                value={region.approvalRate}
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
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="flex flex-col items-center p-2 bg-muted/30 rounded">
                  <span className="text-lg font-semibold">{oneTimeEvents}</span>
                  <span className="text-xs text-muted-foreground">One-time</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/30 rounded">
                  <span className="text-lg font-semibold">{recurringEvents}</span>
                  <span className="text-xs text-muted-foreground">Recurring</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/30 rounded">
                  <span className="text-lg font-semibold">{tenantLedEvents}</span>
                  <span className="text-xs text-muted-foreground">Tenant-led</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Buildings ({region.buildings.length})
          </h2>
          <BuildingList buildings={region.buildings} cafApplications={region.cafApplications} />
        </div>
      </main>
    </div>
  );
};

export default RegionDetail;
