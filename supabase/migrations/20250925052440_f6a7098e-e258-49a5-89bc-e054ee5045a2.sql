-- Add featured column to products table
ALTER TABLE public.products ADD COLUMN featured boolean DEFAULT false;

-- Mark some products as featured
UPDATE public.products 
SET featured = true 
WHERE name IN (
  'Air Jordan 1 Retro High OG',
  'Adidas Ultraboost 22',
  'Nike Air Max 90',
  'Converse Chuck Taylor All Star',
  'Vans Old Skool',
  'New Balance 990v5'
);

-- Add index for better performance on featured queries
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;