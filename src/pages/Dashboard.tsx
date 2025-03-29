
import { useEffect, useState } from "react";
import { BudgetSummary } from "@/types/budget";
import { getBudgetSummary } from "@/data/budgetData";
import BudgetSummaryCard from "@/components/BudgetSummaryCard";
import RegionList from "@/components/RegionList";
import Header from "@/components/Header";

const Dashboard = () => {
  const [budgetData, setBudgetData] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // Small delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = getBudgetSummary();
        setBudgetData(data);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading budget data...</div>
      </div>
    );
  }

  if (!budgetData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Error loading budget data.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Budget Dashboard</h1>
          <p className="text-muted-foreground">Regional Building Overview</p>
        </div>
        
        <BudgetSummaryCard summary={budgetData} />
        
        <div className="mt-6">
          <RegionList regions={budgetData.regions} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
