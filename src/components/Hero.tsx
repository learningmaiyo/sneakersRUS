import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap } from "lucide-react";
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
      
      {/* Multiple Gradient Overlays for Depth - More subtle */}
      <div className="absolute inset-0 bg-gradient-hero opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      
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
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 animate-fade-in">
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-6">
            New Collection Available
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none">
          <span className="block animate-slide-up">Step Into</span>
          <span className="block text-white animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Premium Style
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Discover the latest collection of premium sneakers from top brands. 
          <span className="block mt-2 font-medium text-white">
            Elevate your style with authentic, quality footwear.
          </span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            size="lg" 
            className="text-lg px-10 py-6 bg-accent hover:bg-accent-dark border-0 shadow-card hover:shadow-hover transition-all duration-500 font-semibold group text-white"
          >
            Shop Collection
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-10 py-6 border-2 border-white/80 text-white hover:bg-white hover:text-black transition-all duration-500 font-semibold group bg-transparent"
          >
            New Arrivals
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">1000+</div>
            <div className="text-white/70 text-sm uppercase tracking-wide">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-white/70 text-sm uppercase tracking-wide">Brands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-white/70 text-sm uppercase tracking-wide">Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">Free</div>
            <div className="text-white/70 text-sm uppercase tracking-wide">Shipping</div>
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