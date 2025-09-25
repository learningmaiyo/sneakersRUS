import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
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
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold hover:text-accent transition-colors">
              SneakersRUS
            </Link>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-accent transition-colors ${isActive('/') ? 'text-accent' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`hover:text-accent transition-colors ${isActive('/products') ? 'text-accent' : ''}`}
            >
              Products
            </Link>
            {user && (
              <Link 
                to="/admin" 
                className={`hover:text-accent transition-colors ${isActive('/admin') ? 'text-accent' : ''}`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Search - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search sneakers..." 
                className="pl-10 bg-background/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </Link>
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSignOut}
                    className="text-sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
                Home
              </Link>
              <Link to="/products" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
                Products
              </Link>
              {user && (
                <Link to="/admin" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
                  Admin
                </Link>
              )}
              
              {/* Mobile Auth Section */}
              {user ? (
                <>
                  <Link to="/wishlist" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
                    Wishlist
                  </Link>
                  <Link to="/cart" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
                    Cart
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 hover:bg-accent/10 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
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