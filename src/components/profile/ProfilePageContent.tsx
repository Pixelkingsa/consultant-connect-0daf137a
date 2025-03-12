
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExtendedProfile, PersonalInfoFormData } from "@/types/profile";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAvatarUploader from "@/components/profile/ProfileAvatarUploader";
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import ConsultantDetails from "@/components/profile/ConsultantDetails";
import { 
  calculateRankProgress, 
  getNextRankName 
} from "@/components/profile/RankProgressHelper";

interface ProfilePageContentProps {
  profile: ExtendedProfile | null;
  userId: string;
  formData: PersonalInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<PersonalInfoFormData>>;
  refreshProfile: () => void;
}

const ProfilePageContent = ({ 
  profile, 
  userId, 
  formData, 
  setFormData, 
  refreshProfile 
}: ProfilePageContentProps) => {
  
  const getRankProgress = () => calculateRankProgress(profile);
  const getNextRank = () => getNextRankName(profile);

  return (
    <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="account">Account Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <ProfileHeader 
              avatarUrl={profile?.avatar_url} 
              fullName={profile?.full_name} 
              rankName={profile?.ranks?.name}
            />
            
            <div className="flex justify-center px-6 -mt-2 mb-4">
              <ProfileAvatarUploader 
                userId={userId} 
                onUploadComplete={refreshProfile} 
              />
            </div>
            
            <CardContent className="space-y-6">
              <PersonalInfoForm 
                formData={formData}
                setFormData={setFormData}
                userId={userId}
                refreshProfile={refreshProfile}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <ConsultantDetails 
              profile={profile} 
              calculateRankProgress={getRankProgress}
              getNextRankName={getNextRank}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePageContent;
