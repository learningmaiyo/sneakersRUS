import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage1 from "@/assets/hero-shoe-1.jpg";
import heroImage2 from "@/assets/hero-shoe-2.jpg";
import heroImage3 from "@/assets/hero-shoe-3.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background Images */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[10s] hover:scale-110 hero-bg-animation"
        style={{ backgroundImage: `url(${heroImage1})` }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[10s] hover:scale-110 hero-bg-animation opacity-0"
        style={{ backgroundImage: `url(${heroImage2})` }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[10s] hover:scale-110 hero-bg-animation opacity-0"
        style={{ backgroundImage: `url(${heroImage3})` }}
      />
      
      {/* Multiple Gradient Overlays for Depth - Much lighter */}
      <div className="absolute inset-0 bg-gradient-hero opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-white/20 float-animation">
        <Star className="h-8 w-8" />
      </div>
      <div className="absolute top-40 right-20 text-white/20 float-animation" style={{ animationDelay: '2s' }}>
        <Zap className="h-6 w-6" />
      </div>
      <div className="absolute bottom-40 left-20 text-white/20 float-animation" style={{ animationDelay: '4s' }}>
        <Star className="h-10 w-10" />
      </div>
      
      {/* Content Layout - Optimized for Image Visibility */}
      <div className="relative z-10 text-white max-w-7xl mx-auto px-4 animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[80vh]">
          {/* Left Content Column - Constrained to not overlap image */}
          <div className="lg:col-span-5 text-left space-y-6 bg-black/20 backdrop-blur-md rounded-3xl p-8 lg:mr-8">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white/95 text-sm font-medium shadow-lg">
                New Collection Available
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block animate-slide-up">Step Into</span>
              <span className="block text-white animate-slide-up bg-gradient-to-r from-white via-white to-white/90 bg-clip-text" style={{ animationDelay: '0.2s' }}>
                Premium Style
              </span>
            </h1>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <p className="text-lg md:text-xl text-white/95 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Discover the latest collection of premium sneakers from top brands. 
                <span className="block mt-2 font-medium text-white">
                  Elevate your style with authentic, quality footwear.
                </span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in mb-6" style={{ animationDelay: '0.6s' }}>
              <Button 
                size="lg" 
                className="text-base px-8 py-4 bg-accent hover:bg-accent-dark border-0 shadow-card hover:shadow-hover transition-all duration-500 font-semibold group text-white"
                asChild
              >
                <Link to="/products">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 py-4 border-2 border-white/80 text-white hover:bg-white hover:text-black transition-all duration-500 font-semibold group bg-transparent backdrop-blur-sm"
                asChild
              >
                <Link to="/products">
                  New Arrivals
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>

            {/* Stats Section - Compact */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">1000+</div>
                  <div className="text-white/80 text-xs uppercase tracking-wide">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">50+</div>
                  <div className="text-white/80 text-xs uppercase tracking-wide">Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-white/80 text-xs uppercase tracking-wide">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">Free</div>
                  <div className="text-white/80 text-xs uppercase tracking-wide">Shipping</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Visual Column - Full space for product showcase */}
          <div className="lg:col-span-7 flex items-center justify-center relative min-h-[60vh] lg:min-h-[80vh]">
            {/* Subtle overlay to highlight the product area */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20 rounded-3xl"></div>
            <div className="relative z-10 text-center space-y-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-white/70 text-sm uppercase tracking-wide">Premium Collection</div>
              <div className="w-16 h-1 bg-white/40 mx-auto rounded-full"></div>
              <div className="text-white/60 text-xs">Authentic • Quality • Style</div>
            </div>
          </div>
        </div>

        {/* Mobile-only stats - shown below content on small screens */}
        <div className="lg:hidden mt-8 bg-black/30 backdrop-blur-md rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">1000+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">50+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">Free</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Shipping</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;