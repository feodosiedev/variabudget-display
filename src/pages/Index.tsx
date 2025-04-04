
import { Navigate } from "react-router-dom";
import React from "react";

const Index = () => {
  const isBrowser = typeof window !== 'undefined';
  
  console.log("Index component rendered, redirecting to dashboard");
  
  // Only attempt to redirect in browser environment
  if (isBrowser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // For SSR context, render a simple div that will be replaced on client
  return <div>Loading dashboard...</div>;
};

export default Index;
