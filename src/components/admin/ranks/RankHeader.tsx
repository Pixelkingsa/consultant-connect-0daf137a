
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

interface RankHeaderProps {
  openRankDialog: () => void;
}

export const RankHeader = ({ openRankDialog }: RankHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Compensation Management</h1>
        <p className="text-muted-foreground">Configure ranks and commission structures</p>
      </div>
      <DialogTrigger asChild>
        <Button onClick={openRankDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rank
        </Button>
      </DialogTrigger>
    </div>
  );
};
