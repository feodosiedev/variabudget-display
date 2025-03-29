
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Region } from "@/types/budget";
import { formatCurrency } from "@/utils/formatters";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Building, MapPin } from "lucide-react";

interface RegionListProps {
  regions: Region[];
}

const RegionList = ({ regions }: RegionListProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Regions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {regions.map((region) => {
            const percentSpent = (region.totalActual / region.totalBudgeted) * 100;
            const isOverBudget = region.totalActual > region.totalBudgeted;
            
            return (
              <Link 
                key={region.id}
                to={`/region/${region.id}`} 
                className="block"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="mr-2 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{region.name}</span>
                    <span className="ml-2 text-muted-foreground text-sm">
                      ({region.buildings.length} buildings)
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className={isOverBudget ? 'text-destructive' : ''}>
                      {formatCurrency(region.totalActual)}
                    </span>
                    <span className="text-muted-foreground"> / {formatCurrency(region.totalBudgeted)}</span>
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

export default RegionList;
