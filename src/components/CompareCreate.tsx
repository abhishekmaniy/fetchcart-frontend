import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GitCompareArrows,
  Link2,
  Shuffle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateCompareMutation } from "@/hooks/useCompareMutations";

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const CompareCreate = () => {
  const navigate = useNavigate();

  const [firstUrl, setFirstUrl] = useState("");
  const [secondUrl, setSecondUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createCompareMutation = useCreateCompareMutation();

  const isCreating = createCompareMutation.isPending;

  const firstUrlValue = firstUrl.trim();
  const secondUrlValue = secondUrl.trim();

  const isFirstUrlValid = useMemo(() => {
    if (!firstUrlValue) return true;
    return isValidUrl(firstUrlValue);
  }, [firstUrlValue]);

  const isSecondUrlValid = useMemo(() => {
    if (!secondUrlValue) return true;
    return isValidUrl(secondUrlValue);
  }, [secondUrlValue]);

  const hasDuplicateUrls =
    Boolean(firstUrlValue) &&
    Boolean(secondUrlValue) &&
    firstUrlValue === secondUrlValue;

  const canSubmit =
    Boolean(firstUrlValue) &&
    Boolean(secondUrlValue) &&
    isFirstUrlValid &&
    isSecondUrlValid &&
    !hasDuplicateUrls &&
    !isCreating;

  const handleSwapUrls = () => {
    setFirstUrl(secondUrl);
    setSecondUrl(firstUrl);
    setError(null);
  };

  const handleCreateComparison = async () => {
    if (isCreating) return;

    if (!firstUrlValue || !secondUrlValue) {
      setError("Please enter both product URLs.");
      return;
    }

    if (!isFirstUrlValid || !isSecondUrlValid) {
      setError("Please enter valid product URLs.");
      return;
    }

    if (hasDuplicateUrls) {
      setError("Please enter two different product URLs.");
      return;
    }

    try {
      setError(null);

      const data = await createCompareMutation.mutateAsync({
        source: "PRODUCT_URLS",
        productUrls: [firstUrlValue, secondUrlValue],
      });

      const compareId = data?.compare?.id;

      if (!compareId) {
        throw new Error("Comparison ID not found in response.");
      }

      navigate(`/compare/${compareId}`);
    } catch (error) {
      console.error("Create comparison error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating comparison.",
      );
    }
  };

  if (isCreating) {
    return (
      <section className="flex min-h-full flex-col items-center justify-center gap-6 px-3 text-center">
        <motion.div
          animate={{ scale: [0.9, 1.05], opacity: [0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-gradient shadow-glow sm:h-20 sm:w-20"
        >
          <GitCompareArrows className="h-8 w-8 text-white sm:h-9 sm:w-9" />
        </motion.div>

        <div className="w-full max-w-2xl px-2">
          <h3 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            Creating your{" "}
            <span className="text-gradient italic">comparison</span>
          </h3>

          <p className="mt-3 text-sm text-muted-foreground">
            Extracting product details and preparing your comparison...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-full w-full flex-col items-center justify-center overflow-x-hidden py-6 sm:py-8">
      <div className="w-full max-w-4xl px-2 text-center sm:px-0">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow sm:mb-6 sm:h-14 sm:w-14">
          <GitCompareArrows className="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </div>

        <div className="glass inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground shadow-soft">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary" />
          <span className="truncate">AI-powered product comparison</span>
        </div>

        <h1 className="mx-auto mt-5 max-w-[340px] text-center font-display text-[2.05rem] leading-[1.14] tracking-tight sm:max-w-4xl sm:text-6xl sm:leading-[1.08]">
          Compare two products{" "}
          <span className="text-gradient italic">side by side</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[340px] text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:max-w-2xl sm:text-lg">
          Paste two product links and get a clear AI comparison with pricing,
          specs, features, pros, cons, and the better choice.
        </p>
      </div>

      <div className="mt-8 w-full max-w-5xl px-1 sm:mt-10 sm:px-0">
        <div className="glass relative overflow-hidden rounded-[1.5rem] p-3 shadow-elegant sm:rounded-[2rem] sm:p-6">
          <div className="pointer-events-none absolute -left-24 -top-24 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="relative grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <UrlInput
              value={firstUrl}
              isValid={isFirstUrlValid}
              placeholder="Paste first product URL..."
              onChange={(value) => {
                setFirstUrl(value);
                setError(null);
              }}
            />

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleSwapUrls}
                className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-card/70 text-muted-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-primary sm:h-12 sm:w-12"
                title="Swap URLs"
              >
                <Shuffle className="h-5 w-5 transition-transform group-hover:rotate-180" />
              </button>
            </div>

            <UrlInput
              value={secondUrl}
              isValid={isSecondUrlValid}
              placeholder="Paste second product URL..."
              onChange={(value) => {
                setSecondUrl(value);
                setError(null);
              }}
            />
          </div>

          {hasDuplicateUrls && (
            <p className="relative mt-3 text-sm text-red-500">
              Please enter two different product URLs.
            </p>
          )}

          {error && (
            <div className="relative mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="relative mt-5 flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={handleCreateComparison}
              className="h-12 rounded-2xl bg-primary-gradient px-7 text-white shadow-elegant hover:shadow-glow"
            >
              Generate Comparison
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const UrlInput = ({
  value,
  placeholder,
  isValid,
  onChange,
}: {
  value: string;
  placeholder: string;
  isValid: boolean;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="relative">
      <Link2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-5 sm:h-5 sm:w-5" />

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-14 w-full rounded-2xl border bg-background/75 py-4 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-primary/15 sm:h-16 sm:rounded-3xl sm:py-5 sm:pl-14 sm:pr-5 sm:text-base ${
          isValid ? "border-border/70" : "border-red-500/50"
        }`}
      />

      {!isValid && (
        <p className="mt-2 pl-2 text-xs text-red-500">
          Please enter a valid URL.
        </p>
      )}
    </div>
  );
};

export default CompareCreate;