import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage1 from "@/assets/hero-shoe-1.jpg";
import heroImage2 from "@/assets/hero-shoe-2.jpg";
import heroImage3 from "@/assets/hero-shoe-3.jpg";

// Option 2: Split Layout (Text left, Hero shoe right)
export const HeroSplitLayout = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with stronger overlay on left */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage1})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full min-h-[80vh]">
          {/* Left: Content */}
          <div className="text-left space-y-8 bg-black/20 backdrop-blur-sm rounded-3xl p-8 lg:p-12">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium">
              New Collection Available
            </span>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
              Step Into<br />
              <span className="text-accent">Premium Style</span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed">
              Discover the latest collection of premium sneakers from top brands. 
              Elevate your style with authentic, quality footwear.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent-dark" asChild>
                <Link to="/products">
                  Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link to="/products">New Arrivals</Link>
              </Button>
            </div>
          </div>
          
          {/* Right: Hero shoe showcase - let background image shine */}
          <div className="hidden lg:block">
            {/* This space intentionally left for background shoe image */}
          </div>
        </div>
      </div>
    </section>
  );
};

// Option 3: Top-Focused Layout
export const HeroTopLayout = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage1})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/60" />
      
      {/* Top Content */}
      <div className="relative z-10 pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-black/30 backdrop-blur-md rounded-3xl p-8 lg:p-12 mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-6">
              New Collection Available
            </span>
            
            <h1 className="text-6xl lg:text-8xl font-bold leading-tight text-white mb-6">
              Step Into<br />
              <span className="text-accent">Premium Style</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the latest collection of premium sneakers from top brands. 
              Elevate your style with authentic, quality footwear.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent-dark px-10 py-6 text-lg" asChild>
                <Link to="/products">
                  Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-10 py-6 text-lg" asChild>
                <Link to="/products">New Arrivals</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Stats - over shoes */}
      <div className="relative z-10 pb-8">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl mx-4 lg:mx-8 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div><div className="text-3xl font-bold text-white mb-1">1000+</div><div className="text-white/80 text-sm uppercase tracking-wide">Products</div></div>
            <div><div className="text-3xl font-bold text-white mb-1">50+</div><div className="text-white/80 text-sm uppercase tracking-wide">Brands</div></div>
            <div><div className="text-3xl font-bold text-white mb-1">24/7</div><div className="text-white/80 text-sm uppercase tracking-wide">Support</div></div>
            <div><div className="text-3xl font-bold text-white mb-1">Free</div><div className="text-white/80 text-sm uppercase tracking-wide">Shipping</div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Option 4: Enhanced Center Layout with Strong Backdrop
export const HeroEnhancedCenter = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${heroImage1})` }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-white/20 animate-float">
        <Star className="h-8 w-8" />
      </div>
      <div className="absolute top-40 right-20 text-white/20 animate-float" style={{ animationDelay: '2s' }}>
        <Zap className="h-6 w-6" />
      </div>
      
      {/* Content with Strong Background */}
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
        <div className="bg-black/50 backdrop-blur-lg rounded-3xl p-8 lg:p-16 border border-white/10 shadow-2xl">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-8">
            New Collection Available
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none">
            <span className="block text-white drop-shadow-lg">Step Into</span>
            <span className="block text-accent drop-shadow-lg">Premium Style</span>
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <p className="text-xl md:text-2xl lg:text-3xl text-white leading-relaxed">
              Discover the latest collection of premium sneakers from top brands. 
              <span className="block mt-2 font-medium">
                Elevate your style with authentic, quality footwear.
              </span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button size="lg" className="text-lg px-10 py-6 bg-accent hover:bg-accent-dark shadow-xl" asChild>
              <Link to="/products">
                Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-black" asChild>
              <Link to="/products">New Arrivals</Link>
            </Button>
          </div>
          
          {/* Stats inside the content box */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">1000+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Free</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Shipping</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};