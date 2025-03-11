import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("register") ? "register" : "login";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to dashboard
        navigate("/dashboard");
      } else {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate("/dashboard");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-24 bg-accent/5">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-foreground/70 hover:text-accent transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-md">
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">
                  Join Our Network of Successful Consultants
                </h1>
                <p className="text-foreground/70 mb-8">
                  Create your account today and start your journey as a Vamna Fragrances consultant. Enjoy generous commissions, exclusive incentives, and a supportive community.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                      <span className="text-accent font-medium text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Create Your Account</h3>
                      <p className="text-sm text-foreground/70">
                        Register with your email address and set up your consultant profile.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                      <span className="text-accent font-medium text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Purchase a Starter Kit</h3>
                      <p className="text-sm text-foreground/70">
                        Get everything you need to start selling and earning commissions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                      <span className="text-accent font-medium text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Start Earning</h3>
                      <p className="text-sm text-foreground/70">
                        Begin selling products and building your team to maximize your income.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div>
              <AuthForm activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
