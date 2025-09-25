// Django Wishlist Hook - replaces Supabase wishlist hook
import { useState, useEffect } from 'react';
import { apiClient, APIError } from '@/lib/api';
import { useAuth } from './useDjangoAuth';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  original_price?: number;
}

interface WishlistItem {
  id: string;
  product: Product;
  created_at: string;
}

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getWishlist();
      setWishlistItems(response);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err instanceof APIError ? err.message : 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      throw new Error('User must be logged in to manage wishlist');
    }

    try {
      const response = await apiClient.toggleWishlist(productId) as any;
      await fetchWishlist(); // Refresh wishlist after toggling
      return { 
        success: true, 
        message: response.message || 'Wishlist updated',
        item: response.item || null
      };
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      const message = err instanceof APIError ? err.message : 'Failed to update wishlist';
      setError(message);
      return { error: message };
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.product.id === productId);
  };

  const getWishlistCount = (): number => {
    return wishlistItems.length;
  };

  const refetch = () => {
    fetchWishlist();
  };

  return {
    wishlistItems,
    loading,
    error,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    refetch,
  };
}