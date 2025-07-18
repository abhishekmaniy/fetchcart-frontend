import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, CheckCircle, AlertTriangle, XCircle, Camera, Upload, Star, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthenticityResult {
  overallScore: number;
  productAuthenticity: "genuine" | "suspicious" | "fake";
  sellerReputation: "excellent" | "good" | "poor" | "unknown";
  checks: {
    name: string;
    status: "pass" | "warning" | "fail";
    message: string;
  }[];
  sellerInfo: {
    name: string;
    rating: number;
    reviews: number;
    memberSince: string;
    verificationLevel: "verified" | "basic" | "new";
  };
}

const AuthenticityCheck = () => {
  const [productUrl, setProductUrl] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AuthenticityResult | null>(null);
  const { toast } = useToast();

  const mockResult: AuthenticityResult = {
    overallScore: 85,
    productAuthenticity: "genuine",
    sellerReputation: "good",
    checks: [
      {
        name: "Product Images",
        status: "pass",
        message: "High-quality official product images detected"
      },
      {
        name: "Price Analysis",
        status: "warning",
        message: "Price is slightly below market average"
      },
      {
        name: "Product Description",
        status: "pass",
        message: "Detailed and accurate product description"
      },
      {
        name: "Seller Verification",
        status: "pass",
        message: "Seller has verified business credentials"
      },
      {
        name: "Customer Reviews",
        status: "warning",
        message: "Some recent negative reviews about shipping"
      },
      {
        name: "Return Policy",
        status: "pass",
        message: "Clear and customer-friendly return policy"
      }
    ],
    sellerInfo: {
      name: "TechWorld Electronics",
      rating: 4.3,
      reviews: 12847,
      memberSince: "2019",
      verificationLevel: "verified"
    }
  };

  const handleAnalyze = async () => {
    if (!productUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a product URL to analyze authenticity.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setResult(mockResult);
    setIsAnalyzing(false);
    toast({
      title: "Analysis Complete!",
      description: "Authenticity check results are ready."
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAuthenticityColor = (authenticity: string) => {
    switch (authenticity) {
      case "genuine":
        return "text-green-600 bg-green-50 border-green-200";
      case "suspicious":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "fake":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getReputationColor = (reputation: string) => {
    switch (reputation) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="h-8 w-8 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Authenticity Check</h2>
        </div>
        <p className="text-muted-foreground">
          Verify product authenticity and seller reputation before you buy
        </p>
      </div>

      {/* Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Product & Seller Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product-url">Product URL</Label>
            <Input
              id="product-url"
              placeholder="Paste product URL to analyze authenticity..."
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="additional-info">Additional Information (Optional)</Label>
            <Textarea
              id="additional-info"
              placeholder="Any concerns or specific details you'd like us to check..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Product Images (Optional)</Label>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleAnalyze}
            className="w-full"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Shield className="h-4 w-4 mr-2 animate-spin" />
                Analyzing authenticity...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Check Authenticity
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-4xl font-bold text-primary">{result.overallScore}/100</div>
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <Badge className={`text-lg px-4 py-2 ${getAuthenticityColor(result.productAuthenticity)}`}>
                    Product appears {result.productAuthenticity.toUpperCase()}
                  </Badge>
                  
                  <div className={`text-lg font-semibold ${getReputationColor(result.sellerReputation)}`}>
                    Seller reputation: {result.sellerReputation.toUpperCase()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.checks.map((check, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-lg">
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <div className="font-medium">{check.name}</div>
                    <div className="text-sm text-muted-foreground">{check.message}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Seller Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">{result.sellerInfo.name}</div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{result.sellerInfo.rating}</span>
                    <span className="text-muted-foreground">
                      ({result.sellerInfo.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>
                
                <Badge 
                  variant={result.sellerInfo.verificationLevel === "verified" ? "default" : "secondary"}
                >
                  {result.sellerInfo.verificationLevel === "verified" ? "✓ Verified" : "Basic"}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Member since {result.sellerInfo.memberSince}
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Safety Recommendations</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use secure payment methods</li>
                  <li>• Check return and refund policies</li>
                  <li>• Read recent customer reviews</li>
                  <li>• Compare prices with other sellers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AuthenticityCheck;