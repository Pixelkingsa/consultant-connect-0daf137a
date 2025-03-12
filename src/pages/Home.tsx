
import React from "react";
import AppLayout from "@/components/layout/AppLayout";

const Home = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Vamna Fragrances</h1>
        <p className="text-lg">
          Discover our premium collection of fragrances and beauty products.
        </p>
      </div>
    </AppLayout>
  );
};

export default Home;
