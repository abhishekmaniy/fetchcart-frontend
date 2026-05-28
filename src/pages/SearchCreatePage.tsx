import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import SearchMainContent from "@/components/SmartSearch/SearchMainContent";

const SearchCreatePage = () => {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Header setSelectedCompare={() => {}} setSelectedSearch={() => {}} />

      <div className="flex h-[calc(100vh-73px)] min-h-0 overflow-hidden lg:h-[calc(100vh-83px)] lg:flex-row">
        <Sidebar />
        <SearchMainContent />
      </div>
    </div>
  );
};

export default SearchCreatePage;