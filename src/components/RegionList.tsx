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
                        <Building className="h-3.5 w-3.5 mr-1" />
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
      })}
    </div>
  );
};

export default RegionList;
