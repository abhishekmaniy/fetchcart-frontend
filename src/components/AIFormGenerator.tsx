import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export interface FieldSchema {
  name: string;
  type: "text" | "slider" | "checkbox" | "select" | "radio";
  label: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

interface AIFormGeneratorProps {
  query: string;
  onSubmit: (data: Record<string, unknown>) => void;
  onBack: () => void;
  formSchema: FieldSchema[];
  isSubmitting?: boolean;
}

const AIFormGenerator = ({
  query,
  onSubmit,
  onBack,
  formSchema,
  isSubmitting = false,
}: AIFormGeneratorProps) => {
  const initialFormData = useMemo(() => {
    if (!Array.isArray(formSchema)) return {};

    return formSchema.reduce<Record<string, unknown>>((acc, field) => {
      if (field.type === "checkbox") {
        acc[field.name] = [];
      } else if (field.type === "slider") {
        acc[field.name] = field.min ?? 0;
      } else {
        acc[field.name] = "";
      }

      return acc;
    }, {});
  }, [formSchema]);

  const [formData, setFormData] =
    useState<Record<string, unknown>>(initialFormData);

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: string,
    option: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const current = Array.isArray(prev[name]) ? (prev[name] as string[]) : [];

      return {
        ...prev,
        [name]: checked
          ? [...current, option]
          : current.filter((value) => value !== option),
      };
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!Array.isArray(formSchema)) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Invalid form schema received.
      </div>
    );
  }

  return (
    <section className="relative px-1 py-8 sm:px-0 sm:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-24 -top-24 h-[220px] w-[220px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-20 blur-2xl sm:h-[250px] sm:w-[250px]"
          animate={{ scale: [0.8, 1], opacity: [0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute right-0 top-1/2 h-[160px] w-[160px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-20 blur-2xl sm:h-[180px] sm:w-[180px]"
          animate={{ scale: [0.7, 1.1], opacity: [0.4, 0.7] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl space-y-6 sm:space-y-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            disabled={isSubmitting}
            className="shrink-0 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 shrink-0 text-primary" />
              <h2 className="bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                Refine Your Search
              </h2>
            </div>

            <p className="text-sm text-muted-foreground sm:text-base">
              Help us understand your preferences better.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
          <Label className="text-sm font-medium text-muted-foreground">
            Your search:
          </Label>
          <p className="mt-1 text-sm leading-relaxed text-foreground sm:text-base">
            {query}
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {formSchema.map((field) => {
            const value = formData[field.name];

            if (field.type === "slider") {
              return (
                <div
                  key={field.name}
                  className="rounded-2xl border border-border/60 bg-card/60 p-4"
                >
                  <Label className="font-semibold">{field.label}</Label>

                  <div className="mt-4">
                    <Slider
                      value={[Number(value) || field.min || 0]}
                      onValueChange={(val) => handleChange(field.name, val[0])}
                      min={field.min ?? 0}
                      max={field.max ?? 100}
                      step={field.step ?? 1}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground">
                    Selected: ₹{String(value)}
                  </div>
                </div>
              );
            }

            if (field.type === "checkbox") {
              const selectedValues = Array.isArray(value)
                ? (value as string[])
                : [];

              return (
                <div
                  key={field.name}
                  className="rounded-2xl border border-border/60 bg-card/60 p-4"
                >
                  <Label className="font-semibold">{field.label}</Label>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {field.options?.map((option) => (
                      <div
                        key={option}
                        className="flex items-center space-x-2 rounded-xl border border-border/50 bg-background/50 px-3 py-2"
                      >
                        <Checkbox
                          id={`${field.name}-${option}`}
                          checked={selectedValues.includes(option)}
                          disabled={isSubmitting}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              field.name,
                              option,
                              Boolean(checked),
                            )
                          }
                        />

                        <Label
                          htmlFor={`${field.name}-${option}`}
                          className="cursor-pointer text-sm"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (field.type === "radio") {
              return (
                <div
                  key={field.name}
                  className="rounded-2xl border border-border/60 bg-card/60 p-4"
                >
                  <Label className="font-semibold">{field.label}</Label>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {field.options?.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={value === option ? "default" : "outline"}
                        disabled={isSubmitting}
                        onClick={() => handleChange(field.name, option)}
                        className="rounded-xl"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            }

            if (field.type === "select") {
              return (
                <div
                  key={field.name}
                  className="space-y-2 rounded-2xl border border-border/60 bg-card/60 p-4"
                >
                  <Label htmlFor={field.name} className="font-semibold">
                    {field.label}
                  </Label>

                  <select
                    id={field.name}
                    value={String(value ?? "")}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div
                key={field.name}
                className="space-y-2 rounded-2xl border border-border/60 bg-card/60 p-4"
              >
                <Label htmlFor={field.name} className="font-semibold">
                  {field.label}
                </Label>

                <Input
                  id={field.name}
                  value={String(value ?? "")}
                  disabled={isSubmitting}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="rounded-xl"
                />
              </div>
            );
          })}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 font-semibold text-white shadow-lg transition-transform hover:scale-[1.01]"
          size="lg"
        >
          {isSubmitting ? "Creating Search..." : "Find My Perfect Products"}
        </Button>
      </div>
    </section>
  );
};

export default AIFormGenerator;