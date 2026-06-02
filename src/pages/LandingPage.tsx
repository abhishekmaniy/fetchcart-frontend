import Header from "@/components/common/Header";
import { useAppStore } from "@/store/app.store";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  Check,
  GitCompareArrows,
  Github,
  Instagram,
  LineChart,
  Linkedin,
  Moon,
  Play,
  Search,
  Sparkles,
  Star,
  Sun,
  TrendingDown,
  TrendingUp,
  Twitter,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { isAuthenticated } = useAppStore();

  if (isAuthenticated === true) {
    return <Navigate to="/search" replace />;
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />
      <Logos />
      <Features />
      <VideoDemo />
      <Showcase />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default LandingPage;

function Nav() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark((prev) => !prev);
  };

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
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => navigate("/auth")}
            className="hidden px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
          >
            Sign in
          </button>

          <button
            onClick={() => navigate("/search")}
            className="rounded-xl bg-primary-gradient px-3 py-2 text-xs font-medium text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Get started</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function Hero() {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);

  const words = useMemo(
    () => ["compare faster", "track better", "save more", "choose confidently"],
    [],
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2400);

    return () => clearTimeout(id);
  }, [wordIndex, words]);

  return (
    <section className="relative overflow-hidden bg-hero pb-16 pt-28 sm:pb-20 sm:pt-32 md:pb-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-28 top-16 h-[300px] w-[300px] rounded-full bg-[#8b5cf6]/30 opacity-60 blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="absolute -right-28 top-44 h-[320px] w-[320px] rounded-full bg-[#38bdf8]/30 opacity-50 blur-3xl sm:-right-10 sm:h-[480px] sm:w-[480px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-[10px] font-medium text-muted-foreground shadow-soft backdrop-blur-md sm:px-3.5 sm:text-[11px]"
        >
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary" />
          <span className="truncate">
            New · AI-powered shopping for everyone
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mx-auto mt-5 max-w-5xl font-display text-[2.45rem] leading-[1.02] tracking-tight sm:mt-6 sm:text-6xl md:text-7xl"
        >
          Shop smarter with AI
          <br className="hidden sm:block" />
          <span className="relative mt-1 inline-flex h-[1.38em] w-full max-w-[340px] items-center justify-center overflow-visible px-2 align-bottom sm:mt-2 sm:max-w-[520px] sm:px-8 md:max-w-[680px]">
            {words.map((word, index) => (
              <motion.span
                key={word}
                className="absolute whitespace-nowrap px-2 pb-2 pt-1 text-center font-semibold italic text-gradient sm:px-6 sm:pb-3 sm:pt-2"
                initial={{ opacity: 0, y: 70 }}
                animate={
                  wordIndex === index
                    ? {
                        opacity: 1,
                        y: 0,
                      }
                    : {
                        opacity: 0,
                        y: wordIndex > index ? -70 : 70,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 65,
                  damping: 15,
                }}
              >
                {word}
              </motion.span>
            ))}

            <span className="invisible font-semibold italic">
              choose confidently
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-5 md:text-lg"
        >
          Discover the best products across every major marketplace. One AI
          search compares prices, tracks deals, and recommends what is actually
          worth buying.
        </motion.p>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
          <button
            onClick={() => navigate("/search")}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-gradient px-5 py-3 text-sm font-medium text-white shadow-elegant transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow sm:px-6"
          >
            Start searching free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-5 py-3 text-sm font-medium shadow-soft backdrop-blur-md transition-all duration-300 hover:shadow-elegant sm:px-6"
          >
            Watch demo
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="relative mx-auto mt-12 max-w-3xl sm:mt-16 md:mt-24"
        >
          <FloatingCard
            className="absolute -left-32 -top-12 z-10 hidden animate-float-slow lg:flex"
            title="Sony WH-1000XM5"
            price="₹329"
            badge="−14%"
            rotate="-6deg"
            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop"
            url="https://amazon.in/Sony-WH-1000XM5-Wireless-Cancelling-Headphones/dp/B09XS7JWHH?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A1TAQZVKEMWXY8"
          />

          <FloatingCard
            className="absolute -right-36 -top-6 z-10 hidden animate-float lg:flex"
            title="JBL Tune 770NC"
            price="₹999"
            badge="−18%"
            rotate="5deg"
            image="https://m.media-amazon.com/images/I/61JU2HicMQL._SX679_.jpg"
            url="https://www.amazon.in/JBL-Wireless-Headphones-Speedcharge-Customize/dp/B09CYX92NB/ref=asc_df_B09CYX92NB?mcid=8a0302df5fc237ed9f7f09916a1b4536&tag=googleshopdes-21&linkCode=df0&hvadid=709962856211&hvpos=&hvnetw=g&hvrand=18045377741709292444&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9145630&hvtargid=pla-2218460994674&hvocijid=18045377741709292444-B09CYX92NB-&hvexpln=0&gad_source=1&th=1"
          />

          <div className="relative z-20 rounded-[1.65rem] border border-border/60 bg-background/70 p-2.5 shadow-elegant backdrop-blur-xl sm:rounded-3xl sm:p-3 md:p-4">
            <div className="flex items-start gap-2 rounded-2xl bg-card/70 px-3 py-3 sm:items-center sm:gap-3 sm:px-4">
              {/* <Search className="mt-0.5 h-5 w-5 shrink-0 text-primary sm:mt-0" /> */}

              <span className="min-w-0 flex-1 whitespace-normal break-words text-left text-sm leading-snug text-foreground/90 sm:text-base">
                noise cancelling headphones under $300
              </span>

              <div className="ml-auto flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Search className="h-4.5 w-4.5 text-primary" />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 md:gap-3">
              {[
                {
                  label: "Best price",
                  icon: TrendingDown,
                  value: "−32%",
                },
                {
                  label: "AI score",
                  icon: Sparkles,
                  value: "9.4",
                },
                {
                  label: "Top rated",
                  icon: Star,
                  value: "4.8★",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-card/60 px-2 py-2 text-left sm:px-3 sm:py-2.5"
                >
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground sm:gap-1.5 sm:text-[11px]">
                    <item.icon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="mt-0.5 text-xs font-semibold sm:text-sm">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingCard({
  title,
  price,
  badge,
  rotate,
  className = "",
  image,
  url,
}: {
  title: string;
  price: string;
  badge: string;
  rotate: string;
  className?: string;
  image: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group items-center gap-3 rounded-2xl border border-border/60 bg-background/80 p-3 shadow-elegant backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow ${className}`}
      style={{
        transform: `rotate(${rotate})`,
      }}
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-card">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 text-left">
        <div className="max-w-[130px] truncate text-sm font-semibold text-foreground">
          {title}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {price}
          </span>

          <span className="rounded-full bg-primary-gradient px-2 py-0.5 text-[10px] font-semibold text-white">
            {badge}
          </span>
        </div>
      </div>
    </a>
  );
}

function Logos() {
  const stores = [
    { name: "Amazon", logo: "/logo-amazon.svg" },
    { name: "Flipkart", logo: "/flipkart.svg" },
    { name: "Myntra", logo: "/myntra-1.svg" },
    { name: "Croma", logo: "/Croma_idpW4Nsf-e_1.svg" },
    { name: "Reliance Digital", logo: "/Reliance_Digital.svg" },
    { name: "Nykaa", logo: "/nykaa-1.svg" },
    { name: "Ajio", logo: "/ajio.svg" },
    { name: "Tata CLiQ", logo: "/TataCLiQ_idQYhdsjt2_1.svg" },
  ];

  const repeatedStores = [...stores, ...stores];

  return (
    <section className="overflow-hidden border-y border-border/50 bg-card/40 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted across every major marketplace
        </p>

        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background via-background/90 to-transparent sm:w-28" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background via-background/90 to-transparent sm:w-28" />

          <div className="flex w-max animate-logo-scroll gap-4 sm:gap-8">
            {repeatedStores.map((store, index) => (
              <div
                key={`${store.name}-${index}`}
                className="flex h-16 min-w-[130px] items-center justify-center rounded-2xl border border-border/50 bg-white px-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant dark:border-white/10 dark:bg-white/95 sm:h-20 sm:min-w-[170px] sm:px-7"
              >
                <img
                  src={store.logo}
                  alt={store.name}
                  className="max-h-9 w-auto object-contain opacity-90 transition-all duration-300 hover:scale-105 hover:opacity-100 sm:max-h-12"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes logo-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .animate-logo-scroll {
            animation: logo-scroll 22s linear infinite;
          }

          .animate-logo-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </section>
  );
}

function Features() {
  const features = [
    {
      id: 1,
      icon: Search,
      title: "AI Smart Search",
      desc: "Describe what you want in plain language. Our AI understands intent, brand, budget and use-case.",
      status: "Core",
      energy: 96,
    },
    {
      id: 2,
      icon: GitCompareArrows,
      title: "Product Comparison",
      desc: "Side-by-side specs, reviews, and prices across stores — no more 12 open tabs.",
      status: "Smart",
      energy: 92,
    },
    {
      id: 3,
      icon: BadgePercent,
      title: "Deal Detection",
      desc: "Spots real discounts vs. inflated MRP tricks. Surfaces only genuine savings.",
      status: "Savings",
      energy: 89,
    },
    {
      id: 4,
      icon: LineChart,
      title: "Price Tracking",
      desc: "Track prices across platforms and get alerts the moment something drops.",
      status: "Live",
      energy: 94,
    },
    {
      id: 5,
      icon: Sparkles,
      title: "Recommendations",
      desc: "Personalized picks based on your style, budget and past favorites.",
      status: "Personal",
      energy: 91,
    },
    {
      id: 6,
      icon: TrendingUp,
      title: "Trend Insights",
      desc: "See what's trending right now and what's worth your attention this week.",
      status: "Trends",
      energy: 88,
    },
  ];

  const [activeFeature, setActiveFeature] = useState(features[0]);
  const [isPaused, setIsPaused] = useState(false);

  const rotationRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const RADIUS = 180;
  const CENTER = 240;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!isPaused) {
        const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 0;
        rotationRef.current = (rotationRef.current + delta * 0.009) % 360;

        features.forEach((_, index) => {
          const node = nodeRefs.current[index];
          if (!node) return;

          const angle = (index / features.length) * 360 + rotationRef.current;
          const radian = (angle * Math.PI) / 180;
          const cx = CENTER + RADIUS * Math.cos(radian);
          const cy = CENTER + RADIUS * Math.sin(radian);

          node.style.left = `${cx}px`;
          node.style.top = `${cy}px`;
        });
      }

      lastTimeRef.current = timestamp;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPaused]);

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl sm:h-[520px] sm:w-[520px]" />
        <div className="absolute left-0 top-20 h-56 w-56 rounded-full bg-[#8b5cf6]/10 blur-3xl sm:left-10 sm:h-72 sm:w-72" />
        <div className="absolute bottom-16 right-0 h-56 w-56 rounded-full bg-[#38bdf8]/10 blur-3xl sm:right-10 sm:h-72 sm:w-72" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Features
          </p>

          <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to{" "}
            <span className="text-gradient italic">shop better</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Six tools, one elegant assistant. Built to save you hours and money.
          </p>
        </div>

        {/* Mobile small icon selector */}
        <div className="mt-8 flex items-center justify-center gap-3 lg:hidden">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeFeature.id === feature.id;

            return (
              <button
                key={feature.id}
                type="button"
                aria-label={`Show ${feature.title}`}
                title={feature.title}
                onClick={() => {
                  setActiveFeature(feature);
                  setIsPaused(true);
                }}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-soft transition-all duration-300 ${
                  isActive
                    ? "scale-110 border-primary/40 bg-primary-gradient text-white shadow-glow"
                    : "border-border/60 bg-background/80 text-primary hover:border-primary/30 hover:bg-card"
                }`}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col items-center gap-8 lg:mt-16 lg:flex-row lg:items-center lg:gap-16">
          {/* Desktop orbital diagram */}
          <div
            className="relative hidden shrink-0 lg:block"
            style={{ width: 480, height: 480 }}
          >
            <div
              className="absolute rounded-full border border-border/40"
              style={{ width: 420, height: 420, top: 30, left: 30 }}
            />
            <div
              className="absolute rounded-full border border-border/25"
              style={{ width: 340, height: 340, top: 70, left: 70 }}
            />
            <div
              className="absolute rounded-full border border-border/15"
              style={{ width: 480, height: 480, top: 0, left: 0 }}
            />

            <div
              className="absolute z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary-gradient shadow-glow"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="absolute h-28 w-28 animate-ping rounded-full border border-primary/30" />
              <div className="absolute h-36 w-36 rounded-full border border-primary/10" />
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            {features.map((feature, index) => {
              const initialAngle = (index / features.length) * 360;
              const initialRadian = (initialAngle * Math.PI) / 180;
              const initialCx = CENTER + RADIUS * Math.cos(initialRadian);
              const initialCy = CENTER + RADIUS * Math.sin(initialRadian);
              const isActive = activeFeature.id === feature.id;
              const Icon = feature.icon;

              return (
                <button
                  key={feature.id}
                  type="button"
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  onMouseEnter={() => {
                    setActiveFeature(feature);
                    setIsPaused(true);
                  }}
                  onMouseLeave={() => setIsPaused(false)}
                  onClick={() => {
                    setActiveFeature(feature);
                    setIsPaused(true);
                  }}
                  style={{
                    position: "absolute",
                    left: initialCx,
                    top: initialCy,
                    transform: "translate(-50%, -50%)",
                    zIndex: 30,
                    transition:
                      "box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
                    willChange: "left, top",
                  }}
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                    isActive
                      ? "scale-110 border-primary/40 bg-primary-gradient text-white shadow-glow"
                      : "border-border/60 bg-background/80 text-muted-foreground shadow-soft backdrop-blur-xl hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />

                  <span
                    ref={(el) => {
                      labelRefs.current[index] = el;
                    }}
                    className={`pointer-events-none absolute top-[60px] whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      isActive
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border/60 bg-background/90 text-muted-foreground"
                    }`}
                  >
                    {feature.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feature detail card */}
          <div className="w-full max-w-xl lg:max-w-none lg:flex-1">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-elegant backdrop-blur-xl sm:p-8"
            >
              <motion.div
                key={`icon-${activeFeature.id}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow sm:h-14 sm:w-14"
              >
                <activeFeature.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </motion.div>

              <motion.div
                key={`badge-${activeFeature.id}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-4 inline-flex rounded-full border border-border/60 bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"
              >
                {activeFeature.status}
              </motion.div>

              <motion.h3
                key={`title-${activeFeature.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl"
              >
                {activeFeature.title}
              </motion.h3>

              <motion.p
                key={`desc-${activeFeature.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className="mt-3 text-sm leading-relaxed text-muted-foreground"
              >
                {activeFeature.desc}
              </motion.p>

              <motion.div
                key={`bar-${activeFeature.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.16 }}
                className="mt-6"
              >
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>AI usefulness</span>
                  <span className="font-semibold text-foreground">
                    {activeFeature.energy}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeFeature.energy}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-full bg-primary-gradient"
                  />
                </div>
              </motion.div>

              <div className="mt-6 flex items-center gap-2">
                {features.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-label={`Show ${f.title}`}
                    onClick={() => {
                      setActiveFeature(f);
                      setIsPaused(true);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeFeature.id === f.id
                        ? "w-6 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoDemo() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      id="demo"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Live Demo
        </p>

        <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
          Watch how <span className="text-gradient italic">FetchCart AI</span>{" "}
          works
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          See how FetchCart searches, compares, tracks prices, and helps you
          find the best product faster.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative mt-8 rounded-[1.5rem] border border-border/60 bg-background p-1.5 shadow-elegant sm:mt-12 sm:rounded-[2rem] sm:p-2"
        >
          <button
            onClick={() => setIsVideoOpen(true)}
            className="group relative block aspect-video w-full overflow-hidden rounded-[1.15rem] bg-card sm:rounded-[1.5rem]"
            aria-label="Play FetchCart AI demo"
          >
            <img
              src="https://startup-template-sage.vercel.app/hero-light.png"
              alt="FetchCart AI demo preview"
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-75 dark:hidden"
            />

            <img
              src="https://startup-template-sage.vercel.app/hero-dark.png"
              alt="FetchCart AI demo preview"
              className="hidden h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-75 dark:block"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 sm:h-28 sm:w-28">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-gradient shadow-glow sm:h-20 sm:w-20">
                  <Play className="h-8 w-8 translate-x-0.5 fill-white text-white" />
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-black shadow-elegant"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>

              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
                title="FetchCart AI demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Showcase() {
  const products = [
    {
      name: "Sony WH-1000XM5",
      category: "Audio",
      price: "$329",
      was: "$399",
      rating: 4.8,
      ai: 9.6,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
      url: "https://amazon.in/Sony-WH-1000XM5-Wireless-Cancelling-Headphones/dp/B09XS7JWHH?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A1TAQZVKEMWXY8",
    },
    {
      name: "iPhone 15 Pro",
      category: "Phones",
      price: "$999",
      was: "$1099",
      rating: 4.9,
      ai: 9.8,
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
      url: "https://www.croma.com/apple-iphone-15-256gb-blue-/p/300738?srsltid=AfmBOoq7Hqntm3e7_Rg0lx2TOAwBtSNp5gU8Y5jBQXMTWdzW1vCf7Lou-tc",
    },
    {
      name: "Mi MJSTL Robotic Floor Cleaner",
      category: "Home",
      price: "$649",
      was: "$749",
      rating: 4.7,
      ai: 9.2,
      image:
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1200&auto=format&fit=crop",
      url: "https://www.flipkart.com/mi-mjstl-robotic-floor-cleaner-2-in-1-mopping-vacuum-2200-pa-powerful-suction-450-ml-large-capacity-dustbin-electronically-controlled-270-water-tank-wifi-connectivity-google-assistant-alexa/p/itm7a905a2e05e75",
    },
    {
      name: "Nike Pegasus 41",
      category: "Footwear",
      price: "$129",
      was: "$140",
      rating: 4.6,
      ai: 9.0,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      url: "https://www.footlocker.co.in/nike-men-pegasus-41-sneakers/p/22965709",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-12 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Picks of the week
            </p>

            <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Trending <span className="text-gradient italic">discoveries</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            Curated by our AI from millions of products, reviews, ratings, and
            real-time pricing insights.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="relative aspect-[0.95] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-900 shadow-soft backdrop-blur">
                  <Sparkles className="h-3 w-3 text-primary" />
                  AI {product.ai}
                </div> */}

                <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                  {product.category}
                </div>

                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-4 top-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </a>
              </div>

              <div className="p-5">
                <h3 className="font-semibold tracking-tight text-foreground">
                  {product.name}
                </h3>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />

                  <span>{product.rating}</span>

                  <span>·</span>

                  <span>2.4k reviews</span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <span className="text-xl font-semibold">
                      {product.price}
                    </span>

                    <span className="ml-2 text-xs text-muted-foreground line-through">
                      {product.was}
                    </span>
                  </div>

                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-primary-gradient px-3 py-2 text-xs font-medium text-white shadow-soft transition-all duration-300 hover:shadow-glow"
                  >
                    View
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      desc: "Perfect for casual shoppers exploring smarter discovery.",
      features: [
        "50 AI searches / month",
        "Basic comparisons",
        "Deal detection",
        "Email price alerts",
      ],
      cta: "Start free",
      featured: false,
    },
    {
      name: "Pro",
      price: "₹99",
      period: "per month",
      desc: "For power shoppers who want the full assistant.",
      features: [
        "Unlimited AI searches",
        "Advanced comparisons",
        "Real-time price tracking",
        "Personalized recommendations",
        "Priority support",
      ],
      cta: "Upgrade to Pro",
      featured: true,
    },
    {
      name: "Max",
      price: "₹249",
      period: "per month",
      desc: "Procurement and resellers — share insights across your team.",
      features: [
        "Everything in Pro",
        "5 member seats",
        "Bulk price tracking",
        "API access",
        "Dedicated success manager",
      ],
      cta: "Contact sales",
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Simple, <span className="text-gradient italic">honest pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you are ready. Cancel anytime.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 md:mt-14 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className={`relative rounded-3xl p-6 transition-shadow sm:p-8 ${
                plan.featured
                  ? "bg-foreground text-background shadow-elegant"
                  : "glass shadow-soft hover:shadow-elegant"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider bg-primary-gradient text-white px-3 py-1 rounded-full shadow-glow">
                  Recommended
                </span>
              )}

              <h3 className="text-lg font-semibold tracking-tight">
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl sm:text-5xl">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.featured
                      ? "text-background/60"
                      : "text-muted-foreground"
                  }`}
                >
                  / {plan.period}
                </span>
              </div>

              <p
                className={`mt-3 text-sm ${
                  plan.featured ? "text-background/70" : "text-muted-foreground"
                }`}
              >
                {plan.desc}
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.featured ? "bg-background/15" : "bg-accent"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-2xl font-medium transition-all ${
                  plan.featured
                    ? "bg-primary-gradient text-white shadow-elegant hover:shadow-glow"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: "Aarav Mehta",
      role: "Designer, Mumbai",
      text: "FetchCart found me a 4K monitor cheaper than what I had already added to cart.",
      initials: "AM",
    },
    {
      name: "Sara Khan",
      role: "Marketer, Bangalore",
      text: "I just type what I want in plain English and it actually understands.",
      initials: "SK",
    },
    {
      name: "Liam Chen",
      role: "Engineer, Singapore",
      text: "The price tracking alone is worth it. Got pinged the moment my headphones dropped.",
      initials: "LC",
    },
    {
      name: "Priya Raj",
      role: "Founder, Delhi",
      text: "Beautiful product. Comparisons are clear and recommendations feel personal.",
      initials: "PR",
    },
    {
      name: "Noah Park",
      role: "Student, Seoul",
      text: "I trust the AI score more than star ratings now.",
      initials: "NP",
    },
    {
      name: "Maya Iyer",
      role: "PM, Hyderabad",
      text: "Switched my whole household onto FetchCart. Even my parents use it.",
      initials: "MI",
    },
  ];

  const row1 = reviews;
  const row2 = [...reviews].reverse();

  const ReviewCard = ({ review }: { review: (typeof reviews)[number] }) => (
    <div className="mx-2 w-[280px] shrink-0 rounded-3xl border border-border/60 bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:mx-3 sm:w-[320px] sm:p-6">
      <div className="flex items-center gap-1 text-primary">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} className="h-3.5 w-3.5 fill-current" />
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground/80">
        “{review.text}”
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-gradient text-xs font-semibold text-white">
          {review.initials}
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">
            {review.name}
          </div>

          <div className="text-xs text-muted-foreground">{review.role}</div>
        </div>
      </div>
    </div>
  );

  const MarqueeRow = ({
    data,
    reverse = false,
  }: {
    data: typeof reviews;
    reverse?: boolean;
  }) => {
    const duplicated = [...data, ...data];

    return (
      <div className="relative overflow-hidden">
        {/* smooth left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-background to-transparent sm:w-24" />

        {/* smooth right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-background to-transparent sm:w-24" />

        <div
          className="flex w-max"
          style={{
            animation: `testimonial-scroll 32s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {duplicated.map((review, index) => (
            <ReviewCard key={`${review.name}-${index}`} review={review} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Loved by shoppers
          </p>

          <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
            People who finally{" "}
            <span className="text-gradient italic">love shopping</span>
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:mt-14 sm:gap-6">
          <MarqueeRow data={row1} />
          <MarqueeRow data={row2} reverse />
        </div>
      </div>

      <style>
        {`
          @keyframes testimonial-scroll {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </section>
  );
}

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-background px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="mx-auto flex max-w-5xl flex-col items-center rounded-[2rem] border border-border/60 bg-card px-5 py-12 text-center shadow-elegant sm:rounded-[2.5rem] sm:px-10 sm:py-16 md:py-20"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Smarter shopping starts here
        </div>

        <h2 className="max-w-3xl font-display text-3xl tracking-tight sm:text-4xl md:text-6xl">
          Start finding the <span className="text-gradient italic">right</span>{" "}
          products faster
        </h2>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Search, compare, track prices, and discover better deals across major
          marketplaces with one intelligent shopping assistant.
        </p>

        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center">
          <button
            onClick={() => navigate("/search")}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              document.getElementById("demo")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="inline-flex items-center justify-center rounded-2xl border border-border/70 bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent"
          >
            Watch demo
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>No credit card required</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>Free forever</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>Cancel anytime</span>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Reviews", href: "#reviews" },
        { label: "Demo", href: "#demo" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "#" },
        { label: "API", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ];

  const socials = [
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
  ];

  const AnimatedContainer = ({
    children,
    delay = 0,
    className = "",
  }: {
    children: ReactNode;
    delay?: number;
    className?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.65 }}
      className={className}
    >
      {children}
    </motion.div>
  );

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-5 md:gap-12">
          <AnimatedContainer className="md:col-span-2">
            <a
              href="#"
              className="inline-flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow">
                <img src="/Logo3880.svg" alt="" />
              </span>

              <span>
                FetchCart <span className="text-gradient">AI</span>
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The AI shopping assistant that searches, compares, tracks prices,
              and finds better deals across every major marketplace.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-card text-muted-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-foreground hover:shadow-soft"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </AnimatedContainer>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-3">
            {footerLinks.map((col, index) => (
              <AnimatedContainer key={col.title} delay={0.08 + index * 0.08}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">
                  {col.title}
                </h4>

                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-border/60 pt-6">
          <AnimatedContainer
            delay={0.2}
            className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center"
          >
            <p>
              © {new Date().getFullYear()} FetchCart AI. All rights reserved.
            </p>
            <p>Crafted for shoppers who care.</p>
          </AnimatedContainer>
        </div>
      </div>
    </footer>
  );
}
