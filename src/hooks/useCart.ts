import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size?: string;
  created_at: string;
  updated_at: string;
  products: {
    name: string;
    brand: string;
    price: number;
    image_url: string;
    in_stock: boolean;
  };
}

export interface AggregatedCartItem {
  product_id: string;
  size?: string;
  quantity: number;
  products: {
    name: string;
    brand: string;
    price: number;
    image_url: string;
    in_stock: boolean;
  };
  // Keep track of database IDs for operations
  item_ids: string[];
}

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to aggregate cart items
  const aggregateCartItems = (items: CartItem[]): AggregatedCartItem[] => {
    const aggregated = new Map<string, AggregatedCartItem>();

    items.forEach(item => {
      // Create a unique key based on product_id, size, and other attributes
      const key = `${item.product_id}-${item.size || 'no-size'}`;
      
      if (aggregated.has(key)) {
        const existing = aggregated.get(key)!;
        existing.quantity += item.quantity;
        existing.item_ids.push(item.id);
      } else {
        aggregated.set(key, {
          product_id: item.product_id,
          size: item.size,
          quantity: item.quantity,
          products: item.products,
          item_ids: [item.id]
        });
      }
    });

    return Array.from(aggregated.values());
  };

  // Get aggregated cart items
  const aggregatedCartItems = aggregateCartItems(cartItems);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            name,
            brand,
            price,
            image_url,
            in_stock
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, size?: string, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive"
      });
      return;
    }

    try {
      // First fetch fresh data to ensure we have the latest cart state
      const { data: currentCartItems, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size || null);

      if (fetchError) throw fetchError;

      if (currentCartItems && currentCartItems.length > 0) {
        // Update existing item (take the first one if multiple exist)
        const existingItem = currentCartItems[0];
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            size
          });

        if (error) throw error;
      }

      await fetchCart();
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  const updateQuantity = async (productId: string, size: string | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId, size);
      return;
    }

    try {
      // Find the aggregated item
      const aggregatedItem = aggregatedCartItems.find(
        item => item.product_id === productId && item.size === size
      );

      if (!aggregatedItem) return;

      // If we have multiple database entries for the same item, merge them into one
      if (aggregatedItem.item_ids.length > 1) {
        // Delete all but the first entry
        const idsToDelete = aggregatedItem.item_ids.slice(1);
        await supabase
          .from('cart_items')
          .delete()
          .in('id', idsToDelete);
      }

      // Update the first (or only) entry with the new quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', aggregatedItem.item_ids[0]);

      if (error) throw error;
      await fetchCart();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    }
  };

  const removeFromCart = async (productId: string, size?: string) => {
    try {
      // Find all database entries for this product/size combination
      const aggregatedItem = aggregatedCartItems.find(
        item => item.product_id === productId && item.size === size
      );

      if (!aggregatedItem) return;

      // Delete all database entries for this aggregated item
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .in('id', aggregatedItem.item_ids);

      if (error) throw error;
      
      // Update local state
      setCartItems(prev => prev.filter(item => 
        !(item.product_id === productId && item.size === size)
      ));
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    }
  };

  const getTotalItems = () => {
    return aggregatedCartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return aggregatedCartItems.reduce((total, item) => total + (item.products.price * item.quantity), 0);
  };

  const getRawCartItems = () => {
    return cartItems; // Return the raw database items for checkout
  };

  return {
    cartItems: aggregatedCartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    getRawCartItems,
    refetch: fetchCart
  };
}