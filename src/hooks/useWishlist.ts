import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlistItems(data?.map(item => item.product_id) || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to manage your wishlist",
        variant: "destructive"
      });
      return;
    }

    try {
      const isInWishlist = wishlistItems.includes(productId);

      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        setWishlistItems(prev => prev.filter(id => id !== productId));
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist"
        });
      } else {
        const { error } = await supabase
          .from('wishlist_items')
          .insert({
            user_id: user.id,
            product_id: productId
          });

        if (error) throw error;
        setWishlistItems(prev => [...prev, productId]);
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
    }
  };

  return { wishlistItems, loading, toggleWishlist };
}