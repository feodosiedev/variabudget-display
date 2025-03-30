
import { Link } from "react-router-dom";
import { FileText, Home } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CAF Applications Manager</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="flex items-center text-foreground transition-colors hover:text-primary">
            <Home className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
