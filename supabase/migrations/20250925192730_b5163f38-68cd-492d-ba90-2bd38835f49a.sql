-- Create order_items table to track individual products in orders
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time NUMERIC NOT NULL,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for order_items
CREATE POLICY "Users can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can insert order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_order_items_updated_at
BEFORE UPDATE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add stripe_session_id to orders table to track Stripe sessions
ALTER TABLE public.orders 
ADD COLUMN stripe_session_id TEXT UNIQUE;