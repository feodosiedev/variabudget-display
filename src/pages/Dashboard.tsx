
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BudgetSummary } from "@/types/budget";
import { getBudgetSummary } from "@/services/sharePointService";
import BudgetSummaryCard from "@/components/BudgetSummaryCard";
import RegionList from "@/components/RegionList";
import Header from "@/components/Header";

const Dashboard = () => {
  const { data: budgetData, isLoading, isError } = useQuery({
    queryKey: ['budgetSummary'],
    queryFn: getBudgetSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading budget data from SharePoint...</div>
      </div>
    );
  }

  if (isError || !budgetData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">
          Error loading budget data from SharePoint. Please make sure you are logged into your Microsoft 365 account.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Budget Dashboard</h1>
          <p className="text-muted-foreground">Showing data from SharePoint</p>
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
