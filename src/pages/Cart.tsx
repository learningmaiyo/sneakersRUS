import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

const Cart = () => {
  // Mock cart data
  const cartItems = [
    {
      id: 1,
      name: "Air Force Classic",
      brand: "Nike",
      price: 129.99,
      quantity: 2,
      size: "10",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Ultraboost 22",
      brand: "Adidas",
      price: 189.99,
      quantity: 1,
      size: "9.5",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <span className="text-muted-foreground">({cartItems.length} items)</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some sneakers to get started</p>
              <Button>Continue Shopping</Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-32">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 p-6">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">{item.brand}</p>
                              <h3 className="text-lg font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                              <p className="text-lg font-bold text-accent mt-1">${item.price}</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  value={item.quantity}
                                  className="w-16 h-8 text-center"
                                  readOnly
                                />
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mb-4">
                      Proceed to Checkout
                    </Button>

                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;