-- Update the broken image URL for Vans Authentic
UPDATE public.products 
SET image_url = 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop'
WHERE name = 'Authentic' AND brand = 'Vans';