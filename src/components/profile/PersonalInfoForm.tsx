
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { 
  NameField, 
  EmailField, 
  PhoneField, 
  AddressField, 
  CityField, 
  ProvinceField, 
  PostalCodeField 
} from "./PersonalInfoField";

import { 
  validatePersonalForm, 
  FormErrors, 
  PersonalFormData 
} from "./utils/formValidation";

interface PersonalInfoFormProps {
  formData: PersonalFormData;
  setFormData: React.Dispatch<React.SetStateAction<PersonalFormData>>;
  userId: string;
  refreshProfile: () => void;
}

const PersonalInfoForm = ({ 
  formData, 
  setFormData, 
  userId,
  refreshProfile
}: PersonalInfoFormProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveProfile = async () => {
    const validationErrors = validatePersonalForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      // Refresh profile data
      refreshProfile();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NameField 
          value={formData.full_name} 
          onChange={handleInputChange} 
          error={errors.full_name} 
        />
        
        <EmailField value={formData.email} />
        
        <PhoneField 
          value={formData.phone} 
          onChange={handleInputChange} 
          error={errors.phone} 
        />
      </div>
      
      <div className="space-y-2">
        <AddressField 
          value={formData.address} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CityField 
          value={formData.city} 
          onChange={handleInputChange} 
        />
        
        <ProvinceField 
          value={formData.state} 
          onChange={handleInputChange} 
        />
        
        <PostalCodeField 
          value={formData.zip} 
          onChange={handleInputChange} 
          error={errors.zip} 
        />
      </div>
      
      <div className="pt-4">
        <Button onClick={handleSaveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
