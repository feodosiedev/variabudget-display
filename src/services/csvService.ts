import * as XLSX from 'xlsx';
import { CAFStatistics } from '@/types/caf';

// Path to the Excel file relative to the public directory
const EXCEL_FILE_PATH = '/src/files/CAF Master Tracker.xlsx';

export async function processExcelData(): Promise<CAFStatistics> {
  try {
    // Fetch the Excel file
    const response = await fetch(EXCEL_FILE_PATH);
    const arrayBuffer = await response.arrayBuffer();

    // Read the Excel file
    const workbook = XLSX.read(arrayBuffer);

    // Assuming the first sheet contains our data
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Initialize statistics
    const statistics: CAFStatistics = {
      totalApplications: data.length,
      cafTypes: new Map(),
      eventTypes: {
        oneTime: 0,
        recurring: 0,
        tenantLed: 0
      },
      regions: new Map(),
      buildings: new Map()
    };

    // Process each row
    data.forEach((row: any) => {
      // Process CAF Types
      const cafType = row['CAF Type'];
      if (cafType) {
        statistics.cafTypes.set(
          cafType,
          (statistics.cafTypes.get(cafType) || 0) + 1
        );
      }

      // Process Event Types
      const frequency = String(row['Frequency of Event'] || '').toLowerCase();
      if (frequency) {
        if (frequency.includes('one-time')) {
          statistics.eventTypes.oneTime++;
        } else if (frequency.includes('recurring')) {
          statistics.eventTypes.recurring++;
        } else if (frequency.includes('tenant-led')) {
          statistics.eventTypes.tenantLed++;
        }
      }

      // Process Regions
      const region = row['Region'];
      if (region) {
        statistics.regions.set(
          region,
          (statistics.regions.get(region) || 0) + 1
        );
      }

      // Process Buildings
      const building = row['Building'];
      if (building) {
        statistics.buildings.set(
          building,
          (statistics.buildings.get(building) || 0) + 1
        );
      }
    });

    return statistics;
  } catch (error) {
    console.error('Error processing Excel data:', error);
    throw error;
  }
}