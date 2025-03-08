
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileHeaderProps {
  avatarUrl: string | null;
  fullName: string | null;
}

const ProfileHeader = ({ avatarUrl, fullName }: ProfileHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-16 w-16">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={fullName || "User"} />
        ) : (
          <AvatarFallback>
            {fullName ? fullName.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        )}
      </Avatar>
      <CardTitle className="text-xl">Personal Information</CardTitle>
    </CardHeader>
  );
};

export default ProfileHeader;
