
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get form data from PayFast
    const formData = await req.formData();
    const paymentData: Record<string, any> = {};
    
    // Convert formData to an object
    for (const [key, value] of formData.entries()) {
      paymentData[key] = value;
    }
    
    console.log("PayFast notification received:", paymentData);
    
    // Extract payment ID and status
    const m_payment_id = paymentData.m_payment_id;
    const payment_status = paymentData.payment_status;
    
    if (!m_payment_id) {
      return new Response(JSON.stringify({ error: 'Payment ID not provided' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Update payment status in database
    const { error } = await supabase
      .from('payment_transactions')
      .update({ 
        payment_status: payment_status || 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', m_payment_id);
    
    if (error) {
      console.error("Error updating payment status:", error);
      return new Response(JSON.stringify({ error: 'Database update failed' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // If payment was successful, record the transaction in sales
    if (payment_status === 'COMPLETE') {
      // Get the transaction details
      const { data: transactionData, error: fetchError } = await supabase
        .from('payment_transactions')
        .select('user_id, order_id, amount')
        .eq('id', m_payment_id)
        .single();
      
      if (!fetchError && transactionData) {
        // Create a sales record
        await supabase.from('sales').insert({
          user_id: transactionData.user_id,
          order_id: transactionData.order_id,
          amount: transactionData.amount,
          personal_volume: Math.floor(transactionData.amount), // Simple conversion
          status: 'completed',
          date: new Date().toISOString()
        });
        
        // Clear the user's cart
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', transactionData.user_id);
      }
    }
    
    // Return success response
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("PayFast webhook error:", error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
