import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size?: string;
  product: {
    id: string;
    name: string;
    price: number;
    brand: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting checkout process");

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    console.log(`Processing checkout for user: ${user.email}`);

    // Get cart items with product details
    const { data: cartItems, error: cartError } = await supabaseClient
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        size,
        products (
          id,
          name,
          price,
          brand
        )
      `)
      .eq('user_id', user.id);

    if (cartError) throw new Error(`Cart error: ${cartError.message}`);
    if (!cartItems || cartItems.length === 0) throw new Error("Cart is empty");

    console.log(`Found ${cartItems.length} items in cart`);

    // Calculate total
    const totalAmount = cartItems.reduce((sum: number, item: any) => {
      return sum + (item.products.price * item.quantity);
    }, 0);

    console.log(`Total amount: $${totalAmount}`);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if Stripe customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log(`Found existing Stripe customer: ${customerId}`);
    } else {
      console.log("No existing Stripe customer found");
    }

    // Create order in database
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw new Error(`Order creation error: ${orderError.message}`);
    console.log(`Created order: ${orderData.id}`);

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.products.price,
      size: item.size
    }));

    const { error: orderItemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) throw new Error(`Order items error: ${orderItemsError.message}`);
    console.log(`Created ${orderItems.length} order items`);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Order #${orderData.id.slice(0, 8)}`,
              description: `${cartItems.length} items from your cart`,
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      metadata: {
        order_id: orderData.id,
        user_id: user.id,
      },
    });

    console.log(`Created Stripe session: ${session.id}`);

    // Update order with Stripe session ID
    await supabaseClient
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', orderData.id);

    return new Response(JSON.stringify({ 
      url: session.url,
      order_id: orderData.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});