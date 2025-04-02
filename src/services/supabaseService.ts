
import { supabase } from "@/integrations/supabase/client";
import { Building, CAFApplication, CAFStatistics } from "@/types/caf";

// Fetch all buildings
export const fetchBuildings = async (): Promise<Building[]> => {
  const { data, error } = await supabase
    .from('buildings')
    .select('*');

  if (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }

  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    address: item.address,
    region: item.region,
    originalBudget: Number(item.original_budget),
    budgetAfterPurchase: Number(item.budget_after_purchase)
  }));
};

// Fetch a single building by ID
export const fetchBuildingById = async (id: string): Promise<Building | null> => {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Building not found
    }
    console.error('Error fetching building:', error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    address: data.address,
    region: data.region,
    originalBudget: Number(data.original_budget),
    budgetAfterPurchase: Number(data.budget_after_purchase)
  };
};

// Fetch all CAF applications
export const fetchCAFApplications = async (): Promise<CAFApplication[]> => {
  const { data, error } = await supabase
    .from('caf_applications')
    .select('*');

  if (error) {
    console.error('Error fetching CAF applications:', error);
    throw error;
  }

  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    title: item.title,
    building: item.building,
    region: item.region,
    requestedAmount: Number(item.requested_amount),
    purchaseAmount: Number(item.purchase_amount),
    approvalStatus: validateApprovalStatus(item.approval_status),
    eventType: item.event_type,
    tenantsAttended: item.tenants_attended,
    pdfLink: item.pdf_link,
    requiresUpdates: item.requires_updates,
    frequency: item.frequency,
    category: item.category,
    scheduledDay: item.scheduled_day,
    recurrenceCount: item.recurrence_count,
    firstDate: item.first_date,
    applicantName: item.applicant_name,
    daysOfWeek: item.days_of_week,
    otherFrequency: item.other_frequency,
    typeOfFrequency: item.type_of_frequency
  }));
};

// Fetch CAF applications for a specific building
export const fetchCAFApplicationsByBuilding = async (buildingAddress: string): Promise<CAFApplication[]> => {
  const { data, error } = await supabase
    .from('caf_applications')
    .select('*')
    .eq('building', buildingAddress);

  if (error) {
    console.error('Error fetching CAF applications for building:', error);
    throw error;
  }

  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    title: item.title,
    building: item.building,
    region: item.region,
    requestedAmount: Number(item.requested_amount),
    purchaseAmount: Number(item.purchase_amount),
    approvalStatus: validateApprovalStatus(item.approval_status),
    eventType: item.event_type,
    tenantsAttended: item.tenants_attended,
    pdfLink: item.pdf_link,
    requiresUpdates: item.requires_updates,
    frequency: item.frequency,
    category: item.category,
    scheduledDay: item.scheduled_day,
    recurrenceCount: item.recurrence_count,
    firstDate: item.first_date,
    applicantName: item.applicant_name,
    daysOfWeek: item.days_of_week,
    otherFrequency: item.other_frequency,
    typeOfFrequency: item.type_of_frequency
  }));
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
