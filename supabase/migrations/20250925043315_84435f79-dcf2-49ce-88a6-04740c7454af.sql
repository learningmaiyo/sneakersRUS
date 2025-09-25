-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  original_price DECIMAL(10,2) CHECK (original_price > price),
  image_url TEXT NOT NULL,
  is_new BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  category TEXT,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create wishlist table
CREATE TABLE public.wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlist
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create wishlist policies
CREATE POLICY "Users can view their own wishlist" 
ON public.wishlist_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist" 
ON public.wishlist_items 
FOR ALL 
USING (auth.uid() = user_id);

-- Create cart table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, size)
);

-- Enable RLS on cart
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create cart policies
CREATE POLICY "Users can view their own cart" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart" 
ON public.cart_items 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for products updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for cart_items updated_at
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, brand, price, original_price, image_url, is_new, in_stock, stock_quantity, category, sizes, description) VALUES
('Air Force Classic', 'Nike', 129.99, 159.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', true, true, 50, 'lifestyle', '{"6","7","8","9","10","11","12"}', 'Classic Nike Air Force sneakers with timeless style'),
('Ultraboost 22', 'Adidas', 189.99, NULL, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop', false, true, 30, 'running', '{"6","7","8","9","10","11","12"}', 'Performance running shoes with Boost technology'),
('Chuck Taylor All Star', 'Converse', 79.99, NULL, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop', false, false, 0, 'lifestyle', '{"6","7","8","9","10","11","12"}', 'Iconic canvas sneakers for everyday wear'),
('Old Skool Pro', 'Vans', 89.99, NULL, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop', true, true, 25, 'skate', '{"6","7","8","9","10","11","12"}', 'Durable skate shoes with classic Vans styling');