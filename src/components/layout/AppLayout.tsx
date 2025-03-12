
import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Main content without sidebar/menu */}
        <main className="flex-1 overflow-auto bg-gray-50 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
