import Header from "@/components/SmartSearch/Header";
import Sidebar from "@/components/SmartSearch/Sidebar";
import CompareResults from "@/components/CompareResults";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Tab = "search" | "trends" | "compare" | "deals" | "recommendations";

const Compare = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("compare");

  const handleTabChange = (tab: Tab) => {
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

        <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-hero px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute -left-24 -top-32 h-[260px] w-[260px] rounded-full bg-primary/20 blur-3xl sm:h-[360px] sm:w-[360px]" />
            <div className="absolute -right-24 top-1/3 h-[280px] w-[280px] rounded-full bg-sky-400/20 blur-3xl sm:h-[420px] sm:w-[420px]" />
            <div className="absolute bottom-0 left-1/3 h-[220px] w-[220px] rounded-full bg-violet-400/20 blur-3xl sm:h-[280px] sm:w-[280px]" />
          </div>

          <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col">
            <CompareResults />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Compare;