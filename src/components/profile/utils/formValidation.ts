
// Form validation utilities for personal info form

export interface FormErrors {
  [key: string]: string;
}

export interface PersonalFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export const validatePersonalForm = (formData: PersonalFormData): FormErrors => {
  const errors: FormErrors = {};
  
  // Basic validations
  if (!formData.full_name.trim()) {
    errors.full_name = "Full name is required";
  }
  
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  }
  
  // South African postal code validation - 4 digits
  const postalCodeRegex = /^\d{4}$/;
  if (!postalCodeRegex.test(formData.zip)) {
    errors.zip = "Valid 4-digit South African postal code is required";
  }
  
  return errors;
};
