
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralSharingProps {
  referralCode: string;
  referralLink: string;
}

const ReferralSharing = ({ referralCode, referralLink }: ReferralSharingProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `Your referral ${type} has been copied to clipboard.`,
    });
  };

  const sendReferralEmail = () => {
    toast({
      title: "Invitation Sent",
      description: "Your referral invitation has been sent successfully.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <Card className="border rounded-lg overflow-hidden shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Share Your Referral Link</h3>
            
            <div className="space-y-4">
              {/* Referral code */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Your Referral Code</p>
                <div className="flex">
                  <Input 
                    value={referralCode} 
                    readOnly 
                    className="rounded-r-none border-r-0"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-l-none border-l-0"
                    onClick={() => copyToClipboard(referralCode, "code")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              
              {/* Referral link */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Your Referral Link</p>
                <div className="flex">
                  <Input 
                    value={referralLink} 
                    readOnly 
                    className="rounded-r-none border-r-0"
                  />
                  <Button 
                    className="rounded-l-none"
                    onClick={() => copyToClipboard(referralLink, "link")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              
              {/* Email invitation */}
              <div className="space-y-2 pt-4 border-t mt-4">
                <p className="text-sm font-medium">Send Invitation via Email</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="friend@example.com" 
                    type="email"
                  />
                  <Button onClick={sendReferralEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralSharing;
