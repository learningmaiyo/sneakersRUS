import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Filter } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const Products = () => {
  const { products, loading } = useProducts();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  // Get unique brands
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(product => product.brand))];
    return uniqueBrands.sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by brand
    if (selectedBrand && selectedBrand !== "all") {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Sort products
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "newest":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case "popular":
            return b.stock_quantity - a.stock_quantity;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, selectedBrand, sortBy]);

  const handleAddToCart = (productId: string, size?: string) => {
    addToCart(productId, size);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-subtle py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">All Products</h1>
            <p className="text-muted-foreground text-center text-lg">
              Discover our complete collection of premium sneakers
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-100">$0 - $100</SelectItem>
                    <SelectItem value="100-200">$100 - $200</SelectItem>
                    <SelectItem value="200-300">$200 - $300</SelectItem>
                    <SelectItem value="300+">$300+</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">Size 6</SelectItem>
                    <SelectItem value="7">Size 7</SelectItem>
                    <SelectItem value="8">Size 8</SelectItem>
                    <SelectItem value="9">Size 9</SelectItem>
                    <SelectItem value="10">Size 10</SelectItem>
                    <SelectItem value="11">Size 11</SelectItem>
                    <SelectItem value="12">Size 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="w-full h-64 bg-muted"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-3 w-16 bg-muted rounded"></div>
                      <div className="h-5 w-32 bg-muted rounded"></div>
                      <div className="h-6 w-20 bg-muted rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="product-card group overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <Link to={`/product/${product.id}`} className="block">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-105"
                        />
                      </Link>
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        {product.is_new && (
                          <Badge className="bg-accent text-accent-foreground">
                            New
                          </Badge>
                        )}
                        {product.original_price && (
                          <Badge variant="destructive">
                            Sale
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/80 hover:bg-white"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              wishlistItems.includes(product.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        </Button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button 
                          className="w-full" 
                          disabled={!product.in_stock}
                          onClick={() => handleAddToCart(product.id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>

                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <Link to={`/product/${product.id}`} className="block">
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
                          <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">{product.name}</h3>
                        </div>
                      </Link>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-accent">${product.price}</span>
                          {product.original_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.original_price}
                            </span>
                          )}
                        </div>
                        {product.in_stock && (
                          <div className="flex items-center text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            In Stock
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => {
                    setSelectedBrand("");
                    setSortBy("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;