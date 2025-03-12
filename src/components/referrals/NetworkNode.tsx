
import { ReferredUser } from "./types";
import NodeAvatar from "./NodeAvatar";

interface NetworkNodeProps {
  user: ReferredUser; 
  isPlaceholder?: boolean;
  onClick: (user: ReferredUser) => void;
}

const NetworkNode = ({ user, isPlaceholder = false, onClick }: NetworkNodeProps) => {
  return (
    <div className="flex flex-col items-center">
      <NodeAvatar 
        name={user.name} 
        isPlaceholder={isPlaceholder} 
        onClick={() => onClick(user)} 
        status={user.status}
        email={user.email}
      />
      <p className="mt-2 font-medium text-xs max-w-[120px] text-center">{user.name}</p>
      {isPlaceholder && (
        <p className="text-[10px] text-muted-foreground mt-1 text-center">Example Referral</p>
      )}
    </div>
  );
};

export default NetworkNode;
