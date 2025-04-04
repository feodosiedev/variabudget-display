
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Building, CAFApplication } from "@/types/caf";
import { formatCurrency } from "@/utils/formatters";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Building as BuildingIcon, ChevronRight, FileText } from "lucide-react";
import { fetchBuildings, fetchCAFApplications } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";

interface BuildingListProps {
  initialBuildings?: Building[];
  initialCafApplications?: CAFApplication[];
  buildings?: Building[]; // For RegionDetail component compatibility
  cafApplications?: CAFApplication[]; // For RegionDetail component compatibility
}

const BuildingList = ({ 
  initialBuildings, 
  initialCafApplications,
  buildings,
  cafApplications 
}: BuildingListProps) => {
  const [localBuildings, setLocalBuildings] = useState<Building[]>(
    initialBuildings || buildings || []
  );
  const [localCafApplications, setLocalCafApplications] = useState<CAFApplication[]>(
    initialCafApplications || cafApplications || []
  );
  const [isLoading, setIsLoading] = useState(
    !initialBuildings && !buildings || !initialCafApplications && !cafApplications
  );
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ((initialBuildings || buildings) && (initialCafApplications || cafApplications)) {
      setLocalBuildings(initialBuildings || buildings || []);
      setLocalCafApplications(initialCafApplications || cafApplications || []);
      return; // Use provided data if available
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching buildings and CAF applications from Supabase...');
        const [buildingsData, cafData] = await Promise.all([
          fetchBuildings(),
          fetchCAFApplications()
        ]);
        console.log(`Fetched ${buildingsData.length} buildings and ${cafData.length} CAF applications`);
        setLocalBuildings(buildingsData);
        setLocalCafApplications(cafData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data from Supabase");
        toast({
          title: "Error",
          description: "Failed to load buildings data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [initialBuildings, initialCafApplications, buildings, cafApplications, toast]);

  // Group CAF applications by building
  const cafsByBuilding = localCafApplications.reduce((acc, caf) => {
    if (!acc[caf.building]) {
      acc[caf.building] = [];
    }
    acc[caf.building].push(caf);
    return acc;
  }, {} as Record<string, CAFApplication[]>);

  if (isLoading) {
    return <div className="text-center p-4">Loading buildings data from Supabase...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {localBuildings.length === 0 ? (
        <div className="text-center p-4">No buildings found in Supabase</div>
      ) : (
        localBuildings.map((building) => {
          const buildingCAFs = cafsByBuilding[building.address] || [];
          const approvedCAFs = buildingCAFs.filter(caf => caf.approvalStatus === "Approved");
          const approvalRate = buildingCAFs.length > 0
            ? (approvedCAFs.length / buildingCAFs.length) * 100
            : 0;

          // Calculate remaining budget
          const remainingBudget = building.originalBudget - building.budgetAfterPurchase;
          const percentRemaining = (remainingBudget / building.originalBudget) * 100;

          return (
            <Card key={building.id} className="overflow-hidden">
              <Link to={`/building/${building.id}`} className="block">
                <div className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="mr-3 text-primary">
                        <BuildingIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{building.address}</h3>
                        <p className="text-sm text-muted-foreground">Building {building.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{buildingCAFs.length} CAFs</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Budget</span>
                        <span className="text-sm">
                          {formatCurrency(remainingBudget)} / {formatCurrency(building.originalBudget)}
                        </span>
                      </div>
                      <Progress
                        value={percentRemaining > 100 ? 100 : percentRemaining}
                        className="h-2"
                      />
                    </div>

                    {buildingCAFs.length > 0 && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">CAF Approval</span>
                          <span className="text-sm">
                            {approvedCAFs.length} / {buildingCAFs.length}
                          </span>
                        </div>
                        <Progress
                          value={approvalRate}
                          className="h-2"
                        />
                      </div>
                    )}
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

export default BuildingList;
