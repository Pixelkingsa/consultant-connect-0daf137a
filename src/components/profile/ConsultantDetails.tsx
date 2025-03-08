
import { Award, Calendar, CircleDollarSign } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Rank {
  id: string;
  name: string;
  threshold_pv: number;
  threshold_gv: number;
  commission_rate: number;
}

interface ConsultantDetailsProps {
  profile: {
    ranks: Rank | null;
    created_at: string;
    personal_volume: number;
  } | null;
  calculateRankProgress: () => number;
  getNextRankName: () => string;
}

const ConsultantDetails = ({ 
  profile, 
  calculateRankProgress, 
  getNextRankName 
}: ConsultantDetailsProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Consultant Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Award className="text-accent h-5 w-5" />
              <span className="font-medium">Current Rank</span>
            </div>
            <p className="text-lg font-semibold">{profile?.ranks?.name || "Loading..."}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-accent h-2.5 rounded-full" style={{ width: `${calculateRankProgress()}%` }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {calculateRankProgress()}% to next rank: {getNextRankName()}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-accent h-5 w-5" />
              <span className="font-medium">Account Status</span>
            </div>
            <p className="text-lg font-semibold">Active</p>
            <p className="text-sm text-muted-foreground">
              Member since: {new Date(profile?.created_at || '').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <CircleDollarSign className="text-accent h-5 w-5" />
            <span className="font-medium">Commission Rate</span>
          </div>
          <p className="text-lg font-semibold">{profile?.ranks?.commission_rate || 0}%</p>
          <p className="text-sm text-muted-foreground">
            Based on your current rank
          </p>
        </div>
        
        <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            For security reasons, please contact support to change sensitive account information.
          </p>
        </div>
      </CardContent>
    </>
  );
};

export default ConsultantDetails;
