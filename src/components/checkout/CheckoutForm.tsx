
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, CheckoutFormValues } from "@/lib/validationSchemas";
import ContactInformationForm from "./ContactInformationForm";
import ShippingAddressForm from "./ShippingAddressForm";

interface CheckoutFormProps {
  user: any;
  onFormValidityChange: (isValid: boolean) => void;
  getFormValues: React.MutableRefObject<() => CheckoutFormValues>;
}

const CheckoutForm = ({ user, onFormValidityChange, getFormValues }: CheckoutFormProps) => {
  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      phoneNumber: ""
    },
  });

  // Report form validity changes
  useEffect(() => {
    const subscription = form.watch(() => {
      onFormValidityChange(form.formState.isValid);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormValidityChange]);

  // Make form values accessible to parent
  useEffect(() => {
    getFormValues.current = () => form.getValues();
  }, [getFormValues]);

  // Load user profile data into form
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profileError && profileData) {
          form.setValue("fullName", profileData.full_name || "");
          form.setValue("email", user.email || "");
          form.setValue("address", profileData.address || "");
          form.setValue("city", profileData.city || "");
          form.setValue("province", profileData.state || "");
          form.setValue("postalCode", profileData.zip || "");
          form.setValue("phoneNumber", profileData.phone || "");
          
          // Trigger validation after setting values
          form.trigger();
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    
    loadUserProfile();
  }, [user, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>South African Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <ContactInformationForm form={form} />
            <Separator />
            <ShippingAddressForm form={form} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
