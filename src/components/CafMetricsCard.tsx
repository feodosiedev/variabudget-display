
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getCafApplicationMetrics } from "@/services/sharePointService";

const CafMetricsCard = () => {
  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['cafMetrics'],
    queryFn: getCafApplicationMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 animate-pulse">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-6 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="text-destructive">
        Error loading CAF application data from SharePoint.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total CAF Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalApplications}</div>
          <p className="text-xs text-muted-foreground">
            Total number of CAF applications received
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{metrics.approvedApplications}</div>
          <p className="text-xs text-muted-foreground">
            Number of applications approved
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{metrics.pendingApplications}</div>
          <p className="text-xs text-muted-foreground">
            Applications awaiting approval
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CafMetricsCard;
