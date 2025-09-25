import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  const wishlistProducts = products.filter(product => wishlistItems.includes(product.id));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Heart className="h-6 w-6" />
              <h1 className="text-3xl font-bold">My Wishlist</h1>
            </div>
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <Skeleton className="w-full sm:w-48 h-48 sm:h-32" />
                    <div className="flex-1 p-6 space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="h-6 w-6 text-destructive fill-destructive" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <span className="text-muted-foreground">({wishlistProducts.length} items)</span>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Start adding items you love to keep track of them</p>
              <Button>Continue Shopping</Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {wishlistProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-48 sm:h-32">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                            <h3 className="text-xl font-semibold">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <p className="text-2xl font-bold text-accent">R{product.price}</p>
                              {product.original_price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  R{product.original_price}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${product.in_stock ? 'text-accent' : 'text-destructive'}`}>
                              {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => toggleWishlist(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              disabled={!product.in_stock}
                              onClick={() => addToCart(product.id)}
                            >
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
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;