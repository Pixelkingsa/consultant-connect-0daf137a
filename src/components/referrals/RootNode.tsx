
import NodeAvatar from "./NodeAvatar";

interface RootNodeProps {
  name: string;
}

const RootNode = ({ name }: RootNodeProps) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <NodeAvatar name={name} isRoot={true} />
      <p className="mt-3 font-medium text-sm">You</p>
      <p className="text-xs text-muted-foreground mt-1">{name || 'Team Leader'}</p>
    </div>
  );
};

export default RootNode;
