import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const clearCartAndFetchOrder = async () => {
      if (!user || !sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Get order details by session ID
        const { data: order } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            created_at,
            order_items (
              quantity,
              price_at_time,
              size,
              products (
                name,
                brand
              )
            )
          `)
          .eq('stripe_session_id', sessionId)
          .eq('user_id', user.id)
          .single();

        if (order) {
          setOrderDetails(order);
          
          // Update order status to completed
          await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', order.id);

          // Clear cart
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Error processing successful checkout:', error);
      } finally {
        setLoading(false);
      }
    };

    clearCartAndFetchOrder();
  }, [user, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Processing your order...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <p className="text-muted-foreground">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {orderDetails && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Order ID:</span>
                    <span className="text-muted-foreground">#{orderDetails.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold">${orderDetails.total_amount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Order Date:</span>
                    <span className="text-muted-foreground">
                      {new Date(orderDetails.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Items Ordered:</h3>
                    {orderDetails.order_items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm py-1">
                        <span>
                          {item.products.brand} {item.products.name}
                          {item.size && ` (Size: ${item.size})`}
                          {item.quantity > 1 && ` x${item.quantity}`}
                        </span>
                        <span>${(item.price_at_time * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button asChild className="flex-1">
                  <Link to="/products">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/profile">View Order History</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;