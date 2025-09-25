import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, User, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useDjangoAuth";
import { useCart } from "@/hooks/useDjangoCart";
import { useWishlist } from "@/hooks/useDjangoWishlist";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totals } = useCart();
  const { getWishlistCount } = useWishlist();

  const cartItemsCount = totals?.total_items || 0;
  const wishlistCount = getWishlistCount();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Sneaker Store
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/products"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Products
          </Link>
          <Link
            to="/products?featured=true"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Featured
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={signOut}
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  {user.profile?.display_name || user.email}
                </span>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/products"
              className="block text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/products?featured=true"
              className="block text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Featured
            </Link>

            {user ? (
              <>
                <div className="flex items-center space-x-4 pt-4 border-t">
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="relative">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {wishlistCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="relative">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                      {cartItemsCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {cartItemsCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    {user.profile?.display_name || user.email}
                  </span>
                  <div className="flex space-x-2">
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm">
                        Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t">
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Sign In</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;