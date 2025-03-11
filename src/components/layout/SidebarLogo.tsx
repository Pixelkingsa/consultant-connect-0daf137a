
import React from 'react';

const SidebarLogo = () => {
  return (
    <div className="flex items-center">
      <img 
        src="/lovable-uploads/b980843c-1d32-4401-a01f-fb54577f2888.png" 
        alt="VAMNA Logo" 
        className="h-8 mr-2"
      />
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-white">VAMNA</h1>
        <span className="text-xs ml-1 mt-1 text-gray-400">YOUR LASTING BEAUTY</span>
      </div>
    </div>
  );
};

export default SidebarLogo;
