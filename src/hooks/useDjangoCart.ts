// Django Cart Hook - replaces Supabase cart hook with aggregation
import { useState, useEffect } from 'react';
import { apiClient, APIError } from '@/lib/api';
import { useAuth } from './useDjangoAuth';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
}

interface AggregatedCartItem {
  product: Product;
  size: string | null;
  total_quantity: number;
  item_ids: string[];
  subtotal: string;
}

interface CartTotals {
  total_items: number;
  subtotal: string;
  tax: string;
  total: string;
  total_usd: number;
}

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<AggregatedCartItem[]>([]);
  const [totals, setTotals] = useState<CartTotals | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setTotals(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch aggregated cart items and totals in parallel
      const [cartResponse, totalsResponse] = await Promise.all([
        apiClient.getCart(),
        apiClient.getCartTotals()
      ]);
      
      setCartItems(cartResponse);
      setTotals(totalsResponse);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err instanceof APIError ? err.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, size?: string, quantity: number = 1) => {
    if (!user) {
      throw new Error('User must be logged in to add items to cart');
    }

    try {
      await apiClient.addToCart(productId, quantity, size);
      await fetchCart(); // Refresh cart after adding
      return { success: true };
    } catch (err) {
      console.error('Error adding to cart:', err);
      const message = err instanceof APIError ? err.message : 'Failed to add item to cart';
      setError(message);
      return { error: message };
    }
  };

  const updateQuantity = async (productId: string, size: string | undefined, newQuantity: number) => {
    if (!user) {
      throw new Error('User must be logged in to update cart');
    }

    try {
      await apiClient.updateCartQuantity(productId, newQuantity, size);
      await fetchCart(); // Refresh cart after updating
      return { success: true };
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      const message = err instanceof APIError ? err.message : 'Failed to update cart quantity';
      setError(message);
      return { error: message };
    }
  };

  const removeFromCart = async (productId: string, size?: string) => {
    if (!user) {
      throw new Error('User must be logged in to remove items from cart');
    }

    try {
      await apiClient.removeFromCart(productId, size);
      await fetchCart(); // Refresh cart after removing
      return { success: true };
    } catch (err) {
      console.error('Error removing from cart:', err);
      const message = err instanceof APIError ? err.message : 'Failed to remove item from cart';
      setError(message);
      return { error: message };
    }
  };

  const clearCart = async () => {
    if (!user) {
      throw new Error('User must be logged in to clear cart');
    }

    try {
      await apiClient.clearCart();
      await fetchCart(); // Refresh cart after clearing
      return { success: true };
    } catch (err) {
      console.error('Error clearing cart:', err);
      const message = err instanceof APIError ? err.message : 'Failed to clear cart';
      setError(message);
      return { error: message };
    }
  };

  const getTotalItems = (): number => {
    return totals?.total_items || 0;
  };

  const getTotalPrice = (): number => {
    return totals ? parseFloat(totals.total) : 0;
  };

  const getRawCartItems = async () => {
    if (!user) {
      return [];
    }

    try {
      return await apiClient.getRawCartItems();
    } catch (err) {
      console.error('Error fetching raw cart items:', err);
      return [];
    }
  };

  const refetch = () => {
    fetchCart();
  };

  return {
    cartItems,
    totals,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getRawCartItems,
    refetch,
  };
}