import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { CAFStatistics } from '@/types/caf';
import { fetchCAFApplications, calculateCAFStatistics } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

const CAFStatisticsComponent: React.FC = () => {
  const [statistics, setStatistics] = useState<CAFStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching CAF applications for statistics...');
        
        // Wrap in setTimeout to ensure client-side execution only
        if (typeof window !== 'undefined') {
          const cafApplications = await fetchCAFApplications();
          console.log(`Fetched ${cafApplications.length} CAF applications for statistics`);
          
          if (cafApplications.length === 0) {
            console.warn("No CAF applications found for statistics");
            setError('No CAF applications found in the database');
            toast({
              title: 'Warning',
              description: 'No CAF applications data found',
              variant: 'default',
            });
            return;
          }

          const stats = calculateCAFStatistics(cafApplications);
          setStatistics(stats);
        }
      } catch (err) {
        console.error('Error in CAFStatisticsComponent:', err);
        setError('Failed to fetch data from Supabase');
        toast({
          title: 'Error',
          description: 'Failed to load CAF statistics data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Safeguard for server-side rendering
  if (typeof window === 'undefined') {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">CAF Applications Statistics</h2>
      </div>

      {error && (
        <div className="text-red-500 text-center p-4">{error}</div>
      )}

      {isLoading && (
        <div className="text-center p-4">Loading data from Supabase...</div>
      )}

      {statistics && (
        <Grid className="gap-4 p-4">
          {/* Total Applications */}
          <Card>
            <CardHeader>
              <CardTitle>CAF Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{statistics.totalApplications}</p>
              <p className="text-sm text-muted-foreground">
                Unique CAF Types: {statistics.cafTypes.size}
              </p>
            </CardContent>
          </Card>

          {/* CAF Types */}
          <Card>
            <CardHeader>
              <CardTitle>CAF Types</CardTitle>
            </CardHeader>
            <CardContent>
              {statistics.cafTypes.size > 0 ? (
                <ul className="space-y-1">
                  {Array.from(statistics.cafTypes.entries())
                    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                    .map(([type, count]) => (
                      <li key={type} className="flex justify-between">
                        <span>{type}</span>
                        <span className="font-semibold">{count}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No CAF types available</p>
              )}
            </CardContent>
          </Card>

          {/* Event Types */}
          <Card>
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>One-time:</span>
                  <span className="font-semibold">{statistics.eventTypes.oneTime}</span>
                </li>
                <li className="flex justify-between">
                  <span>Recurring:</span>
                  <span className="font-semibold">{statistics.eventTypes.recurring}</span>
                </li>
                <li className="flex justify-between">
                  <span>Tenant-led:</span>
                  <span className="font-semibold">{statistics.eventTypes.tenantLed}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Regions */}
          <Card>
            <CardHeader>
              <CardTitle>Regions</CardTitle>
            </CardHeader>
            <CardContent>
              {statistics.regions.size > 0 ? (
                <ul className="space-y-1">
                  {Array.from(statistics.regions.entries())
                    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                    .map(([region, count]) => (
                      <li key={region} className="flex justify-between">
                        <span>{region}</span>
                        <span className="font-semibold">{count}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No region data available</p>
              )}
            </CardContent>
          </Card>

          {/* Buildings */}
          <Card>
            <CardHeader>
              <CardTitle>Buildings</CardTitle>
            </CardHeader>
            <CardContent>
              {statistics.buildings.size > 0 ? (
                <ul className="space-y-1 max-h-[250px] overflow-y-auto">
                  {Array.from(statistics.buildings.entries())
                    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                    .map(([building, count]) => (
                      <li key={building} className="flex justify-between">
                        <span>{building}</span>
                        <span className="font-semibold">{count}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No building data available</p>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
    </div>
  );
};

export default CAFStatisticsComponent;
