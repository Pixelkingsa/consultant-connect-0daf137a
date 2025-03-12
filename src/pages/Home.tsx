
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        {/* Home page content would go here */}
        <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-8">Welcome to Vamna Fragrances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg p-6 border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Why Choose Us</h3>
              <p className="text-muted-foreground">
                Discover premium fragrances and earn generous commissions as a consultant. 
                Our products are crafted with the finest ingredients for lasting impressions.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Get Started Today</h3>
              <p className="text-muted-foreground">
                Join our network of successful consultants and start your journey with 
                Vamna Fragrances. Create your account and begin earning right away.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
