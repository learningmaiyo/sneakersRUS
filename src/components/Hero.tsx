import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-sneakers.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-primary-foreground max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Step Into
          <span className="block bg-gradient-accent bg-clip-text text-transparent">
            Premium Style
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
          Discover the latest collection of premium sneakers from top brands. 
          Elevate your style with authentic, quality footwear.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            Shop Collection
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            New Arrivals
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;