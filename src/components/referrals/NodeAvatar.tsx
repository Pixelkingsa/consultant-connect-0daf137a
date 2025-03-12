
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
  // Generate a consistent color based on the name
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  const bgColor = stringToColor(name);
  
  const avatarContent = isRoot ? (
    <User className="h-8 w-8 text-purple-600" />
  ) : (
    <Avatar className="h-14 w-14" style={{ backgroundColor: isPlaceholder ? '#f3f3f7' : bgColor }}>
      <AvatarFallback className="text-purple-700 font-semibold" style={{ fontSize: '1rem' }}>
        {name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
  
  const avatarWrapper = (
    <div 
      className={`
        ${isRoot ? 'w-20 h-20' : 'w-16 h-16'} 
        rounded-full flex items-center justify-center
        ${isPlaceholder ? 
          'bg-white/70 border-dashed border-2 border-purple-200' : 
          'bg-white shadow-md border-2 border-purple-200 hover:border-purple-400'
        } 
        ${status === 'active' && !isPlaceholder ? 'ring-2 ring-green-400 ring-offset-2' : ''}
        ${!isRoot && !isPlaceholder ? 'cursor-pointer transition-all duration-300 hover:scale-105' : ''}
        transform transition-transform
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
