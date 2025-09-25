import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockProducts = [
  {
    id: 1,
    name: "Air Force Classic",
    brand: "Nike",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    isNew: true,
    inStock: true,
  },
  {
    id: 2,
    name: "Ultraboost 22",
    brand: "Adidas",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
    isNew: false,
    inStock: true,
  },
  {
    id: 3,
    name: "Chuck Taylor All Star",
    brand: "Converse",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop",
    isNew: false,
    inStock: false,
  },
  {
    id: 4,
    name: "Old Skool Pro",
    brand: "Vans",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
    isNew: true,
    inStock: true,
  },
];

const ProductGrid = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium sneakers from the world's top brands
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-product transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.isNew && (
                    <Badge className="bg-accent text-accent-foreground">New</Badge>
                  )}
                  {product.originalPrice && (
                    <Badge variant="destructive">Sale</Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        wishlist.includes(product.id) 
                          ? 'fill-destructive text-destructive' 
                          : 'text-foreground'
                      }`} 
                    />
                  </Button>
                </div>

                {/* Add to Cart Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;