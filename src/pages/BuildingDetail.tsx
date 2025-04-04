import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchBuildingById, fetchCAFApplicationsByBuilding } from "@/services/supabaseService";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { ArrowLeft, Building, CalendarCheck, FileText, MapPin, Percent, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const BuildingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: building, isLoading: buildingLoading, isError: buildingError } = useQuery({
    queryKey: ['building', id],
    queryFn: () => {
      if (!id) throw new Error("Building ID is required");
      return fetchBuildingById(id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: cafApplications, isLoading: cafsLoading, isError: cafsError } = useQuery({
    queryKey: ['buildingCAFs', building?.address],
    queryFn: () => {
      if (!building?.address) throw new Error("Building address is required");
      return fetchCAFApplicationsByBuilding(building.address);
    },
    enabled: !!building?.address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateCAFMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { error } = await supabase
        .from('caf_applications')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "CAF application updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['buildingCAFs'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update CAF application",
        variant: "destructive",
      });
      console.error("Update error:", error);
    }
  });

  const isLoading = buildingLoading || cafsLoading;
  const isError = buildingError || cafsError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Building className="h-12 w-12 mx-auto mb-4 text-muted" />
          <div className="text-lg">Loading building data from Supabase...</div>
        </div>
      </div>
    );
  }

  if (isError || !building || !cafApplications) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="text-destructive">Building not found or error loading data.</div>
        </main>
      </div>
    );
  }

  // Calculate building statistics
  const approvedApplications = cafApplications.filter(a => a.approvalStatus === "Approved").length;
  const approvalRate = cafApplications.length > 0 
    ? (approvedApplications / cafApplications.length) * 100 
    : 0;
  const remainingBudget = building.originalBudget - building.budgetAfterPurchase;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Building className="h-6 w-6 mr-2 text-primary" />
            {building.address}
          </h1>
          <p className="text-muted-foreground">CAF applications and budget summary</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(building.originalBudget)}</div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">Original Budget</p>
                <Badge variant="outline">
                  {formatCurrency(remainingBudget)} remaining
                </Badge>
              </div>
              <Progress
                value={(remainingBudget / building.originalBudget) * 100}
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
              <div className="text-2xl font-bold">{cafApplications.length}</div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">Total applications</p>
                <Badge variant="outline" className="bg-primary/10">
                  {approvedApplications} approved ({approvalRate.toFixed(0)}%)
                </Badge>
              </div>
              <Progress
                value={approvalRate}
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
                  <span className="text-lg font-semibold">
                    {cafApplications.filter(caf => caf.frequency === "One-Time").length}
                  </span>
                  <span className="text-xs text-muted-foreground">One-time</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/30 rounded">
                  <span className="text-lg font-semibold">
                    {cafApplications.filter(caf => caf.frequency === "Reoccurring").length}
                  </span>
                  <span className="text-xs text-muted-foreground">Recurring</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/30 rounded">
                  <span className="text-lg font-semibold">
                    {cafApplications.filter(caf => caf.eventType === "Social").length}
                  </span>
                  <span className="text-xs text-muted-foreground">Social</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CAF Applications Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            CAF Applications ({cafApplications.length})
          </h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cafApplications.map((caf) => (
                    <TableRow key={caf.id}>
                      <TableCell className="font-medium">{caf.title}</TableCell>
                      <TableCell>{caf.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            caf.approvalStatus === "Approved"
                              ? "default"
                              : caf.approvalStatus === "Pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {caf.approvalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(caf.requestedAmount)}</TableCell>
                      <TableCell>{caf.frequency}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => {
                            // Handle view/edit action
                            console.log("View/Edit CAF:", caf.id);
                          }}
                          className="text-primary hover:text-primary/80"
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BuildingDetail;
