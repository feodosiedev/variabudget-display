
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "@/types/budget";
import { formatCurrency } from "@/utils/formatters";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Building as BuildingIcon } from "lucide-react";

interface BuildingListProps {
  buildings: Building[];
  regionId: string;
}

const BuildingList = ({ buildings, regionId }: BuildingListProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Buildings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {buildings.map((building) => {
            const percentSpent = (building.actual / building.budgeted) * 100;
            const isOverBudget = building.actual > building.budgeted;
            
            return (
              <Link 
                key={building.id}
                to={`/region/${regionId}/building/${building.id}`} 
                className="block"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="mr-2 text-muted-foreground">
                      <BuildingIcon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{building.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className={isOverBudget ? 'text-destructive' : ''}>
                      {formatCurrency(building.actual)}
                    </span>
                    <span className="text-muted-foreground"> / {formatCurrency(building.budgeted)}</span>
                  </div>
                </div>
                <Progress 
                  value={percentSpent > 100 ? 100 : percentSpent} 
                  className={`h-2 ${isOverBudget ? 'bg-destructive/20' : 'bg-secondary/20'}`}
                />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingList;
