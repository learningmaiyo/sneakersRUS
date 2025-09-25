import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

const Wishlist = () => {
  // Mock wishlist data
  const wishlistItems = [
    {
      id: 1,
      name: "Air Force Classic",
      brand: "Nike",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      inStock: true,
    },
    {
      id: 2,
      name: "Ultraboost 22",
      brand: "Adidas",
      price: 189.99,
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
      inStock: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="h-6 w-6 text-destructive fill-destructive" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <span className="text-muted-foreground">({wishlistItems.length} items)</span>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Start adding items you love to keep track of them</p>
              <Button>Continue Shopping</Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-48 sm:h-32">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                            <h3 className="text-xl font-semibold">{item.name}</h3>
                            <p className="text-2xl font-bold text-accent mt-2">${item.price}</p>
                            <p className={`text-sm mt-1 ${item.inStock ? 'text-accent' : 'text-destructive'}`}>
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button disabled={!item.inStock}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-center mt-8">
                <Button variant="outline">Clear Wishlist</Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;