
import { ReferredUser } from "./types";
import NetworkNode from "./NetworkNode";

interface NetworkLevelProps {
  users: ReferredUser[];
  isPlaceholders?: boolean;
  onUserClick: (user: ReferredUser) => void;
  levelIndex: number;
}

const NetworkLevel = ({ users, isPlaceholders = false, onUserClick, levelIndex }: NetworkLevelProps) => {
  return (
    <div className={`mt-16 relative ${levelIndex === 1 ? 'grid grid-cols-3 gap-x-20' : 'flex justify-center space-x-20'}`}>
      {users.map((user, index) => (
        <div key={user.id} className="flex flex-col items-center relative">
          {/* Horizontal lines for first level */}
          {levelIndex === 0 && (
            <>
              {/* Connecting lines for the first level */}
              <div className="absolute top-4 w-20 h-0.5 bg-purple-300">
                {index === 0 && <div className="absolute right-0 w-20 h-0.5 bg-purple-300"></div>}
                {index === users.length - 1 && <div className="absolute left-[-20px] w-20 h-0.5 bg-purple-300"></div>}
              </div>
              
              {/* The middle node needs special horizontal connector */}
              {index === 1 && users.length === 3 && (
                <div className="absolute left-1/2 top-4 w-40 h-0.5 bg-purple-300 transform -translate-x-1/2"></div>
              )}
            </>
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
