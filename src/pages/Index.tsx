
import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, DollarSign, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Section animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      } 
    }
  };
  
  const features = [
    {
      icon: <DollarSign className="h-6 w-6 text-accent" />,
      title: "50% Retail Profit",
      description: "Earn generous commissions on every product you sell to customers."
    },
    {
      icon: <Award className="h-6 w-6 text-accent" />,
      title: "Leadership Ranks",
      description: "Advance through ranks from Starter to Platinum with increasing benefits."
    },
    {
      icon: <Users className="h-6 w-6 text-accent" />,
      title: "Team Commissions",
      description: "Build a team and earn commissions on their sales volume."
    },
    {
      icon: <Star className="h-6 w-6 text-accent" />,
      title: "Exclusive Incentives",
      description: "Qualify for bonuses, car allowances, and luxury travel experiences."
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* How It Works Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="py-20 bg-white"
        >
          <div className="container max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide mb-4">
                The Opportunity
              </span>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">
                How Our Vamna Agent Program Works
              </h2>
              <p className="text-foreground/70">
                Join Vamna Fragrances as a Vamna Agent and transform your passion for scents into a rewarding business opportunity with flexible hours and unlimited earning potential.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-foreground/70 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/opportunity">
                <Button variant="outline" className="group">
                  Learn more about our compensation plan
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
        
        {/* Testimonials Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="py-20 bg-accent/5"
        >
          <div className="container max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide mb-4">
                Success Stories
              </span>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">
                Hear From Our Vamna Agents
              </h2>
              <p className="text-foreground/70">
                Discover how Vamna Fragrances has transformed the lives of our Vamna Agents, providing them with financial freedom and personal growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i+15}`} 
                      alt="Vamna Agent" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-white/50"
                    />
                    <div>
                      <h3 className="font-medium">
                        {["Sarah Johnson", "Michael Chen", "Priya Patel"][i]}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {["Gold Leader", "Silver Leader", "Bronze Leader"][i]}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-foreground/80 italic">
                    {[
                      "Joining Vamna Fragrances was the best decision I've made. In just 18 months, I've built a team of 25 Vamna Agents and achieved Gold Leader status. The financial freedom has allowed me to quit my 9-5 job.",
                      "I started as a part-time Vamna Agent while maintaining my day job. Within a year, I was earning more from Vamna than my corporate salary. The supportive community and training made all the difference.",
                      "As a stay-at-home mom, Vamna Fragrances gave me the perfect opportunity to earn income while maintaining flexibility for my family. I now lead a team of 15 Vamna Agents and love the sense of achievement."
                    ][i]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        
        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="py-20 bg-primary text-primary-foreground"
        >
          <div className="container max-w-7xl mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join our team of successful Vamna Agents today and begin earning generous commissions while sharing fragrances you love.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/auth?register=true">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Become a Vamna Agent
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 hover:bg-primary-foreground/10">
                    Explore Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
