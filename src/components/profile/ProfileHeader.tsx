
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRound } from "lucide-react";

interface ProfileHeaderProps {
  avatarUrl: string | null;
  fullName: string | null;
  rankName?: string | null;
}

const ProfileHeader = ({ avatarUrl, fullName, rankName }: ProfileHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-16 w-16">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={fullName || "User"} />
        ) : (
          <AvatarFallback className="bg-primary/10">
            {fullName ? (
              fullName.charAt(0).toUpperCase()
            ) : (
              <UserRound className="h-8 w-8 text-primary" />
            )}
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <CardTitle className="text-xl">Personal Information</CardTitle>
        {rankName && (
          <div className="mt-1">
            <Badge variant="outline" className="bg-black text-white">
              {rankName}
            </Badge>
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default ProfileHeader;
