
import NodeAvatar from "./NodeAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Crown } from "lucide-react";

interface RootNodeProps {
  name: string;
}

const RootNode = ({ name }: RootNodeProps) => {
  return (
    <div className="flex flex-col items-center relative z-10 animate-fade-in">
      <div className="relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <NodeAvatar name={name} isRoot={true} />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-100 p-1.5 rounded-full border-2 border-amber-300 shadow-sm">
                  <Crown className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white/90 backdrop-blur-sm border border-purple-100 p-3">
              <div className="flex flex-col gap-1">
                <p className="font-medium">Team Leader</p>
                <p className="text-xs text-muted-foreground">{name}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="text-center mt-3">
        <p className="font-medium text-sm">You</p>
        <p className="text-xs text-purple-600 font-medium mt-0.5">{name || 'Team Leader'}</p>
      </div>
    </div>
  );
};

export default RootNode;
