
import NodeAvatar from "./NodeAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RootNodeProps {
  name: string;
}

const RootNode = ({ name }: RootNodeProps) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <NodeAvatar name={name} isRoot={true} />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-white/90 backdrop-blur-sm border border-purple-100 p-3">
            <div className="flex flex-col gap-1">
              <p className="font-medium">This is you!</p>
              <p className="text-xs text-muted-foreground">Team Leader: {name}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="mt-3 font-medium text-sm">You</p>
      <p className="text-xs text-muted-foreground mt-1">{name || 'Team Leader'}</p>
    </div>
  );
};

export default RootNode;
