
import { ReferredUser } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserDetailDialogProps {
  user: ReferredUser | null;
  onClose: () => void;
}

const UserDetailDialog = ({ user, onClose }: UserDetailDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Referral Details</DialogTitle>
          <DialogDescription>
            Information about your referral
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="flex items-center space-x-5">
            <Avatar className="h-16 w-16 bg-purple-100 text-purple-600">
              <AvatarFallback className="text-xl font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className={`text-sm mt-2 font-medium px-2 py-1 rounded-full inline-block ${
                user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Joined</p>
              <p className="text-sm mt-2">{new Date(user.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">Recent Activity</p>
            <div className="bg-muted rounded-md p-4 text-sm">
              <p className="text-center text-muted-foreground">Activity data coming soon</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
