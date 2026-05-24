import Header from "@/components/SmartSearch/Header";
import MainContent from "@/components/SmartSearch/MainContent";
import Sidebar from "@/components/SmartSearch/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type DashboardTab =
  | "search"
  | "trends"
  | "compare"
  | "deals"
  | "recommendations";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>("search");

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);

    if (tab === "search") navigate("/search");
    if (tab === "compare") navigate("/compare");
    if (tab === "deals") navigate("/deals");
    if (tab === "recommendations") navigate("/recommendations");
    if (tab === "trends") navigate("/trends");
  };

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Header
        setActiveTab={handleTabChange}
        setSelectedCompare={() => {}}
        setSelectedSearch={() => {}}
      />

      <div className="flex h-[calc(100vh-118px)] min-h-0 flex-col overflow-hidden sm:h-[calc(100vh-122px)] lg:h-[calc(100vh-83px)] lg:flex-row">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

        <MainContent />
      </div>
    </div>
  );
};

export default Dashboard;