
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NodeAvatarProps {
  name: string;
  isRoot?: boolean;
  isPlaceholder?: boolean;
  onClick?: () => void;
  status?: string;
  email?: string;
}

const NodeAvatar = ({ name, isRoot = false, isPlaceholder = false, onClick, status, email }: NodeAvatarProps) => {
  const avatarContent = isRoot ? (
    <User className="h-8 w-8 text-purple-600" />
  ) : (
    <Avatar className="h-12 w-12 bg-purple-100">
      <AvatarFallback className="text-purple-600 font-medium">
        {name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
  
  const avatarWrapper = (
    <div 
      className={`
        ${isRoot ? 'w-16 h-16 bg-white' : 'w-14 h-14 bg-white'} 
        rounded-full flex items-center justify-center shadow-md border-2
        ${isPlaceholder ? 'border-dashed border-purple-300' : 'border-purple-500 hover:border-purple-700 transition-all'} 
        ${!isRoot && !isPlaceholder ? 'cursor-pointer transform transition-transform duration-300 hover:scale-110' : ''}
        ${status === 'active' ? 'ring-2 ring-green-400 ring-offset-2' : ''}
      `}
      onClick={onClick}
    >
      {avatarContent}
    </div>
  );

  // Only add tooltip for non-placeholder nodes
  if (isPlaceholder || !name) {
    return avatarWrapper;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {avatarWrapper}
        </TooltipTrigger>
        <TooltipContent className="bg-white/90 backdrop-blur-sm border border-purple-100 p-3">
          <div className="flex flex-col gap-1">
            <p className="font-medium">{name}</p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            {status && (
              <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {status === 'active' ? 'Active' : 'Inactive'}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NodeAvatar;
