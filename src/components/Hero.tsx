import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import heroImage1 from "@/assets/hero-shoe-1.jpg";

const Hero = () => {
  const { products = [] } = useProducts();
  
  // Calculate real stats
  const totalProducts = products.length;
  const totalBrands = new Set(products.map(p => p.brand)).size;
  const inStockProducts = products.filter(p => p.in_stock).length;
  
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
      
      {/* Bottom Stats - Real data */}
      <div className="relative z-10 pb-8">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl mx-4 lg:mx-8 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">{totalProducts}+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{totalBrands}+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{inStockProducts}</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">In Stock</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">Free</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Shipping</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;