import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminAuth();
  const { getTotalItems } = useCart();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    }
  };

  return (
    <header className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gradient hover:scale-105 transition-all duration-300">
              SneakersRUS
            </Link>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`relative hover:text-accent transition-all duration-300 font-medium ${
                isActive('/') ? 'text-accent' : ''
              } after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-accent after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`relative hover:text-accent transition-all duration-300 font-medium ${
                isActive('/products') ? 'text-accent' : ''
              } after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-accent after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              Products
            </Link>
            {user && isAdmin && (
              <Link 
                to="/admin" 
                className={`relative hover:text-accent transition-all duration-300 font-medium ${
                  isActive('/admin') ? 'text-accent' : ''
                } after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-accent after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Search - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-accent transition-colors duration-300" />
              <Input 
                placeholder="Search sneakers..." 
                className="pl-10 bg-background/50 backdrop-blur-sm border-2 focus:border-accent focus:ring-accent/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-accent/10 hover:text-accent transition-all duration-300 hover:scale-110">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative hover:bg-accent/10 hover:text-accent transition-all duration-300 hover:scale-110">
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-in shadow-glow">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </Link>
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-sm hover:bg-accent/10 hover:text-accent transition-all duration-300" asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSignOut}
                    className="text-sm hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden md:flex btn-glow border-accent/20 hover:border-accent hover:bg-accent/5 transition-all duration-300">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-accent/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t bg-gradient-card backdrop-blur-lg animate-slide-up">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="block px-4 py-3 hover:bg-accent/10 rounded-lg transition-all duration-300 font-medium">
                Home
              </Link>
              <Link to="/products" className="block px-4 py-3 hover:bg-accent/10 rounded-lg transition-all duration-300 font-medium">
                Products
              </Link>
              {user && isAdmin && (
                <Link to="/admin" className="block px-4 py-3 hover:bg-accent/10 rounded-lg transition-all duration-300 font-medium">
                  Admin
                </Link>
              )}
              
              {/* Mobile Auth Section */}
              {user ? (
                <>
                  <Link to="/wishlist" className="block px-4 py-3 hover:bg-accent/10 rounded-lg transition-all duration-300 font-medium">
                    💜 Wishlist
                  </Link>
                  <Link to="/cart" className="block px-4 py-3 hover:bg-accent/10 rounded-lg transition-all duration-300 font-medium">
                    🛒 Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-3 hover:bg-destructive/10 rounded-lg transition-all duration-300 font-medium text-destructive"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" className="block px-4 py-3 hover:bg-accent/10 rounded-lg transition-all duration-300 font-medium text-accent">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}