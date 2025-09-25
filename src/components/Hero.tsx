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
      
      {/* Content Layout - Left-aligned text, unobstructed product showcase */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-4 items-start lg:items-center min-h-[85vh]">
          {/* Left Content Column - Compact and contained */}
          <div className="lg:col-span-4 text-left space-y-6 mt-8 lg:mt-0">
            {/* Compact badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/95 text-xs font-medium shadow-lg">
                New Collection Available
              </span>
            </div>
            
            {/* Main heading - contained within left area */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
              <span className="block animate-slide-up">Step Into</span>
              <span className="block animate-slide-up bg-gradient-to-r from-white to-white/90 bg-clip-text" style={{ animationDelay: '0.2s' }}>
                Premium Style
              </span>
            </h1>
            
            {/* Description - compact background */}
            <div className="bg-black/25 backdrop-blur-sm rounded-xl p-4 mb-4 max-w-md">
              <p className="text-base md:text-lg text-white/95 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Discover premium sneakers from top brands. 
                <span className="block mt-1 font-medium text-white/90">
                  Elevate your style with authentic quality.
                </span>
              </p>
            </div>
            
            {/* Buttons - compact */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in mb-4 max-w-md" style={{ animationDelay: '0.6s' }}>
              <Button 
                size="lg" 
                className="text-sm px-6 py-3 bg-accent hover:bg-accent-dark border-0 shadow-card hover:shadow-hover transition-all duration-500 font-semibold group text-white"
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
                className="text-sm px-6 py-3 border border-white/60 text-white hover:bg-white hover:text-black transition-all duration-500 font-semibold group bg-transparent backdrop-blur-sm"
                asChild
              >
                <Link to="/products">
                  New Arrivals
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>

            {/* Stats Section - Compact and contained */}
            <div className="bg-black/25 backdrop-blur-sm rounded-xl p-4 max-w-md">
              <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="text-center">
                  <div className="text-xl font-bold text-white mb-1">1000+</div>
                  <div className="text-white/80 text-xs uppercase tracking-wide">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white mb-1">50+</div>
                  <div className="text-white/80 text-xs uppercase tracking-wide">Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white mb-1">24/7</div>
                  <div className="text-white/80 text-xs uppercase tracking-wide">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white mb-1">Free</div>
                  <div className="text-white/80 text-xs uppercase tracking-wide">Shipping</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Visual Column - Complete unobstructed showcase */}
          <div className="lg:col-span-8 flex items-center justify-center relative min-h-[50vh] lg:min-h-[85vh] mt-8 lg:mt-0">
            {/* Minimal branding element - positioned to not cover product */}
            <div className="absolute top-4 right-4 z-10 text-center bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="text-white/70 text-xs uppercase tracking-wide">Premium Collection</div>
              <div className="w-12 h-0.5 bg-white/40 mx-auto rounded-full mt-1"></div>
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