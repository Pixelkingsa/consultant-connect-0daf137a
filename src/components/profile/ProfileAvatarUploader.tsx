
import { useState } from "react";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarUploaderProps {
  userId: string;
  onUploadComplete: () => void;
}

const ProfileAvatarUploader = ({ 
  userId,
  onUploadComplete
}: ProfileAvatarUploaderProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadProfilePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      if (urlData) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: urlData.publicUrl })
          .eq('id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        onUploadComplete();
        
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error uploading picture",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="profile-picture"
        accept="image/*"
        onChange={uploadProfilePicture}
        className="sr-only"
        disabled={uploading}
      />
      <label
        htmlFor="profile-picture"
        className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {uploading ? (
          <>Uploading...</>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            Change picture
          </>
        )}
      </label>
    </div>
  );
};

export default ProfileAvatarUploader;
