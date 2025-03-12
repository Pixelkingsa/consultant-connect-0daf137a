
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PayfastPaymentButton from "@/components/payment/PayfastPaymentButton";
import { checkoutFormSchema } from "@/lib/validationSchemas";

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  user: any;
  orderId: string;
  calculateTotal: () => number;
  onCreditCardSuccess: () => void;
}

const CheckoutForm = ({ user, orderId, calculateTotal, onCreditCardSuccess }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'payfast'>('credit_card');

  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  // Load user profile data into form
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
        form.setValue("state", profileData.state || "");
        form.setValue("zipCode", profileData.zip || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  // Load profile data when component mounts
  useState(() => {
    loadUserProfile();
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    if (paymentMethod === 'credit_card') {
      setSubmitting(true);

      try {
        // Record the transaction
        const { error: transactionError } = await supabase
          .from("transactions")
          .insert({
            user_id: user.id,
            amount: calculateTotal(),
            transaction_type: "purchase",
            status: "completed",
            payment_method: "credit_card",
            reference_number: orderId,
          });

        if (transactionError) {
          throw new Error("Failed to record transaction");
        }

        // Update user profile with shipping information
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            address: values.address,
            city: values.city,
            state: values.state,
            zip: values.zipCode,
          })
          .eq("id", user.id);

        if (profileUpdateError) {
          console.error("Failed to update profile:", profileUpdateError);
          // Non-critical error, so we don't throw
        }

        // Call the success callback
        onCreditCardSuccess();

        // Show success message
        toast({
          title: "Order Placed!",
          description: `Your order #${orderId.substring(6, 14)} has been placed successfully.`,
        });

        // Navigate to a success page or dashboard
        navigate("/orders");
      } catch (error) {
        console.error("Checkout error:", error);
        toast({
          title: "Checkout Failed",
          description: "There was an error processing your order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
    // For PayFast, the payment button handles the process
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping & Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shipping Address</h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Method</h3>
              <div className="flex space-x-4 mb-4">
                <Button 
                  type="button" 
                  variant={paymentMethod === 'credit_card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  Credit Card
                </Button>
                <Button 
                  type="button" 
                  variant={paymentMethod === 'payfast' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('payfast')}
                >
                  PayFast
                </Button>
              </div>

              {paymentMethod === 'credit_card' ? (
                <>
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="1234 5678 9012 3456" 
                            maxLength={16}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cardExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="MM/YY" 
                              maxLength={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cardCvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="123" 
                              maxLength={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              ) : null}
            </div>

            <div className="pt-4">
              {paymentMethod === 'credit_card' ? (
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Purchase"
                  )}
                </Button>
              ) : (
                <PayfastPaymentButton
                  amount={calculateTotal()}
                  orderId={orderId}
                  userEmail={user.email}
                  userName={form.getValues().fullName}
                  userId={user.id}
                  disabled={!form.formState.isValid}
                  onSuccess={() => {
                    // Update user profile with shipping information
                    supabase
                      .from("profiles")
                      .update({
                        address: form.getValues().address,
                        city: form.getValues().city,
                        state: form.getValues().state,
                        zip: form.getValues().zipCode,
                      })
                      .eq("id", user.id);
                  }}
                />
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
