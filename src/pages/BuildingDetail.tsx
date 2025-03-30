
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBuildingById, getCAFApplicationsForBuilding, updateCAFApplication } from "@/services/sharePointService";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { ArrowLeft, Building, Calendar, CalendarCheck, Edit, FileText, MapPin, Percent, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CAFApplicationList from "@/components/CAFApplicationList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BuildingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const { data: building, isLoading: buildingLoading, isError: buildingError } = useQuery({
    queryKey: ['building', id],
    queryFn: () => {
      if (!id) throw new Error("Building ID is required");
      return getBuildingById(id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: cafApplications, isLoading: cafsLoading, isError: cafsError } = useQuery({
    queryKey: ['buildingCAFs', building?.name],
    queryFn: () => {
      if (!building?.name) throw new Error("Building name is required");
      return getCAFApplicationsForBuilding(building.name);
    },
    enabled: !!building?.name,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateCAFMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => {
      return updateCAFApplication(id, data);
    },
    onSuccess: () => {
      toast.success("CAF application updated successfully");
      queryClient.invalidateQueries({ queryKey: ['buildingCAFs'] });
    },
    onError: (error) => {
      toast.error("Failed to update CAF application");
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
          <div className="text-lg">Loading building data from SharePoint...</div>
        </div>
      </div>
    );
  }

  if (isError || !building) {
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

  const handleUpdateAttendance = (cafId: string, attendanceCount: number) => {
    updateCAFMutation.mutate({
      id: cafId,
      data: { tenantsAttended: attendanceCount }
    });
  };

  // Calculate CAF statistics
  const totalCAFs = cafApplications?.length || 0;
  const approvedCAFs = cafApplications?.filter(caf => caf.approvalStatus === "Approved").length || 0;
  const approvalRate = totalCAFs > 0 ? (approvedCAFs / totalCAFs) * 100 : 0;
  const totalRequestedAmount = cafApplications?.reduce((sum, caf) => sum + caf.requestedAmount, 0) || 0;
  const totalPurchaseAmount = cafApplications?.reduce((sum, caf) => sum + caf.purchaseAmount, 0) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <div className="mb-6">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              {building.region} Region
            </Badge>
          </div>
          <h1 className="text-3xl font-bold flex items-center mt-1">
            <Building className="h-6 w-6 mr-2 text-primary" />
            {building.name}
          </h1>
          <p className="text-muted-foreground">{building.address}</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(building.originalBudget)}</div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">Original budget</p>
                <Badge variant="outline">
                  {formatCurrency(building.budgetAfterPurchase)} remaining
                </Badge>
              </div>
              <Progress 
                value={(building.budgetAfterPurchase / building.originalBudget) * 100} 
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
              <div className="text-2xl font-bold">{totalCAFs}</div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">Total applications</p>
                <Badge variant="outline" className="bg-primary/10">
                  {approvedCAFs} approved ({approvalRate.toFixed(0)}%)
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
              <CardTitle className="text-sm font-medium">Spending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPurchaseAmount)}</div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">Total purchases</p>
                <Badge variant="outline">
                  vs {formatCurrency(totalRequestedAmount)} requested
                </Badge>
              </div>
              <Progress 
                value={(totalPurchaseAmount / totalRequestedAmount) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            CAF Applications
          </h2>
          {cafApplications && cafApplications.length > 0 ? (
            <CAFApplicationList 
              cafApplications={cafApplications} 
              onUpdateAttendance={handleUpdateAttendance}
              isUpdating={updateCAFMutation.isPending}
            />
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                No CAF applications found for this building.
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuildingDetail;
