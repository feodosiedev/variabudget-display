
import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Building Budget Manager</span>
        </Link>
        <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-foreground transition-colors hover:text-primary">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
