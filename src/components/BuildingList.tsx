
import { Card, CardContent } from "@/components/ui/card";
import { Building, CAFApplication } from "@/types/caf";
import { formatCurrency } from "@/utils/formatters";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Building as BuildingIcon, ChevronRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BuildingListProps {
  buildings: Building[];
  cafApplications: CAFApplication[];
}

const BuildingList = ({ buildings, cafApplications }: BuildingListProps) => {
  // Group CAF applications by building
  const cafsByBuilding = cafApplications.reduce((acc, caf) => {
    if (!acc[caf.building]) {
      acc[caf.building] = [];
    }
    acc[caf.building].push(caf);
    return acc;
  }, {} as Record<string, CAFApplication[]>);

  return (
    <div className="space-y-4">
      {buildings.map((building) => {
        const buildingCAFs = cafsByBuilding[building.name] || [];
        const approvedCAFs = buildingCAFs.filter(caf => caf.approvalStatus === "Approved");
        const approvalRate = buildingCAFs.length > 0 
          ? (approvedCAFs.length / buildingCAFs.length) * 100 
          : 0;
        
        const budgetRatio = building.budgetAfterPurchase / building.originalBudget;
        const percentRemaining = budgetRatio * 100;
        
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
                      <h3 className="text-lg font-semibold">{building.name}</h3>
                      <p className="text-sm text-muted-foreground">{building.address}</p>
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
                        {formatCurrency(building.budgetAfterPurchase)} / {formatCurrency(building.originalBudget)}
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
      })}
    </div>
  );
};

export default BuildingList;
