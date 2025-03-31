
import { Navigate } from "react-router-dom";

const Index = () => {
  console.log("Index component rendered, redirecting to dashboard");
  return <Navigate to="/dashboard" replace />;
};

export default Index;
