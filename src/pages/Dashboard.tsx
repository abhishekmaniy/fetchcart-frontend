
import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import SearchInterface from "@/components/SearchInterface";
import SearchResults from "@/components/SearchResults";

const Dashboard = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 max-w-4xl mx-auto w-full p-6">
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
      </main>
    </div>
  );
};

export default Dashboard;
