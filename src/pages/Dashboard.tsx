import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchInterface from "@/components/SearchInterface";
import SearchResults from "@/components/SearchResults";
import AIShoppingAssistant from "@/components/AIShoppingAssistant";
import HistorySidebar from "@/components/HistorySidebar";
import TrendsAnalytics from "@/components/features/TrendsAnalytics";
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
import { motion } from "framer-motion";

const Dashboard = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'assistant' | 'trends'>('search');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-indigo-100">
      {/* Animated Colorful Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-20 blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.7, opacity: 0.4 }}
          animate={{ scale: 1.1, opacity: 0.7 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-20 blur-2xl"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0.3 }}
          animate={{ scale: 1.05, opacity: 0.5 }}
          transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute bottom-0 left-1/2 w-[250px] h-[250px] rounded-full bg-gradient-to-tl from-green-300 via-blue-300 to-indigo-400 opacity-10 blur-2xl"
        />
      </div>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 via-pink-400 to-yellow-400 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
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

              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center space-x-2"
                onClick={() => window.location.href = '/community'}
              >
                <Users className="h-4 w-4" />
                <span>Community</span>
              </Button>

              <Button size="sm" className="relative overflow-hidden group bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white shadow">
                <span className="relative z-10">Upgrade Pro</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
       

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
            <TrendsAnalytics />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;