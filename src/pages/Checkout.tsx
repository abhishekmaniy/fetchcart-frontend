import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Truck, Shield, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("cart");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const [cartItems] = useState([
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      originalPrice: 149.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      store: "Amazon"
    },
    {
      id: "2",
      name: "Smart Fitness Tracker",
      price: 129.99,
      originalPrice: 199.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop",
      store: "Best Buy"
    }
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) - item.price) * item.quantity, 0);
  const shipping = shippingMethod === "express" ? 15.99 : shippingMethod === "overnight" ? 29.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    // Simulate order processing
    setStep("confirmation");
    toast({
      title: "Order Placed Successfully!",
      description: "You'll receive a confirmation email shortly."
    });
  };

  const renderCartReview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-muted-foreground">Sold by {item.store}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-bold">${item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${item.originalPrice}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Savings</span>
                <span>-${savings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderShippingForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="123 Main Street" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="New York" />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" placeholder="10001" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Shipping Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Standard Shipping</div>
                    <div className="text-sm text-muted-foreground">5-7 business days</div>
                  </div>
                  <div className="font-bold text-green-600">FREE</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="express" id="express" />
              <Label htmlFor="express" className="flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Express Shipping</div>
                    <div className="text-sm text-muted-foreground">2-3 business days</div>
                  </div>
                  <div className="font-bold">$15.99</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="overnight" id="overnight" />
              <Label htmlFor="overnight" className="flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Overnight Shipping</div>
                    <div className="text-sm text-muted-foreground">Next business day</div>
                  </div>
                  <div className="font-bold">$29.99</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Credit/Debit Card</span>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">P</div>
                  <span>PayPal</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          {paymentMethod === "card" && (
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Doe" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-green-800">Purchase Protection</div>
              <div className="text-sm text-green-600">Your order is protected by our guarantee</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm">
              I agree to the Terms of Service and Privacy Policy
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed!</h2>
        <p className="text-muted-foreground">Thank you for your purchase</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="font-medium">Order Number:</span>
              <span>#FC-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Estimated Delivery:</span>
              <span>
                {shippingMethod === "overnight" ? "Tomorrow" : 
                 shippingMethod === "express" ? "2-3 days" : "5-7 days"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={() => navigate("/dashboard")} className="w-full">
        Continue Shopping
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => step === "cart" ? navigate("/dashboard") : setStep("cart")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        {step !== "confirmation" && (
          <div className="flex items-center justify-center space-x-8 mb-8">
            {["cart", "shipping", "payment"].map((stepName, index) => (
              <div key={stepName} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === stepName ? "bg-primary text-primary-foreground" :
                  ["cart", "shipping", "payment"].indexOf(step) > index ? "bg-green-500 text-white" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {["cart", "shipping", "payment"].indexOf(step) > index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`capitalize ${
                  step === stepName ? "text-primary font-medium" : "text-muted-foreground"
                }`}>
                  {stepName}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "cart" && renderCartReview()}
            {step === "shipping" && renderShippingForm()}
            {step === "payment" && renderPaymentForm()}
            {step === "confirmation" && renderConfirmation()}
          </div>

          {step !== "confirmation" && (
            <div className="space-y-6">
              {/* Order Summary Sidebar */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Savings</span>
                        <span>-${savings.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => {
                      if (step === "cart") setStep("shipping");
                      else if (step === "shipping") setStep("payment");
                      else if (step === "payment") handlePlaceOrder();
                    }}
                  >
                    {step === "cart" && "Continue to Shipping"}
                    {step === "shipping" && "Continue to Payment"}
                    {step === "payment" && "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;