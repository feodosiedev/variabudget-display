
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getCafApplicationMetrics } from "@/services/sharePointService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CafMetricsCard = () => {
  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['cafMetrics'],
    queryFn: getCafApplicationMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4 animate-pulse">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
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

  // Calculate approval percentage
  const approvalPercentage = metrics.totalApplications > 0
    ? ((metrics.approvedApplications / metrics.totalApplications) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid gap-4 md:grid-cols-4">
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
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">{approvalPercentage}%</div>
            <Badge variant="secondary">
              {metrics.approvedApplications} of {metrics.totalApplications}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Percentage of approved applications
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
