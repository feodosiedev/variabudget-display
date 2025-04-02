
// SharePoint Configuration
// NOTE: This configuration is now used only as reference for Power Automate
// The application now uses Supabase for data storage and retrieval

export const SharePointConfig = {
  // Replace with your actual SharePoint site URL
  siteUrl: "https://your-sharepoint-site.sharepoint.com",
  
  // List names
  lists: {
    cafApplications: "CAFApplications",
    buildings: "Buildings"
  },
  
  // Cache duration in milliseconds
  cacheDuration: 5 * 60 * 1000, // 5 minutes
};
