import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import SearchLoadingAnimation from "@/components/SearchLoadingAnimation";
import AIFormGenerator, { FieldSchema } from "@/components/AIFormGenerator";
import { motion } from "framer-motion";
import {
  useCreateSearchMutation,
  useGenerateSearchFormMutation,
} from "@/hooks/useSearchMutations";

type SearchPhase = "input" | "generating-form" | "form" | "creating-search";

const suggestions = [
  "Best laptop for college students",
  "Gaming setup under ₹50000",
  "Affordable smartwatches",
  "Noise-cancelling earbuds",
  "Professional camera for beginners",
  "Eco-friendly cleaning products",
];

const SearchInterface = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchPhase, setSearchPhase] = useState<SearchPhase>("input");
  const [generatedForm, setGeneratedForm] = useState<FieldSchema[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateSearchFormMutation = useGenerateSearchFormMutation();
  const createSearchMutation = useCreateSearchMutation();

  const isLoading =
    searchPhase === "generating-form" || searchPhase === "creating-search";

  const handleSearch = async () => {
    const query = searchQuery.trim();

    if (!query || isLoading) return;

    try {
      setError(null);
      setSearchPhase("generating-form");

      const data = await generateSearchFormMutation.mutateAsync({ query });

      const formSchema = Array.isArray(data.formSchema) ? data.formSchema : [];

      setGeneratedForm(formSchema);

      if (formSchema.length === 0) {
        await createSearchJob({});
        return;
      }

      setSearchPhase("form");
    } catch (error) {
      console.error("Generate form error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating form",
      );

      setSearchPhase("input");
    }
  };

  const createSearchJob = async (filters: Record<string, unknown>) => {
    try {
      setError(null);
      setSearchPhase("creating-search");

      const data = await createSearchMutation.mutateAsync({
        query: searchQuery.trim(),
        filters,
      });

      const searchId = data?.search?.id;

      if (!searchId) {
        throw new Error("Search ID not found in response");
      }

      navigate(`/search/${searchId}`);
    } catch (error) {
      console.error("Create search job error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating search",
      );

      setSearchPhase(generatedForm.length > 0 ? "form" : "input");
    }
  };

  const handleFormSubmit = async (rawFormData: Record<string, unknown>) => {
    const allowedFieldNames = new Set(generatedForm.map((field) => field.name));

    const filteredFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([key]) => allowedFieldNames.has(key)),
    );

    await createSearchJob(filteredFormData);
  };

  if (searchPhase === "generating-form") {
    return <SearchLoadingAnimation query={searchQuery} />;
  }

  if (searchPhase === "form") {
    return (
      <AIFormGenerator
        query={searchQuery}
        formSchema={generatedForm}
        isSubmitting={searchPhase === "creating-search"}
        onSubmit={handleFormSubmit}
        onBack={() => setSearchPhase("input")}
      />
    );
  }

  if (searchPhase === "creating-search") {
    return (
      <section className="flex min-h-full flex-col items-center justify-center gap-6 px-3 text-center">
        <motion.div
          animate={{ scale: [0.9, 1.05], opacity: [0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-gradient shadow-glow sm:h-20 sm:w-20"
        >
          <ShoppingBag className="h-8 w-8 text-white sm:h-9 sm:w-9" />
        </motion.div>

        <div className="w-full max-w-2xl px-2">
          <h3 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            Creating your{" "}
            <span className="text-gradient italic">live search</span>
          </h3>

          <p className="mt-3 text-sm text-muted-foreground">
            Preparing your product search workspace...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-full w-full flex-col items-center justify-center overflow-x-hidden py-6 sm:py-8">
      <div className="w-full max-w-3xl px-2 text-center sm:px-0">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow sm:mb-6 sm:h-14 sm:w-14">
          <Sparkles className="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </div>

        <div className="glass inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground shadow-soft">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary" />
          <span className="truncate">AI-powered product discovery</span>
        </div>

        <h1 className="mx-auto mt-5 max-w-[320px] text-center font-display text-[2.15rem] leading-[1.14] tracking-tight sm:max-w-3xl sm:text-6xl sm:leading-[1.08]">
          What are you{" "}
          <span className="text-gradient italic">shopping for?</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[320px] text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:max-w-2xl sm:text-lg">
          Describe your need naturally. FetchCart AI will understand your
          budget, use-case, preferences, and find the best products.
        </p>
      </div>

      <div className="mt-8 w-full max-w-3xl space-y-5 px-1 sm:mt-10 sm:px-0">
        <div className="glass relative rounded-[1.5rem] p-2.5 shadow-elegant sm:rounded-[1.75rem] sm:p-3">
          <Textarea
            placeholder="e.g., I need wireless headphones under ₹2000 with good noise cancellation for working from home..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-h-[130px] resize-none rounded-2xl border-border/60 bg-card/70 px-4 py-4 pr-14 text-sm leading-relaxed shadow-none focus-visible:ring-primary sm:min-h-[145px] sm:px-5 sm:py-5 sm:pr-16 sm:text-base"
          />

          <Button
            size="icon"
            className="absolute bottom-5 right-5 h-10 w-10 rounded-2xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow sm:bottom-6 sm:right-6 sm:h-11 sm:w-11"
            onClick={handleSearch}
            disabled={
              !searchQuery.trim() ||
              isLoading ||
              generateSearchFormMutation.isPending ||
              createSearchMutation.isPending
            }
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery(suggestion)}
              className="shrink-0 rounded-full border-border/70 bg-card/60 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {suggestion}
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchInterface;