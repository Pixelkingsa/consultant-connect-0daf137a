
import { supabase } from "@/integrations/supabase/client";
import { createHmac } from 'crypto';

// PayFast configuration
// In a production environment, these would be fetched from environment variables
const PAYFAST_MERCHANT_ID = "10000100";
const PAYFAST_MERCHANT_KEY = "46f0cd694581a";
const PAYFAST_PASSPHRASE = "payfast"; // Only needed for API calls
const IS_TEST_MODE = true;

// PayFast URLs
const PAYFAST_PROCESS_URL = IS_TEST_MODE
  ? "https://sandbox.payfast.co.za/onsite/process"
  : "https://www.payfast.co.za/onsite/process";

interface PayfastPaymentData {
  amount: number;
  item_name: string;
  orderId: string;
  email_address: string;
  name_first?: string;
  name_last?: string;
  return_url?: string;
  cancel_url?: string;
  notify_url?: string;
}

export async function initiatePayfastPayment(paymentData: PayfastPaymentData, userId: string) {
  try {
    // Create a record in our database
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        order_id: paymentData.orderId,
        amount: paymentData.amount,
        payment_method: 'payfast',
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        payment_status: 'initiated'
      })
      .select()
      .single();

    if (error) {
      console.error("Error recording payment transaction:", error);
      throw new Error("Could not initiate payment");
    }

    // Prepare PayFast data object
    const pfData = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: paymentData.return_url || window.location.origin + "/orders",
      cancel_url: paymentData.cancel_url || window.location.origin + "/cart",
      notify_url: paymentData.notify_url || window.location.origin + "/api/payfast-callback",
      name_first: paymentData.name_first || "",
      name_last: paymentData.name_last || "",
      email_address: paymentData.email_address,
      m_payment_id: data.id, // Use our transaction ID as payment ID
      amount: paymentData.amount.toFixed(2),
      item_name: paymentData.item_name,
    };

    if (IS_TEST_MODE) {
      Object.assign(pfData, { custom_str1: 'testing' });
    }

    return {
      paymentId: data.id,
      pfData,
      processUrl: PAYFAST_PROCESS_URL
    };
  } catch (error) {
    console.error("PayFast payment initiation error:", error);
    throw error;
  }
}

export async function updatePaymentStatus(paymentId: string, status: string) {
  try {
    const { error } = await supabase
      .from('payment_transactions')
      .update({ payment_status: status })
      .eq('id', paymentId);

    if (error) {
      console.error("Error updating payment status:", error);
      throw new Error("Could not update payment status");
    }

    return true;
  } catch (error) {
    console.error("Payment status update error:", error);
    throw error;
  }
}
