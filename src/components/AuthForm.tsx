
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("register") ? "register" : "login";
  const [tab, setTab] = useState(defaultTab);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: searchParams.get("ref") || "",
  });
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle authentication with Supabase
    
    toast({
      title: "Login successful",
      description: "Welcome back to Vamna Fragrances.",
    });
    
    // Redirect to dashboard after login
    navigate("/dashboard");
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would handle registration with Supabase
    
    toast({
      title: "Registration successful",
      description: "Welcome to Vamna Fragrances. You can now log in.",
    });
    
    // Switch to login tab after successful registration
    setTab("login");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-medium text-center">
            {tab === "login" ? "Welcome Back" : "Join Our Team"}
          </CardTitle>
          <CardDescription className="text-center">
            {tab === "login" 
              ? "Sign in to your consultant account" 
              : "Begin your journey as a Vamna Fragrances consultant"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={tab}
            value={tab}
            onValueChange={setTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a 
                      href="#" 
                      className="text-xs text-accent hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle forgot password
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      placeholder="Your first name"
                      required
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      placeholder="Your last name"
                      required
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referral-code">Referral Code (Optional)</Label>
                  <Input 
                    id="referral-code"
                    placeholder="Enter referral code if you have one"
                    value={registerForm.referralCode}
                    onChange={(e) => setRegisterForm({...registerForm, referralCode: e.target.value})}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our
            {" "}
            <a href="/terms" className="text-accent hover:underline">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
