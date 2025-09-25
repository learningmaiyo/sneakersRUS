import { Heart, Github, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Elements - More subtle */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent-light rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-4">SneakersRUS</h3>
              <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-md">
                Your premium destination for authentic sneakers from the world's top brands. 
                <span className="block mt-2 font-medium text-primary-foreground">
                  Step into style, step into quality.
                </span>
              </p>
            </div>
            
            {/* Newsletter Signup */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h4 className="text-xl font-semibold mb-3 flex items-center">
                <span className="mr-2">📧</span>
                Stay Updated
              </h4>
              <p className="text-primary-foreground/70 mb-4">
                Get the latest drops and exclusive offers
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                />
                <Button className="bg-accent hover:bg-accent-dark border-0 shadow-card font-medium">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-primary-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {[
                'New Arrivals',
                'Best Sellers', 
                'Sale',
                'Brands',
                'Size Guide',
                'Store Locator'
              ].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 hover:translate-x-1 inline-block font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-primary-foreground">Customer Care</h4>
            <ul className="space-y-3">
              {[
                'Contact Us',
                'Shipping Info',
                'Returns', 
                'Size Exchange',
                'FAQ',
                'Track Order'
              ].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 hover:translate-x-1 inline-block font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-6">
              <span className="text-primary-foreground/70 font-medium">Follow Us:</span>
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Github, label: 'GitHub' },
                  { icon: Mail, label: 'Email' }
                ].map(({ icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 transition-all duration-300 hover:scale-110"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-primary-foreground/70 mb-2">
                © 2024 SneakersRUS. All rights reserved.
              </p>
              <p className="text-primary-foreground/60 text-sm flex items-center justify-center md:justify-end">
                Made with <Heart className="h-4 w-4 mx-1 text-red-400 animate-pulse" /> by SneakersRUS Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;