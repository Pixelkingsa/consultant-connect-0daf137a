
import { RankForm, type RankFormValues } from "@/components/admin/ranks/RankForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RankDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRank: any | null;
  onSubmit: (values: RankFormValues) => Promise<void>;
}

export const RankDialog = ({ 
  isOpen, 
  onOpenChange, 
  editingRank, 
  onSubmit 
}: RankDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingRank ? "Edit Rank" : "Add New Rank"}
          </DialogTitle>
          <DialogDescription>
            Configure the rank details and qualification criteria
          </DialogDescription>
        </DialogHeader>
        <RankForm 
          onSubmit={onSubmit}
          initialValues={editingRank}
        />
      </DialogContent>
    </Dialog>
  );
};
