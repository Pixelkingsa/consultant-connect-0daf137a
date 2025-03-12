
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NodeAvatarProps {
  name: string;
  isRoot?: boolean;
  isPlaceholder?: boolean;
  onClick?: () => void;
}

const NodeAvatar = ({ name, isRoot = false, isPlaceholder = false, onClick }: NodeAvatarProps) => {
  return (
    <div 
      className={`
        ${isRoot ? 'w-16 h-16 bg-white' : 'w-14 h-14 bg-white'} 
        rounded-full flex items-center justify-center shadow-md border-2
        ${isPlaceholder ? 'border-dashed border-purple-300' : 'border-purple-500 hover:border-purple-700 transition-all'} 
        ${!isRoot && !isPlaceholder ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {isRoot ? (
        <User className="h-8 w-8 text-purple-600" />
      ) : (
        <Avatar className="h-12 w-12 bg-purple-100">
          <AvatarFallback className="text-purple-600 font-medium">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default NodeAvatar;
