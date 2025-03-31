import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { CAFStatistics } from '@/types/caf';
import { processExcelData } from '@/services/csvService';

const CAFStatisticsComponent: React.FC = () => {
  const [statistics, setStatistics] = useState<CAFStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await processExcelData();
        setStatistics(data);
      } catch (err) {
        setError('Failed to process Excel file');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">CAF Applications Statistics</h2>
      </div>

      {error && (
        <div className="text-red-500 text-center p-4">{error}</div>
      )}

      {isLoading && (
        <div className="text-center p-4">Loading data from Excel file...</div>
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
            </CardContent>
          </Card>

          {/* Buildings */}
          <Card>
            <CardHeader>
              <CardTitle>Buildings</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </Grid>
      )}
    </div>
  );
};

export default CAFStatisticsComponent;