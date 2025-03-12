
import { User, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrors } from "./utils/formValidation";

interface PersonalInfoFieldProps {
  label: string;
  id: string;
  name?: string;
  value: string;
  icon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

const PersonalInfoField = ({
  label,
  id,
  name,
  value,
  icon,
  onChange,
  disabled = false,
  placeholder,
  error,
  helperText
}: PersonalInfoFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className={icon ? "relative" : ""}>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          name={name || id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-50' : ''}`}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export const NameField = ({ 
  value, 
  onChange, 
  error 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  error?: string;
}) => (
  <PersonalInfoField
    label="Full Name"
    id="full_name"
    name="full_name"
    value={value}
    onChange={onChange}
    icon={<User size={18} />}
    error={error}
  />
);

export const EmailField = ({ 
  value 
}: { 
  value: string; 
}) => (
  <PersonalInfoField
    label="Email Address"
    id="email"
    value={value}
    disabled
    icon={<Mail size={18} />}
    helperText="Contact support to change email"
  />
);

export const PhoneField = ({ 
  value, 
  onChange, 
  error 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  error?: string;
}) => (
  <PersonalInfoField
    label="Phone Number"
    id="phone"
    name="phone"
    value={value}
    onChange={onChange}
    icon={<Phone size={18} />}
    error={error}
  />
);

export const AddressField = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}) => (
  <PersonalInfoField
    label="Address"
    id="address"
    name="address"
    value={value}
    onChange={onChange}
    icon={<MapPin size={18} />}
  />
);

export const CityField = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}) => (
  <PersonalInfoField
    label="City"
    id="city"
    name="city"
    value={value}
    onChange={onChange}
  />
);

export const ProvinceField = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}) => (
  <PersonalInfoField
    label="Province"
    id="state"
    name="state"
    value={value}
    onChange={onChange}
  />
);

export const PostalCodeField = ({ 
  value, 
  onChange, 
  error 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  error?: string;
}) => (
  <PersonalInfoField
    label="Postal Code"
    id="zip"
    name="zip"
    value={value}
    onChange={onChange}
    error={error}
    placeholder="0000"
  />
);
