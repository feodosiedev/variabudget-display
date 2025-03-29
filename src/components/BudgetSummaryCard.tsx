
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetSummary } from "@/types/budget";
import { formatCurrency } from "@/utils/formatters";

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
}

const BudgetSummaryCard = ({ summary }: BudgetSummaryCardProps) => {
  const isOverBudget = summary.variance < 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalBudgeted)}</div>
          <p className="text-xs text-muted-foreground">
            Planned spending across all regions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Actual Spend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalActual)}</div>
          <p className="text-xs text-muted-foreground">
            Current spending to date
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-secondary'}`}>
            {formatCurrency(summary.variance)}
          </div>
          <p className="text-xs text-muted-foreground">
            {isOverBudget 
              ? `Over budget by ${Math.abs(summary.variancePercentage).toFixed(1)}%`
              : `Under budget by ${summary.variancePercentage.toFixed(1)}%`
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummaryCard;
