
import { supabase } from "@/integrations/supabase/client";
import { Building, CAFApplication, CAFStatistics } from "@/types/caf";

// Fetch all buildings
export const fetchBuildings = async (): Promise<Building[]> => {
  try {
    console.log('Fetching buildings from Supabase...');
    const { data, error } = await supabase
      .from('buildings')
      .select('*');

    if (error) {
      console.error('Error fetching buildings:', error);
      throw error;
    }

    if (!data) {
      console.warn('No building data returned from Supabase');
      return [];
    }

    console.log(`Successfully fetched ${data.length} buildings`);
    
    return data.map(item => ({
      id: item.id,
      address: item.address,
      region: item.region,
      originalBudget: Number(item.original_budget),
      budgetAfterPurchase: Number(item.budget_after_purchase),
      status: undefined
    }));
  } catch (err) {
    console.error('Exception in fetchBuildings:', err);
    throw err;
  }
};

// Fetch a single building by ID
export const fetchBuildingById = async (id: string): Promise<Building | null> => {
  try {
    console.log(`Fetching building with ID: ${id}`);
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`Building with ID ${id} not found`);
        return null; // Building not found
      }
      console.error('Error fetching building:', error);
      throw error;
    }

    if (!data) {
      console.warn(`No data returned for building ID ${id}`);
      return null;
    }

    console.log('Successfully fetched building details');
    
    return {
      id: data.id,
      address: data.address,
      region: data.region,
      originalBudget: Number(data.original_budget),
      budgetAfterPurchase: Number(data.budget_after_purchase),
      status: undefined
    };
  } catch (err) {
    console.error(`Exception in fetchBuildingById for ID ${id}:`, err);
    throw err;
  }
};

// Fetch all CAF applications
export const fetchCAFApplications = async (): Promise<CAFApplication[]> => {
  try {
    console.log('Fetching CAF applications from Supabase...');
    const { data, error } = await supabase
      .from('caf_applications')
      .select('*');

    if (error) {
      console.error('Error fetching CAF applications:', error);
      throw error;
    }

    if (!data) {
      console.warn('No CAF applications data returned from Supabase');
      return [];
    }

    console.log(`Successfully fetched ${data.length} CAF applications`);
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      building: item.building,
      region: item.region,
      requestedAmount: Number(item.requested_amount),
      purchaseAmount: Number(item.purchase_amount),
      approvalStatus: validateApprovalStatus(item.approval_status),
      eventType: item.event_type,
      pdfLink: item.pdf_link,
      requiresUpdates: item.requires_updates,
      frequency: validateFrequency(item.frequency),
      category: item.category,
      firstDate: item.first_date,
      applicantName: item.applicant_name,
      daysOfWeek: item.days_of_week,
      typeOfFrequency: item.type_of_frequency,
      receivedDate: undefined,
      approverName: undefined,
      approvalDate: undefined,
      purchaserComment: undefined,
      cafDescription: undefined,
      tenantsAttended: 0 // Default value for tenantsAttended
    }));
  } catch (err) {
    console.error('Exception in fetchCAFApplications:', err);
    throw err;
  }
};

// Fetch CAF applications for a specific building
export const fetchCAFApplicationsByBuilding = async (buildingAddress: string): Promise<CAFApplication[]> => {
  try {
    console.log(`Fetching CAF applications for building: ${buildingAddress}`);
    const { data, error } = await supabase
      .from('caf_applications')
      .select('*')
      .eq('building', buildingAddress);

    if (error) {
      console.error('Error fetching CAF applications for building:', error);
      throw error;
    }

    if (!data) {
      console.warn(`No CAF applications data returned for building: ${buildingAddress}`);
      return [];
    }

    console.log(`Successfully fetched ${data.length} CAF applications for building: ${buildingAddress}`);
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      building: item.building,
      region: item.region,
      requestedAmount: Number(item.requested_amount),
      purchaseAmount: Number(item.purchase_amount),
      approvalStatus: validateApprovalStatus(item.approval_status),
      eventType: item.event_type,
      pdfLink: item.pdf_link,
      requiresUpdates: item.requires_updates,
      frequency: validateFrequency(item.frequency),
      category: item.category,
      firstDate: item.first_date,
      applicantName: item.applicant_name,
      daysOfWeek: item.days_of_week,
      typeOfFrequency: item.type_of_frequency,
      receivedDate: undefined,
      approverName: undefined,
      approvalDate: undefined,
      purchaserComment: undefined,
      cafDescription: undefined,
      tenantsAttended: 0 // Default value for tenantsAttended
    }));
  } catch (err) {
    console.error(`Exception in fetchCAFApplicationsByBuilding for building ${buildingAddress}:`, err);
    throw err;
  }
};

// Helper function to validate approval status to match the expected union type
function validateApprovalStatus(status: string): "Approved" | "Pending" | "Rejected" {
  if (status === "Approved" || status === "Pending" || status === "Rejected") {
    return status as "Approved" | "Pending" | "Rejected";
  }
  // Default to "Pending" if an invalid status is provided
  console.warn(`Invalid approval status: ${status}, defaulting to "Pending"`);
  return "Pending";
}

// Helper function to validate frequency to match the expected union type
function validateFrequency(frequency: string): "One-Time" | "Reoccurring" {
  // Trim any extra whitespace
  const trimmedFrequency = frequency ? frequency.trim() : "One-Time";
  
  if (trimmedFrequency === "One-Time" || trimmedFrequency === "Reoccurring") {
    return trimmedFrequency as "One-Time" | "Reoccurring";
  }
  // Default to "One-Time" if an invalid frequency is provided
  console.warn(`Invalid frequency: "${frequency}", defaulting to "One-Time"`);
  return "One-Time";
}

// Calculate CAF Statistics from data
export const calculateCAFStatistics = (cafApplications: CAFApplication[]): CAFStatistics => {
  const totalApplications = cafApplications.length;
  
  // Collect unique CAF types
  const cafTypes = new Map<string, number>();
  const regions = new Map<string, number>();
  const buildings = new Map<string, number>();
  
  // Count event types
  const eventTypes = {
    oneTime: 0,
    recurring: 0,
    tenantLed: 0
  };
  
  cafApplications.forEach(app => {
    // Count CAF types
    const currentCount = cafTypes.get(app.category) || 0;
    cafTypes.set(app.category, currentCount + 1);
    
    // Count regions
    const regionCount = regions.get(app.region) || 0;
    regions.set(app.region, regionCount + 1);
    
    // Count buildings
    const buildingCount = buildings.get(app.building) || 0;
    buildings.set(app.building, buildingCount + 1);
    
    // Count event types
    if (app.eventType === 'One-Time') {
      eventTypes.oneTime += 1;
    } else if (app.eventType === 'Recurring') {
      eventTypes.recurring += 1;
    } else if (app.eventType === 'Tenant-Led') {
      eventTypes.tenantLed += 1;
    }
  });
  
  return {
    totalApplications,
    cafTypes,
    regions,
    buildings,
    eventTypes
  };
};
