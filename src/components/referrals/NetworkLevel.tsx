
import { ReferredUser } from "./types";
import NetworkNode from "./NetworkNode";

interface NetworkLevelProps {
  users: ReferredUser[];
  isPlaceholders?: boolean;
  onUserClick: (user: ReferredUser) => void;
  levelIndex: number;
  parentPositions?: number[];
}

const NetworkLevel = ({ 
  users, 
  isPlaceholders = false, 
  onUserClick, 
  levelIndex,
  parentPositions = []
}: NetworkLevelProps) => {
  return (
    <div className={`mt-16 relative ${levelIndex === 1 ? 'grid grid-cols-3 gap-x-20' : 'flex justify-center space-x-20'}`}>
      {users.map((user, index) => (
        <div key={user.id} className="flex flex-col items-center relative">
          {/* For second level, draw individual connecting lines to parents */}
          {levelIndex === 1 && parentPositions.length > 0 && (
            <div 
              className="absolute top-[-48px] w-0.5 h-12 bg-gradient-to-b from-purple-300 to-purple-500"
              style={{ 
                left: '50%',
                transform: 'translateX(-50%)'
              }}
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
