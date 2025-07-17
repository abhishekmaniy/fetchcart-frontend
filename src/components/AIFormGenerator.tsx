
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Sparkles } from "lucide-react";

interface AIFormGeneratorProps {
  query: string;
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const AIFormGenerator = ({ query, onSubmit, onBack }: AIFormGeneratorProps) => {
  const [budget, setBudget] = useState([500]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [urgency, setUrgency] = useState("flexible");

  const features = [
    "Noise Cancellation",
    "Wireless/Bluetooth",
    "Long Battery Life",
    "Comfortable Fit",
    "Premium Sound Quality",
    "Durable Build",
    "Quick Charging",
    "Voice Assistant"
  ];

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, feature]);
    } else {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    }
  };

  const handleSubmit = () => {
    const formData = {
      budget: budget[0],
      features: selectedFeatures,
      brand,
      urgency,
      originalQuery: query
    };
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Refine Your Search</h2>
          </div>
          <p className="text-muted-foreground">
            Based on your request, help us find the perfect match
          </p>
        </div>
      </div>

      {/* Original Query */}
      <div className="bg-secondary/30 p-4 rounded-lg">
        <Label className="text-sm font-medium text-muted-foreground">Your search:</Label>
        <p className="mt-1">{query}</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Budget */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Budget Range</Label>
          <div className="px-3">
            <Slider
              value={budget}
              onValueChange={setBudget}
              max={2000}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>$0</span>
              <span className="font-medium">Up to ${budget[0]}</span>
              <span>$2000+</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Important Features</Label>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                />
                <Label
                  htmlFor={feature}
                  className="text-sm font-normal cursor-pointer"
                >
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Preference */}
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-base font-semibold">
            Preferred Brand (Optional)
          </Label>
          <Input
            id="brand"
            placeholder="e.g., Sony, Apple, Bose..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        {/* Urgency */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">When do you need this?</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "urgent", label: "ASAP" },
              { value: "soon", label: "This week" },
              { value: "flexible", label: "Flexible" }
            ].map((option) => (
              <Button
                key={option.value}
                variant={urgency === option.value ? "default" : "outline"}
                onClick={() => setUrgency(option.value)}
                className="w-full"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button onClick={handleSubmit} className="w-full" size="lg">
        Find My Perfect Products
      </Button>
    </div>
  );
};

export default AIFormGenerator;
