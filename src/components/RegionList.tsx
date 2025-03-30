
import { Card, CardContent } from "@/components/ui/card";
import { Region } from "@/types/caf";
import { formatCurrency } from "@/utils/formatters";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Building, ChevronRight, FileText, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RegionListProps {
  regions: Region[];
}

const RegionList = ({ regions }: RegionListProps) => {
  return (
    <div className="space-y-4">
      {regions.map((region) => {
        const budgetRatio = region.totalBudgetAfterPurchase / region.totalOriginalBudget;
        const percentRemaining = budgetRatio * 100;
        
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
                        <Building className="h-3.5 w-3.5 mr-1" />
                        <span>{region.buildings.length} buildings</span>
                        <FileText className="h-3.5 w-3.5 ml-3 mr-1" />
                        <span>{region.cafApplications.length} applications</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Badge variant={region.approvalRate > 75 ? "default" : "secondary"} className="mr-2">
                      {region.approvalRate.toFixed(0)}% approved
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Budget</span>
                      <span className="text-sm">
                        {formatCurrency(region.totalBudgetAfterPurchase)} / {formatCurrency(region.totalOriginalBudget)}
                      </span>
                    </div>
                    <Progress 
                      value={percentRemaining > 100 ? 100 : percentRemaining} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Applications</span>
                      <span className="text-sm">
                        {region.approvedApplications} approved / {region.totalApplications} total
                      </span>
                    </div>
                    <Progress 
                      value={(region.approvedApplications / Math.max(1, region.totalApplications)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};

export default RegionList;
