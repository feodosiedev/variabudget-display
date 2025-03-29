
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetCategory } from "@/types/budget";
import { formatCurrency } from "@/utils/formatters";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Home, Car, Utensils, Zap, Tv, Activity, ShoppingBag, Smile
} from "lucide-react";

interface BudgetCategoryListProps {
  categories: BudgetCategory[];
}

const getCategoryIcon = (icon: string) => {
  switch (icon) {
    case "home": return <Home className="h-5 w-5" />;
    case "car": return <Car className="h-5 w-5" />;
    case "utensils": return <Utensils className="h-5 w-5" />;
    case "zap": return <Zap className="h-5 w-5" />;
    case "tv": return <Tv className="h-5 w-5" />;
    case "activity": return <Activity className="h-5 w-5" />;
    case "shopping-bag": return <ShoppingBag className="h-5 w-5" />;
    case "smile": return <Smile className="h-5 w-5" />;
    default: return null;
  }
};

const BudgetCategoryList = ({ categories }: BudgetCategoryListProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Budget Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => {
            const percentSpent = (category.actual / category.budgeted) * 100;
            const isOverBudget = category.actual > category.budgeted;
            
            return (
              <Link 
                key={category.id}
                to={`/category/${category.id}`} 
                className="block"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="mr-2 text-muted-foreground">
                      {category.icon && getCategoryIcon(category.icon)}
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className={isOverBudget ? 'text-destructive' : ''}>
                      {formatCurrency(category.actual)}
                    </span>
                    <span className="text-muted-foreground"> / {formatCurrency(category.budgeted)}</span>
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

export default BudgetCategoryList;
