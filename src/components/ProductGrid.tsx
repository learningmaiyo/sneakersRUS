import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

interface ProductGridProps {
  showFeaturedOnly?: boolean;
  maxItems?: number;
}

const ProductGrid = ({ showFeaturedOnly = false, maxItems }: ProductGridProps) => {
  const { products, loading } = useProducts();

  // Filter products based on props
  const filteredProducts = products
    .filter(product => showFeaturedOnly ? (product as any).featured : true)
    .slice(0, maxItems);
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (productId: string, size?: string) => {
    addToCart(productId, size);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-subtle relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-accent opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-premium opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              ⏳ Loading amazing products...
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient">Featured Collection</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover our handpicked selection of premium sneakers from the world's top brands
              <span className="block mt-2 text-accent font-medium">✨ Curated for Style & Performance</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse bg-gradient-card">
                <Skeleton className="w-full h-64 bg-gradient-to-br from-muted to-muted/50" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-3 w-16 bg-muted/70" />
                  <Skeleton className="h-5 w-32 bg-muted/70" />
                  <Skeleton className="h-6 w-20 bg-accent/20" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-subtle relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-accent opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-premium opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Featured Collection</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium sneakers from the world's top brands
            <span className="block mt-2 text-accent font-medium">Curated for Style & Performance</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="product-card product-card-glow group overflow-hidden shadow-product hover:shadow-hover transition-all duration-500">
              <div className="relative overflow-hidden">
                <Link to={`/product/${product.id}`} className="block">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </Link>
                
                {/* Enhanced Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.is_new && (
                    <Badge className="bg-accent text-accent-foreground shadow-card font-medium">
                      New
                    </Badge>
                  )}
                  {product.original_price && (
                    <Badge variant="destructive" className="shadow-md font-medium">
                      Sale
                    </Badge>
                  )}
                </div>

                {/* Enhanced Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="glass hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-all duration-300 ${
                        wishlistItems.includes(product.id) 
                          ? 'fill-red-500 text-red-500 animate-bounce' 
                          : 'text-white hover:text-red-400'
                      }`} 
                    />
                  </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <Button 
                    className="w-full bg-accent hover:bg-accent-dark border-0 shadow-card hover:shadow-hover transition-all duration-300 font-medium" 
                    disabled={!product.in_stock}
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>

                {/* Stock Status Indicator */}
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-medium text-sm shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <CardContent className="p-6 bg-gradient-card">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">{product.brand}</p>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2">{product.name}</h3>
                  </div>
                </Link>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-accent">${product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through bg-muted px-2 py-1 rounded">
                        ${product.original_price}
                      </span>
                    )}
                  </div>
                  {product.in_stock && (
                    <div className="flex items-center text-xs text-green-600 font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      In Stock
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-accent/30 hover:border-accent hover:bg-accent/5 hover:text-accent transition-all duration-300 font-medium px-8 py-3" asChild>
            <Link to="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;