
import { ReferredUser } from "./types";
import NetworkNode from "./NetworkNode";

interface NetworkLevelProps {
  users: ReferredUser[];
  isPlaceholders?: boolean;
  onUserClick: (user: ReferredUser) => void;
  levelIndex: number;
}

const NetworkLevel = ({ 
  users, 
  isPlaceholders = false, 
  onUserClick, 
  levelIndex
}: NetworkLevelProps) => {
  // Determine the layout based on level
  const levelClass = levelIndex === 0 
    ? "grid grid-cols-3 gap-8" 
    : "flex justify-center flex-wrap gap-8";

  return (
    <div className={`w-full ${levelClass} relative`}>
      {users.map((user, index) => (
        <div key={user.id} className="relative">
          {/* Connection lines - drawn for each node */}
          {levelIndex > 0 && (
            <div 
              className="absolute left-1/2 -top-12 w-[2px] h-12 bg-gradient-to-b from-purple-300 to-purple-500 -translate-x-1/2"
              style={{ opacity: isPlaceholders ? 0.5 : 0.8 }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-200 to-purple-400 animate-pulse"></div>
            </div>
          )}
          
          <NetworkNode 
            user={user} 
            isPlaceholder={isPlaceholders} 
            onClick={onUserClick} 
          />
        </div>
      ))}
    </div>
  );
};

export default NetworkLevel;
