
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-40 right-[10%] w-64 h-64 rounded-full bg-accent/10 blur-3xl"></div>
      <div className="absolute bottom-40 left-[5%] w-72 h-72 rounded-full bg-accent/5 blur-3xl"></div>
      
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide mb-4">
                Become a Vamna Agent
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance leading-tight">
                Transform Passion into <span className="text-accent">Prosperity</span>
              </h1>
              <p className="mt-6 text-lg text-foreground/80 max-w-xl">
                Join Vamna Fragrances as a Vamna Agent and discover a rewarding business opportunity that lets you share exquisite scents while earning generous commissions.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link to="/auth?register=true">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/opportunity">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              className="pt-8 flex items-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-background overflow-hidden"
                  >
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i+10}`} 
                      alt="Vamna Agent" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm text-foreground/80">
                  Joined by <span className="font-medium text-foreground">2,000+</span> Vamna Agents
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl lg:translate-y-10">
              <img 
                src="https://images.unsplash.com/photo-1615963244664-5b845b2025ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2079&q=80" 
                alt="Vamna Fragrances"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card rounded-xl p-4 shadow-lg max-w-[280px]">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                  >
                    <path d="M12 2v1" />
                    <path d="M19 9h-1" />
                    <path d="M5 11h1" />
                    <path d="M8 17.1a6 6 0 0 0 8 0" />
                    <path
                      d="M18 12a6 6 0 0 0-1.5-4 3 3 0 0 0-8.8 9.5"
                    />
                    <path d="M12 18v1" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-sm">50% Retail Profit</h3>
                  <p className="text-xs text-foreground/70 mt-1">
                    Earn generous commissions on every product you sell
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
