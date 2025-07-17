
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Clock, Settings, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  
  const recentSearches = [
    "Best wireless headphones under $200",
    "Ergonomic office chair for home",
    "Gaming laptop with RTX 4060",
    "Organic skincare products",
    "Smart home security system"
  ];

  return (
    <aside className="w-80 bg-secondary/20 border-r p-6 hidden lg:block">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="p-2 bg-primary rounded-lg">
          <ShoppingCart className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold">FetchCart</span>
      </div>

      {/* New Search Button */}
      <Button className="w-full mb-8" onClick={() => window.location.reload()}>
        <Plus className="h-4 w-4 mr-2" />
        New Search
      </Button>

      {/* Recent Searches */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Recent Searches
        </h3>
        <div className="space-y-2">
          {recentSearches.map((search, index) => (
            <button
              key={index}
              className="w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors text-sm text-muted-foreground hover:text-foreground"
            >
              <Search className="h-3 w-3 inline mr-2" />
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        <Button variant="ghost" className="w-full justify-start">
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </nav>

      {/* Back to Landing */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </aside>
  );
};

export default DashboardSidebar;
