
import { ReferredUser } from "./types";
import NodeAvatar from "./NodeAvatar";
import { ShoppingBag, Award, Link } from "lucide-react";

interface NetworkNodeProps {
  user: ReferredUser; 
  isPlaceholder?: boolean;
  onClick: (user: ReferredUser) => void;
}

const NetworkNode = ({ user, isPlaceholder = false, onClick }: NetworkNodeProps) => {
  // Calculate a timestamp for activity indicator (for demo purposes)
  const isRecentlyActive = user.id.charCodeAt(0) % 3 === 0;

  return (
    <div className="flex flex-col items-center group animate-fade-in">
      <div className="relative">
        {/* Connection indicator dot at the top of each avatar */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-400 border-2 border-white z-10">
          <div className="absolute inset-0 rounded-full bg-purple-300 animate-pulse"></div>
        </div>
        
        <NodeAvatar 
          name={user.name} 
          isPlaceholder={isPlaceholder} 
          onClick={() => onClick(user)} 
          status={user.status}
          email={user.email}
        />
        
        {/* Activity indicators */}
        {!isPlaceholder && (
          <div className="absolute -right-1 -bottom-1 flex space-x-1">
            {isRecentlyActive && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>
        )}
        
        {/* Achievement badges - just for visual flair */}
        {!isPlaceholder && user.id.charCodeAt(0) % 5 === 0 && (
          <div className="absolute -right-2 -top-1 bg-amber-100 p-1 rounded-full border border-amber-300">
            <Award className="h-3 w-3 text-amber-600" />
          </div>
        )}
        
        {!isPlaceholder && user.id.charCodeAt(0) % 7 === 0 && (
          <div className="absolute -left-2 -top-1 bg-blue-100 p-1 rounded-full border border-blue-300">
            <ShoppingBag className="h-3 w-3 text-blue-600" />
          </div>
        )}
        
        {/* Connection indicator for referrals */}
        {!isPlaceholder && user.id.charCodeAt(0) % 4 === 0 && (
          <div className="absolute -left-3 bottom-1 bg-purple-100 p-1 rounded-full border border-purple-300">
            <Link className="h-3 w-3 text-purple-600" />
          </div>
        )}
      </div>
      
      <div className="text-center mt-2">
        <p className="font-medium text-sm max-w-[120px] truncate group-hover:text-purple-700 transition-colors">
          {user.name}
        </p>
        {isPlaceholder ? (
          <p className="text-[10px] text-muted-foreground mt-0.5">Example Referral</p>
        ) : (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Joined {new Date(user.date).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default NetworkNode;
