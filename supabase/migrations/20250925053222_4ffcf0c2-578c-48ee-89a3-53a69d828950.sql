-- Update the broken image URL for Adidas Stan Smith
UPDATE public.products 
SET image_url = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
WHERE name = 'Stan Smith' AND brand = 'Adidas';