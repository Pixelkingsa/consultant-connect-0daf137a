
import { useState } from "react";
import { DesktopHeader } from "./DesktopHeader";
import { useAppUser } from "@/hooks/useAppUser";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, profile, isAdmin, cartCount, handleSignOut } = useAppUser();
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Desktop header */}
          <DesktopHeader 
            profile={profile}
            user={user}
            cartCount={cartCount}
            handleSignOut={handleSignOut}
          />
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
