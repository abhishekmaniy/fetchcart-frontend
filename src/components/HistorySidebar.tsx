import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Clock, Search, Trash2, Star, Filter, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
  category?: string;
  isFavorite?: boolean;
}

interface HistorySidebarProps {
  children: React.ReactNode;
  searchHistory?: HistoryItem[];
  onSelectHistory?: (item: HistoryItem) => void;
}

const HistorySidebar = ({ children, searchHistory = [], onSelectHistory }: HistorySidebarProps) => {
  const [filter, setFilter] = useState<'all' | 'favorites' | 'recent'>('all');

  const mockHistory: HistoryItem[] = [
    {
      id: "1",
      query: "Best wireless headphones under $200",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      resultsCount: 24,
      category: "Electronics",
      isFavorite: true
    },
    {
      id: "2", 
      query: "Ergonomic office chair for home",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      resultsCount: 18,
      category: "Furniture"
    },
    {
      id: "3",
      query: "Gaming laptop with RTX 4060",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      resultsCount: 31,
      category: "Electronics",
      isFavorite: true
    },
    {
      id: "4",
      query: "Organic skincare products",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      resultsCount: 42,
      category: "Beauty"
    },
    {
      id: "5",
      query: "Smart home security system",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      resultsCount: 15,
      category: "Electronics"
    }
  ];

  const history = searchHistory.length > 0 ? searchHistory : mockHistory;

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'favorites') return item.isFavorite;
    if (filter === 'recent') return new Date().getTime() - item.timestamp.getTime() < 24 * 60 * 60 * 1000;
    return true;
  });

  const toggleFavorite = (id: string) => {
    // Handle favorite toggle logic here
    console.log("Toggle favorite for:", id);
  };

  const deleteHistoryItem = (id: string) => {
    // Handle delete logic here
    console.log("Delete history item:", id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="left" className="w-96 p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Search History</span>
          </SheetTitle>
        </SheetHeader>

        {/* Filters */}
        <div className="p-4 border-b bg-secondary/20">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filter === 'recent' ? 'default' : 'outline'}
              onClick={() => setFilter('recent')}
              className="flex items-center space-x-1"
            >
              <Calendar className="h-3 w-3" />
              <span>Recent</span>
            </Button>
            <Button
              size="sm"
              variant={filter === 'favorites' ? 'default' : 'outline'}
              onClick={() => setFilter('favorites')}
              className="flex items-center space-x-1"
            >
              <Star className="h-3 w-3" />
              <span>Favorites</span>
            </Button>
          </div>
        </div>

        {/* History List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No search history found</p>
                <p className="text-sm">Start searching to see your history here</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="group bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/50"
                  onClick={() => onSelectHistory?.(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
                        {item.query}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{getTimeAgo(item.timestamp)}</span>
                        <span>•</span>
                        <span>{item.resultsCount} results</span>
                        {item.category && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs py-0">
                              {item.category}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                      >
                        <Star 
                          className={`h-3 w-3 ${item.isFavorite ? 'text-yellow-400 fill-current' : ''}`} 
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryItem(item.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t bg-secondary/20">
          <Button variant="outline" size="sm" className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All History
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistorySidebar;