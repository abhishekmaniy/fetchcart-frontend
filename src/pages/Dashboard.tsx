
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchInterface from "@/components/SearchInterface";
import SearchResults from "@/components/SearchResults";
import AIShoppingAssistant from "@/components/AIShoppingAssistant";
import HistorySidebar from "@/components/HistorySidebar";
import { 
  ShoppingCart, 
  History, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Bell,
  Menu,
  Home,
  Search
} from "lucide-react";

const Dashboard = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'assistant' | 'trends'>('search');

  const quickStats = [
    { label: "Total Searches", value: "127", icon: Search, color: "text-blue-600" },
    { label: "Money Saved", value: "$2,500", icon: TrendingUp, color: "text-green-600" },
    { label: "Products Found", value: "1,847", icon: ShoppingCart, color: "text-purple-600" },
    { label: "Active Alerts", value: "23", icon: Bell, color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  FetchCart
                </span>
              </div>
              <Badge variant="secondary" className="hidden md:flex">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <HistorySidebar>
                <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:scale-105 transition-transform">
                  <History className="h-4 w-4" />
                  <span className="hidden md:inline">History</span>
                </Button>
              </HistorySidebar>
              
              <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Community</span>
              </Button>
              
              <Button size="sm" className="relative overflow-hidden group">
                <span className="relative z-10">Upgrade Pro</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-secondary/50 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 p-1 bg-secondary/50 rounded-xl w-fit">
          <Button
            variant={activeTab === 'search' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('search')}
            className="rounded-lg transition-all"
          >
            <Search className="h-4 w-4 mr-2" />
            Smart Search
          </Button>
          <Button
            variant={activeTab === 'assistant' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('assistant')}
            className="rounded-lg transition-all"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
          <Button
            variant={activeTab === 'trends' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('trends')}
            className="rounded-lg transition-all"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </Button>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'search' && (
            <div>
              {searchResults ? (
                <SearchResults 
                  results={searchResults} 
                  onNewSearch={() => setSearchResults(null)}
                />
              ) : (
                <SearchInterface 
                  onSearchComplete={setSearchResults}
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                />
              )}
            </div>
          )}

          {activeTab === 'assistant' && (
            <AIShoppingAssistant />
          )}

          {activeTab === 'trends' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Shopping Trends & Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                  <p>Advanced analytics and market trends will be available here.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
