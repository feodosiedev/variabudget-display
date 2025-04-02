
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Building, CAFApplication, Region } from "@/types/caf";
import { formatCurrency } from "@/utils/formatters";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Building as BuildingIcon, ChevronRight, FileText, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchBuildings, fetchCAFApplications } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";

interface RegionListProps {
  initialRegions?: Region[];
  regions?: Region[]; // Add this for Dashboard component compatibility
}

const RegionList = ({ initialRegions, regions }: RegionListProps) => {
  const [localRegions, setLocalRegions] = useState<Region[]>(initialRegions || regions || []);
  const [isLoading, setIsLoading] = useState(!initialRegions && !regions);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialRegions || regions) {
      setLocalRegions(initialRegions || regions || []);
      return; // Use provided regions data if available
    }

    const loadRegionsData = async () => {
      try {
        setIsLoading(true);
        // Fetch both buildings and CAF applications
        const [buildings, cafApplications] = await Promise.all([
          fetchBuildings(),
          fetchCAFApplications()
        ]);

        // Group buildings by region
        const regionMap = new Map<string, Building[]>();
        buildings.forEach(building => {
          if (!regionMap.has(building.region)) {
            regionMap.set(building.region, []);
          }
          regionMap.get(building.region)?.push(building);
        });

        // Create region objects
        const regionData: Region[] = Array.from(regionMap.entries()).map(([name, regionBuildings]) => {
          // Get all CAF applications for this region
          const regionApps = cafApplications.filter(app => app.region === name);
          const approvedApps = regionApps.filter(app => app.approvalStatus === "Approved");
          
          // Calculate total budgets
          const totalOriginalBudget = regionBuildings.reduce((sum, building) => sum + building.originalBudget, 0);
          const totalBudgetAfterPurchase = regionBuildings.reduce((sum, building) => sum + building.budgetAfterPurchase, 0);
          const totalRemainingBudget = totalOriginalBudget - totalBudgetAfterPurchase;
          
          return {
            id: name.toLowerCase().replace(/\s+/g, '-'), // Create an ID from the region name
            name,
            buildings: regionBuildings,
            cafApplications: regionApps,
            totalApplications: regionApps.length,
            approvedApplications: approvedApps.length,
            approvalRate: regionApps.length > 0 ? (approvedApps.length / regionApps.length) * 100 : 0,
            totalOriginalBudget,
            totalBudgetAfterPurchase,
            totalRemainingBudget
          };
        });

        setLocalRegions(regionData);
      } catch (err) {
        console.error("Error loading regions data:", err);
        setError("Failed to load regions data from Supabase");
        toast({
          title: "Error",
          description: "Failed to load regions data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRegionsData();
  }, [initialRegions, regions, toast]);

  if (isLoading) {
    return <div className="text-center p-4">Loading regions data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {localRegions.length === 0 ? (
        <div className="text-center p-4">No regions found</div>
      ) : (
        localRegions.map((region) => {
          // Handle case when totalOriginalBudget is zero
          const originalBudget = region.totalOriginalBudget || 100000;
          const budgetAfterPurchase = region.totalBudgetAfterPurchase || 80000;

          // Calculate remaining budget
          const remainingBudget = originalBudget - budgetAfterPurchase;

          // Calculate budget percentage with safety checks
          const percentRemaining = originalBudget > 0 ?
            Math.min(100, Math.max(0, (remainingBudget / originalBudget) * 100)) : 80;

          // Safety for application counts
          const totalApps = Math.max(1, region.totalApplications);
          const approvedApps = Math.min(totalApps, region.approvedApplications);
          const approvalRate = Math.min(100, Math.max(0, region.approvalRate));

          return (
            <Card key={region.id} className="overflow-hidden">
              <Link to={`/region/${region.id}`} className="block">
                <div className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="mr-3 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{region.name} Region</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BuildingIcon className="h-3.5 w-3.5 mr-1" />
                          <span>{region.buildings.length} buildings</span>
                          <FileText className="h-3.5 w-3.5 ml-3 mr-1" />
                          <span>{totalApps} applications</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Badge variant={approvalRate > 75 ? "default" : "secondary"} className="mr-2">
                        {approvalRate.toFixed(0)}% approved
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Budget</span>
                        <span className="text-sm">
                          {formatCurrency(remainingBudget)} / {formatCurrency(originalBudget)}
                        </span>
                      </div>
                      <Progress
                        value={percentRemaining}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Applications</span>
                        <span className="text-sm">
                          {approvedApps} approved / {totalApps} total
                        </span>
                      </div>
                      <Progress
                        value={(approvedApps / totalApps) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default RegionList;
