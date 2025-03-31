
import { CAFStatistics } from '@/types/caf';
import * as XLSX from 'xlsx';

export async function processExcelFile(): Promise<Uint8Array | null> {
  try {
    const response = await fetch('/src/files/CAF Master Tracker.xlsx');
    return new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    console.error('Error loading Excel file:', error);
    return null;
  }
}

export async function processExcelData(): Promise<CAFStatistics> {
  try {
    // Load the Excel file
    const excelData = await processExcelFile();
    
    if (!excelData) {
      throw new Error('Failed to load Excel file');
    }

    // Parse the Excel data
    const workbook = XLSX.read(excelData);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Initialize statistics
    const cafTypes = new Map<string, number>();
    const regions = new Map<string, number>();
    const buildings = new Map<string, number>();
    const eventTypes = {
      oneTime: 0,
      recurring: 0,
      tenantLed: 0
    };

    // Get sample row to find column names
    if (data.length === 0) {
      throw new Error('Excel file has no data');
    }

    const sampleRow = data[0] as any;
    const cafTypeColumn = findColumnName(sampleRow, ['CAF Type', 'CAF_Type', 'Type']);
    const regionColumn = findColumnName(sampleRow, ['Region', 'region', 'REGION', 'Location']);
    const buildingColumn = findColumnName(sampleRow, ['Building', 'building', 'BUILDING', 'Property', 'Address']);
    const frequencyColumn = findColumnName(sampleRow, ['Frequency', 'Event Frequency', 'Frequency of Use', 'Event Type']);

    // Process each row
    data.forEach((row: any) => {
      // Process CAF Types
      if (cafTypeColumn && row[cafTypeColumn]) {
        const cafType = String(row[cafTypeColumn]).trim();
        if (cafType) {
          cafTypes.set(cafType, (cafTypes.get(cafType) || 0) + 1);
        }
      }

      // Process Regions
      if (regionColumn && row[regionColumn]) {
        const region = String(row[regionColumn]).trim();
        if (region) {
          regions.set(region, (regions.get(region) || 0) + 1);
        }
      }

      // Process Buildings
      if (buildingColumn && row[buildingColumn]) {
        const building = String(row[buildingColumn]).trim();
        if (building) {
          buildings.set(building, (buildings.get(building) || 0) + 1);
        }
      }

      // Process Event Types
      if (frequencyColumn && row[frequencyColumn]) {
        const frequency = String(row[frequencyColumn]).toLowerCase().trim();
        if (frequency.includes('one-time') || frequency.includes('one time')) {
          eventTypes.oneTime++;
        } else if (frequency.includes('recurring') || frequency.includes('reoccurring') || frequency.includes('repeat')) {
          eventTypes.recurring++;
        } else if (frequency.includes('tenant-led') || frequency.includes('tenant led')) {
          eventTypes.tenantLed++;
        }
      }
    });

    // Return the statistics
    return {
      totalApplications: data.length,
      cafTypes,
      eventTypes,
      regions,
      buildings
    };
  } catch (error) {
    console.error('Error processing Excel data:', error);
    // Return default data if there's an error
    return {
      totalApplications: 0,
      cafTypes: new Map<string, number>(),
      eventTypes: {
        oneTime: 0,
        recurring: 0,
        tenantLed: 0
      },
      regions: new Map<string, number>(),
      buildings: new Map<string, number>()
    };
  }
}

// Helper function to find the column name from possible alternatives
function findColumnName(sampleRow: any, possibleNames: string[]): string | null {
  const keys = Object.keys(sampleRow);
  for (const name of possibleNames) {
    const match = keys.find(key =>
      key.toLowerCase() === name.toLowerCase() ||
      key.toLowerCase().includes(name.toLowerCase())
    );
    if (match) return match;
  }
  return null;
}
