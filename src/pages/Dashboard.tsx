import Header from "@/components/SmartSearch/Header";
import MainContent from "@/components/SmartSearch/MainContent";
import Sidebar from "@/components/SmartSearch/Sidebar";

const Dashboard = () => {

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Header
        setSelectedCompare={() => {}}
        setSelectedSearch={() => {}}
      />

      <div className="flex h-[calc(100vh-118px)] min-h-0 flex-col overflow-hidden sm:h-[calc(100vh-122px)] lg:h-[calc(100vh-83px)] lg:flex-row">
        <Sidebar />

        <MainContent />
      </div>
    </div>
  );
};

export default Dashboard;