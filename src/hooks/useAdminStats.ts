import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (productsError) throw productsError;

      // Fetch users count from profiles
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Fetch orders count and revenue
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount');

      if (ordersError) throw ordersError;

      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalUsers: usersCount || 0,
        totalOrders,
        totalRevenue,
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}