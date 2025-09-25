// Django Orders Hook - replaces Supabase orders hook
import { useState, useEffect } from 'react';
import { apiClient, APIError } from '@/lib/api';
import { useAuth } from './useDjangoAuth';

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    image_url: string;
  };
  quantity: number;
  price_at_time: string;
  size?: string;
  subtotal: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  user_email: string;
  total_amount: string;
  total_amount_usd: number;
  status: string;
  stripe_session_id?: string;
  shipping_address?: any;
  notes?: string;
  total_items: number;
  can_be_cancelled: boolean;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getOrders();
      setOrders(response.results);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof APIError ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const createOrder = async (data?: { shipping_address?: any; notes?: string }) => {
    if (!user) {
      throw new Error('User must be logged in to create order');
    }

    try {
      const response = await apiClient.createOrder(data) as any;
      await fetchOrders(); // Refresh orders after creating
      return { 
        success: true, 
        message: response.message || 'Order created successfully',
        order: response.order
      };
    } catch (err) {
      console.error('Error creating order:', err);
      const message = err instanceof APIError ? err.message : 'Failed to create order';
      setError(message);
      return { error: message };
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!user) {
      throw new Error('User must be logged in to cancel order');
    }

    try {
      const response = await apiClient.cancelOrder(orderId) as any;
      await fetchOrders(); // Refresh orders after cancelling
      return { 
        success: true, 
        message: response.message || 'Order cancelled successfully',
        order: response.order
      };
    } catch (err) {
      console.error('Error cancelling order:', err);
      const message = err instanceof APIError ? err.message : 'Failed to cancel order';
      setError(message);
      return { error: message };
    }
  };

  const getOrder = async (orderId: string): Promise<Order | null> => {
    if (!user) {
      return null;
    }

    try {
      return await apiClient.getOrder(orderId);
    } catch (err) {
      console.error('Error fetching order:', err);
      return null;
    }
  };

  const refetch = () => {
    fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    cancelOrder,
    getOrder,
    refetch,
  };
}