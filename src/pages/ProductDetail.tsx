import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>("");

  const product = products.find(p => p.id === id);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    addToCart(product.id, selectedSize);
    toast({
      title: "Added to Cart",
      description: `${product.name} (Size ${selectedSize}) has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product.id);
    const isInWishlist = wishlistItems.includes(product.id);
    toast({
      title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product.name} has been ${isInWishlist ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isInWishlist = wishlistItems.includes(product.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
                Home
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/products" className="text-muted-foreground hover:text-accent transition-colors">
                Products
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-medium text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className="text-xs font-medium">
                    {product.brand}
                  </Badge>
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
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-accent">${product.price}</span>
                  {product.original_price && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.original_price}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          Size {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="flex-1 text-lg py-6"
                    disabled={!product.in_stock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 py-6"
                    onClick={handleWishlistToggle}
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        isInWishlist ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </Button>
                </div>

                {product.in_stock && (
                  <p className="text-sm text-green-600 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {product.stock_quantity} items left in stock
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-accent" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-accent" />
                  <span>2-year warranty included</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-accent" />
                  <span>30-day return policy</span>
                </div>
              </div>

              {/* Product Details */}
              <div className="border-t pt-6 space-y-3">
                <h3 className="font-semibold">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Brand:</span>
                    <span className="ml-2 font-medium">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 font-medium capitalize">{product.category || 'General'}</span>
                  </div>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Available Sizes:</span>
                      <span className="ml-2 font-medium">{product.sizes.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;