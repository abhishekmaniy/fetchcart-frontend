import { Button } from "@/components/ui/button";
import { useAppAuth } from "@/hooks/useAppAuth";
import { motion } from "framer-motion";
import {
  Crown,
  GitCompareArrows,
  History,
  LogOut,
  Moon,
  Search,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HistorySidebar from "./HistorySidebar";

type TabType = "search" | "trends" | "compare" | "deals" | "recommendations";

type HeaderProps = {
  setActiveTab?: React.Dispatch<React.SetStateAction<TabType>>;
  setSelectedSearch?: (item: string) => void;
  setSelectedCompare?: (item: string) => void;
};

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "fetchcart-theme";

const getSystemTheme = (): Theme => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const Header = ({
  setActiveTab,
  setSelectedSearch,
  setSelectedCompare,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAuthInitialized, logout } = useAppAuth();

  const [dark, setDark] = useState(false);

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

    const initialTheme: Theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : getSystemTheme();

    applyTheme(initialTheme);
    setDark(initialTheme === "dark");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      const currentSavedTheme = localStorage.getItem(
        THEME_STORAGE_KEY,
      ) as Theme | null;

      // Only follow system theme if user has not manually selected light/dark
      if (currentSavedTheme !== "dark" && currentSavedTheme !== "light") {
        const systemTheme = getSystemTheme();

        applyTheme(systemTheme);
        setDark(systemTheme === "dark");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = dark ? "light" : "dark";

    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setDark(nextTheme === "dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab?.(tab);

    if (tab === "search") {
      setSelectedSearch?.("");
    }

    if (tab === "compare") {
      setSelectedCompare?.("");
    }

    navigate("/search");
  };

  if (isLandingPage) {
    return (
      <LandingHeader
        dark={dark}
        isAuthenticated={isAuthenticated}
        isAuthInitialized={isAuthInitialized}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <DashboardHeader
      dark={dark}
      isAuthenticated={isAuthenticated}
      isAuthInitialized={isAuthInitialized}
      onToggleTheme={toggleTheme}
      onLogout={handleLogout}
      onTabChange={handleTabChange}
    />
  );
};

export default Header;

type SharedHeaderProps = {
  dark: boolean;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
};

function LandingHeader({
  dark,
  isAuthenticated,
  isAuthInitialized,
  onToggleTheme,
  onLogout,
}: SharedHeaderProps) {
  const navigate = useNavigate();

  const links = ["Features", "Demo", "Pricing", "Reviews"];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4"
    >
      <div className="glass shadow-soft flex w-full max-w-[1100px] items-center justify-between gap-2 rounded-2xl px-3 py-2.5 sm:px-5">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex min-w-0 items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-gradient shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </span>

          <span className="truncate text-[14px] sm:text-[15px]">
            FetchCart <span className="text-gradient">AI</span>
          </span>
        </button>

        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="transition-colors hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {!isAuthInitialized ? (
            <div className="hidden h-9 w-16 animate-pulse rounded-xl bg-muted sm:block" />
          ) : isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="rounded-xl bg-primary-gradient px-3 py-2 text-xs font-medium text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow sm:px-4 sm:text-sm"
              >
                <span className="sm:hidden">App</span>
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                aria-label="Log out"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 sm:w-auto sm:px-3"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden text-sm sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/auth")}
                // className="hidden px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
                className="rounded-xl bg-primary-gradient px-3 py-2 text-xs font-medium text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow sm:px-4 sm:text-sm"
              >
                Sign in
              </button>

              {/* <button
                type="button"
                onClick={() => navigate("/search")}
                className="rounded-xl bg-primary-gradient px-3 py-2 text-xs font-medium text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow sm:px-4 sm:text-sm"
              >
                <span className="sm:hidden">Start</span>
                <span className="hidden sm:inline">Get started</span>
              </button> */}
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

type DashboardHeaderProps = SharedHeaderProps & {
  onTabChange: (tab: TabType) => void;
};

function DashboardHeader({
  dark,
  isAuthenticated,
  isAuthInitialized,
  onToggleTheme,
  onLogout,
  onTabChange,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/95 px-3 py-3 backdrop-blur-xl sm:px-4 lg:px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-primary-gradient" />

        <div className="mx-auto max-w-[1510px]">
          <div className="glass shadow-soft flex w-full flex-col gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 sm:px-4 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
            <div className="flex min-w-0 items-center justify-between gap-2 lg:flex-1">
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="flex min-w-0 items-center gap-2 font-semibold tracking-tight"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-gradient shadow-glow sm:h-10 sm:w-10 lg:h-9 lg:w-9">
                  <Sparkles className="h-4 w-4 text-white" />
                </span>

                <span className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                  FetchCart <span className="text-gradient">AI</span>
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
                <Button
                  size="sm"
                  onClick={() => navigate("/checkout")}
                  className="h-9 rounded-xl bg-primary-gradient px-3 text-xs text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow sm:h-10 sm:gap-2 sm:text-sm"
                >
                  <Crown className="h-4 w-4" />
                  <span className="hidden min-[380px]:inline">Pro</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onToggleTheme}
                  aria-label="Toggle theme"
                  title={dark ? "Switch to light mode" : "Switch to dark mode"}
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground sm:h-10 sm:w-10"
                >
                  {dark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>

                {!isAuthInitialized ? (
                  <div className="h-9 w-9 animate-pulse rounded-xl bg-muted sm:h-10 sm:w-10" />
                ) : isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 sm:h-10 sm:w-10"
                    onClick={onLogout}
                    aria-label="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="h-9 rounded-xl bg-primary-gradient px-3 text-xs text-white shadow-elegant hover:shadow-glow sm:h-10 sm:text-sm"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            <div className="hidden items-center gap-1.5 sm:gap-2 lg:flex">
              <Button
                size="sm"
                onClick={() => navigate("/checkout")}
                className="h-10 gap-2 rounded-xl bg-primary-gradient text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow"
              >
                <Crown className="h-4 w-4" />
                <span>Upgrade Pro</span>
              </Button>

              <HistorySidebar>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 gap-2 rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                >
                  <History className="h-4 w-4" />
                  <span>History</span>
                </Button>
              </HistorySidebar>

              {/* <Button
                variant="ghost"
                size="sm"
                className="h-10 gap-2 rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                onClick={() => navigate("/community")}
              >
                <Users className="h-4 w-4" />
                <span>Community</span>
              </Button> */}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground"
              >
                {dark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {!isAuthInitialized ? (
                <div className="h-10 w-20 animate-pulse rounded-xl bg-muted" />
              ) : isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 gap-2 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="h-10 rounded-xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow"
                >
                  Sign In
                </Button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5 lg:hidden">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onTabChange("search")}
                className="h-9 rounded-xl px-2 text-xs text-muted-foreground hover:bg-accent/70 hover:text-foreground"
              >
                <Search className="mr-1.5 h-3.5 w-3.5" />
                Search
              </Button>

              <HistorySidebar>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-full rounded-xl px-2 text-xs text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                >
                  <History className="mr-1.5 h-3.5 w-3.5" />
                  History
                </Button>
              </HistorySidebar>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onTabChange("compare")}
                className="h-9 rounded-xl px-2 text-xs text-muted-foreground hover:bg-accent/70 hover:text-foreground"
              >
                <GitCompareArrows className="mr-1.5 h-3.5 w-3.5" />
                Compare
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onTabChange("trends")}
                className="h-9 rounded-xl px-2 text-xs text-muted-foreground hover:bg-accent/70 hover:text-foreground"
              >
                <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                Trends
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div aria-hidden="true" className="h-[118px] sm:h-[122px] lg:h-[83px]" />
    </>
  );
}
