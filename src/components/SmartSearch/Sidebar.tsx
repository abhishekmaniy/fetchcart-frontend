import React from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  GitCompareArrows,
  HelpCircle,
  History,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type Tab = "search" | "compare" | "history";

type SidebarItem = {
  label: string;
  shortLabel: string;
  tab: Tab;
  path: string;
  icon: React.ElementType;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Smart Search",
    shortLabel: "Search",
    tab: "search",
    path: "/search",
    icon: Search,
  },
  {
    label: "Product Comparison",
    shortLabel: "Compare",
    tab: "compare",
    path: "/compare",
    icon: GitCompareArrows,
  },
  {
    label: "History",
    shortLabel: "History",
    tab: "history",
    path: "/history",
    icon: History,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (): Tab => {
    const pathname = location.pathname;

    if (pathname.startsWith("/compare")) return "compare";
    if (pathname.startsWith("/history")) return "history";

    return "search";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (item: SidebarItem) => {
    if (location.pathname === item.path) return;

    navigate(item.path);
  };

  return (
    <>
      <aside className="sidebar-glass hidden h-full w-72 shrink-0 flex-col overflow-hidden border-r border-border/60 shadow-soft lg:flex">
        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;

            return (
              <Button
                key={item.tab}
                type="button"
                variant="ghost"
                onClick={() => handleTabChange(item)}
                className={`group w-full justify-start gap-3 rounded-2xl px-4 py-6 text-sm font-medium transition-all ${
                  isActive
                    ? "sidebar-item-active hover:text-white"
                    : "sidebar-item hover:translate-x-1"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-accent text-primary group-hover:bg-primary/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-border/60 p-4">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
                <HelpCircle className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">
                  Need help?
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/support")}
                  className="text-xs text-primary hover:underline"
                >
                  Contact support
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="shrink-0 border-b border-border/60 bg-background/95 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;

            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleTabChange(item)}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "border-primary/40 bg-primary-gradient text-white shadow-glow"
                    : "border-border/60 bg-card/70 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;