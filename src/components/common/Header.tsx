import { Button } from "@/components/ui/button";
import { useAppAuth } from "@/hooks/useAppAuth";
import type { AppUser, UserPlan } from "@/types/auth.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Crown,
  HelpCircle,
  Laptop,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  sidebarItems,
  getActiveTabFromPath,
} from "@/components/common/Sidebar";

type TabType = "search" | "compare" | "history";

type HeaderProps = {
  setActiveTab?: React.Dispatch<React.SetStateAction<TabType>>;
  setSelectedSearch?: (item: string) => void;
  setSelectedCompare?: (item: string) => void;
};

type ResolvedTheme = "light" | "dark";
type ThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "fetchcart-theme";

const getSystemTheme = (): ResolvedTheme => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

const applyTheme = (theme: ResolvedTheme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const getThemeLabel = (themeMode: ThemeMode) => {
  if (themeMode === "light") return "Light";
  if (themeMode === "dark") return "Dark";
  return "System";
};

const getThemeIcon = (themeMode: ThemeMode) => {
  if (themeMode === "light") return Sun;
  if (themeMode === "dark") return Moon;
  return Laptop;
};

const getUserInitials = (name?: string | null, email?: string | null) => {
  const fallbackName = name?.trim() || email?.split("@")[0] || "U";

  const parts = fallbackName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const firstInitial = parts[0]?.[0] || "";
  const lastInitial = parts[parts.length - 1]?.[0] || "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
};

const getPlanLabel = (plan?: UserPlan) => {
  if (plan === "MAX") return "Max Plan";
  if (plan === "PRO") return "Pro Plan";
  return "Free Plan";
};

const getAvatarRingClass = (plan?: UserPlan) => {
  if (plan === "MAX") {
    return "bg-primary-gradient p-[2px]";
  }

  if (plan === "PRO") {
    return "rounded-full border-2 border-dotted border-primary p-[2px]";
  }

  return "rounded-full border border-border bg-background p-[2px]";
};

const Header = ({
  setActiveTab,
  setSelectedSearch,
  setSelectedCompare,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, isAuthInitialized, logout } = useAppAuth();

  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      THEME_STORAGE_KEY,
    ) as ThemeMode | null;

    const initialThemeMode: ThemeMode =
      savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
        ? savedTheme
        : "system";

    const initialResolvedTheme =
      initialThemeMode === "system" ? getSystemTheme() : initialThemeMode;

    setThemeMode(initialThemeMode);
    setResolvedTheme(initialResolvedTheme);
    applyTheme(initialResolvedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      const currentThemeMode = localStorage.getItem(
        THEME_STORAGE_KEY,
      ) as ThemeMode | null;

      if (!currentThemeMode || currentThemeMode === "system") {
        const systemTheme = getSystemTheme();

        setThemeMode("system");
        setResolvedTheme(systemTheme);
        applyTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const handleThemeChange = (nextThemeMode: ThemeMode) => {
    const nextResolvedTheme =
      nextThemeMode === "system" ? getSystemTheme() : nextThemeMode;

    localStorage.setItem(THEME_STORAGE_KEY, nextThemeMode);
    setThemeMode(nextThemeMode);
    setResolvedTheme(nextResolvedTheme);
    applyTheme(nextResolvedTheme);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLandingPage) {
    return (
      <LandingHeader
        user={user}
        themeMode={themeMode}
        resolvedTheme={resolvedTheme}
        isAuthenticated={isAuthenticated}
        isAuthInitialized={isAuthInitialized}
        onThemeChange={handleThemeChange}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <DashboardHeader
      user={user}
      themeMode={themeMode}
      resolvedTheme={resolvedTheme}
      isAuthenticated={isAuthenticated}
      isAuthInitialized={isAuthInitialized}
      onThemeChange={handleThemeChange}
      onLogout={handleLogout}
    />
  );
};

export default Header;

type UserMenuProps = {
  user: AppUser | null;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onThemeChange: (themeMode: ThemeMode) => void;
  onLogout: () => void;
  size?: "sm" | "md";
};

function UserMenu({
  user,
  themeMode,
  resolvedTheme,
  onThemeChange,
  onLogout,
  size = "md",
}: UserMenuProps) {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const plan = user?.plan || user?.userPlan?.effectivePlan || "FREE";

  const initials = useMemo(
    () => getUserInitials(user?.name, user?.email),
    [user?.name, user?.email],
  );

  const avatarSizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";

  const ThemeIcon = getThemeIcon(themeMode);

  const themeOptions: {
    label: string;
    value: ThemeMode;
    icon: React.ElementType;
  }[] = [
    {
      label: "Light",
      value: "light",
      icon: Sun,
    },
    {
      label: "Dark",
      value: "dark",
      icon: Moon,
    },
    {
      label: "System",
      value: "system",
      icon: Laptop,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
        setThemeDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setThemeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setOpen(false);
    setThemeDropdownOpen(false);
    onLogout();
  };

  const handleUpgrade = () => {
    setOpen(false);
    setThemeDropdownOpen(false);
    navigate("/checkout");
  };

  const handleThemeSelect = (nextThemeMode: ThemeMode) => {
    onThemeChange(nextThemeMode);
    setThemeDropdownOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open user menu"
        aria-expanded={open}
        className="rounded-full outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className={`block rounded-full ${getAvatarRingClass(plan)}`}>
          <span
            className={`${avatarSizeClass} flex items-center justify-center rounded-full bg-primary-gradient font-semibold text-white shadow-elegant`}
          >
            {initials}
          </span>
        </span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="absolute right-0 top-[calc(100%+10px)] z-[80] w-[300px] overflow-visible rounded-2xl border border-border/70 bg-popover/95 text-popover-foreground shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-primary-gradient" />

          <div className="p-4">
            <div className="flex items-center gap-3">
              <span
                className={`block rounded-full ${getAvatarRingClass(plan)}`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-gradient text-base font-semibold text-white shadow-elegant">
                  {initials}
                </span>
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border/60 bg-muted/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {plan === "MAX" ? (
                    <Crown className="h-4 w-4 text-primary" />
                  ) : plan === "PRO" ? (
                    <Zap className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {getPlanLabel(plan)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {plan === "MAX"
                        ? "Full access enabled"
                        : plan === "PRO"
                          ? "Pro features active"
                          : "Basic access"}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    plan === "FREE"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {plan}
                </span>
              </div>
            </div>

            {plan !== "MAX" && (
              <Button
                type="button"
                onClick={handleUpgrade}
                className="mt-3 h-10 w-full rounded-xl bg-primary-gradient text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow"
              >
                <Crown className="mr-2 h-4 w-4" />
                {plan === "PRO" ? "Upgrade to Max" : "Upgrade Plan"}
              </Button>
            )}

            <div className="my-3 h-px bg-border/70" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setThemeDropdownOpen((prev) => !prev)}
                className="flex h-11 w-full items-center justify-between rounded-xl px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <ThemeIcon className="h-4 w-4" />
                  Theme
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {getThemeLabel(themeMode)}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      themeDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {themeDropdownOpen && (
                <div className="mt-2 rounded-2xl border border-border/70 bg-background/95 p-1.5 shadow-elegant backdrop-blur-xl">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = themeMode === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleThemeSelect(option.value)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          isActive
                            ? "bg-primary-gradient text-white"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />

                          <span>
                            <span className="block text-sm font-medium">
                              {option.label}
                            </span>
                          </span>
                        </span>

                        {isActive && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

type SharedHeaderProps = {
  user: AppUser | null;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  onThemeChange: (themeMode: ThemeMode) => void;
  onLogout: () => void;
};

function LandingHeader({
  user,
  themeMode,
  resolvedTheme,
  isAuthenticated,
  isAuthInitialized,
  onThemeChange,
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
          <img
            src="/Logo3880.svg"
            alt="FetchCart AI logo"
            className="h-8 w-8 shrink-0"
            draggable={false}
          />

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

              <UserMenu
                user={user}
                themeMode={themeMode}
                resolvedTheme={resolvedTheme}
                onThemeChange={onThemeChange}
                onLogout={onLogout}
                size="sm"
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="rounded-xl bg-primary-gradient px-3 py-2 text-xs font-medium text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow sm:px-4 sm:text-sm"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function DashboardHeader({
  user,
  themeMode,
  resolvedTheme,
  isAuthenticated,
  isAuthInitialized,
  onThemeChange,
  onLogout,
}: SharedHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeTab = getActiveTabFromPath(location.pathname);

  const handleNavigate = (path: string) => {
    setMobileSidebarOpen(false);

    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const getUpgradeButtonText = () => {
    if (!isAuthenticated) {
      return "Upgrade Pro";
    }

    const userPlan = user?.userPlan?.plan;

    if (userPlan === "FREE") {
      return "Upgrade Pro";
    }

    if (userPlan === "PRO") {
      return "Upgrade Max";
    }

    if (userPlan === "MAX") {
      return planExpiresAt
        ? `Max Active • Expires ${planExpiresAt}`
        : "Max Plan Active";
    }

    return "Upgrade";
  };

  const isMaxUser = user?.userPlan?.plan === "MAX";

  const planExpiresAt = user?.userPlan?.expiresAt
    ? new Date(user.userPlan.expiresAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    : null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/95 px-3 py-3 backdrop-blur-xl sm:px-4 lg:px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-primary-gradient" />

        <div className="mx-auto max-w-[1510px]">
          <div className="glass shadow-soft flex w-full items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 sm:px-4">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card/70 text-foreground transition-all hover:bg-accent lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop logo */}
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="hidden min-w-0 items-center gap-2 font-semibold tracking-tight lg:flex"
            >
              <img
                src="/Logo3880.svg"
                alt="FetchCart AI logo"
                className="h-9 w-9 shrink-0"
                draggable={false}
              />

              <span className="truncate text-xl font-semibold tracking-tight">
                FetchCart <span className="text-gradient">AI</span>
              </span>
            </button>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Button
                size="sm"
                onClick={() => navigate("/checkout")}
                className={`group h-10 rounded-2xl border px-4 text-sm font-medium transition-all duration-300 ${
                  user?.userPlan?.plan === "MAX"
                    ? "border-violet-500/30 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-sky-500/20 text-white shadow-[0_0_30px_rgba(139,92,246,0.25)] hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]"
                    : "bg-primary-gradient text-white shadow-elegant hover:-translate-y-0.5 hover:shadow-glow"
                }`}
              >
                <Crown
                  className={`mr-2 h-4 w-4 ${
                    user?.userPlan?.plan === "MAX"
                      ? "text-violet-200"
                      : "text-white"
                  }`}
                />

                {/* Mobile */}
                <span className="hidden min-[380px]:inline lg:hidden">
                  {user?.userPlan?.plan === "FREE"
                    ? "Pro"
                    : user?.userPlan?.plan === "PRO"
                      ? "Max"
                      : "Premium"}
                </span>

                {/* Desktop */}
                <span className="hidden lg:inline">
                  {user?.userPlan?.plan === "FREE"
                    ? "Upgrade to Pro"
                    : user?.userPlan?.plan === "PRO"
                      ? "Upgrade to Max"
                      : "Manage Subscription"}
                </span>
              </Button>

              {!isAuthInitialized ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted sm:h-10 sm:w-10" />
              ) : isAuthenticated ? (
                <UserMenu
                  user={user}
                  themeMode={themeMode}
                  resolvedTheme={resolvedTheme}
                  onThemeChange={onThemeChange}
                  onLogout={onLogout}
                  size="sm"
                />
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
        </div>
      </header>

      {/* Mobile right drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-[90] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close sidebar backdrop"
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 26,
              }}
              className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-hidden border-r border-border/70 bg-background/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

              <div className="relative flex items-center justify-between border-b border-border/70 p-5">
                <button
                  type="button"
                  onClick={() => handleNavigate("/search")}
                  className="flex min-w-0 items-center gap-3"
                >
                  <img
                    src="/Logo3880.svg"
                    alt="FetchCart AI logo"
                    className="h-11 w-11 shrink-0"
                    draggable={false}
                  />

                  <span className="truncate text-xl font-semibold tracking-tight">
                    FetchCart <span className="text-gradient">AI</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card/70 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="relative min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.tab;

                  return (
                    <Button
                      key={item.tab}
                      type="button"
                      variant="ghost"
                      onClick={() => handleNavigate(item.path)}
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

              <div className="relative shrink-0 border-t border-border/60 p-4">
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
                        onClick={() => handleNavigate("/support")}
                        className="text-xs text-primary hover:underline"
                      >
                        Contact support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-hidden="true" className="h-[73px] lg:h-[83px]" />
    </>
  );
}
