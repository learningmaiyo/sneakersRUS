-- Add more products to showcase variety
INSERT INTO products (name, brand, description, price, original_price, image_url, is_new, in_stock, stock_quantity, category, sizes) VALUES
-- Nike Products
('Air Max 270', 'Nike', 'Modern lifestyle sneakers with max air technology', 149.99, 179.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', true, true, 35, 'lifestyle', ARRAY['6','7','8','9','10','11','12']),
('Jordan 1 Retro High', 'Nike', 'Iconic basketball shoes with timeless style', 179.99, null, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop', false, true, 20, 'basketball', ARRAY['7','8','9','10','11','12']),
('React Infinity Run', 'Nike', 'Running shoes designed for comfort and performance', 159.99, null, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop', false, true, 40, 'running', ARRAY['6','7','8','9','10','11','12']),

-- Adidas Products  
('Stan Smith', 'Adidas', 'Classic white tennis shoes with green accents', 99.99, 119.99, 'https://images.unsplash.com/photo-1561909114-f9c740de6fef?w=400&h=400&fit=crop', false, true, 60, 'lifestyle', ARRAY['6','7','8','9','10','11','12']),
('NMD R1', 'Adidas', 'Street-ready shoes with boost cushioning', 139.99, null, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop', true, true, 25, 'lifestyle', ARRAY['6','7','8','9','10','11','12']),
('Gazelle', 'Adidas', 'Retro suede sneakers with classic 3-stripes', 89.99, null, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop', false, false, 0, 'lifestyle', ARRAY['6','7','8','9','10','11','12']),

-- Converse Products
('One Star', 'Converse', 'Low-top sneakers with star logo', 69.99, null, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop', false, true, 30, 'lifestyle', ARRAY['6','7','8','9','10','11','12']),
('Chuck 70 High Top', 'Converse', 'Premium version of the classic Chuck Taylor', 89.99, 99.99, 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop', true, true, 18, 'lifestyle', ARRAY['6','7','8','9','10','11','12']),

-- Vans Products
('Authentic', 'Vans', 'Original classic skate shoe with waffle sole', 59.99, null, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop', false, true, 45, 'skate', ARRAY['6','7','8','9','10','11','12']),
('Sk8-Hi', 'Vans', 'High-top skate shoes with padded collar', 74.99, null, 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=400&h=400&fit=crop', false, true, 22, 'skate', ARRAY['6','7','8','9','10','11','12']),

-- New Balance
('990v5', 'New Balance', 'Premium running shoes made in USA', 199.99, null, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop', false, true, 15, 'running', ARRAY['7','8','9','10','11','12']),
('327', 'New Balance', 'Retro-inspired lifestyle sneakers', 89.99, 109.99, 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop', true, true, 35, 'lifestyle', ARRAY['6','7','8','9','10','11','12']);