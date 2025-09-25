// Django Products Hook - replaces Supabase products hook
import { useState, useEffect } from 'react';
import { apiClient, APIError } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  brand: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url: string;
  category?: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  stock_quantity: number;
  in_stock: boolean;
  is_new: boolean;
  featured: boolean;
  is_on_sale: boolean;
  discount_percentage: number;
  is_wishlisted: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductsResponse {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface UseProductsOptions {
  search?: string;
  brand?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  page?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getProducts(options);
      setProducts(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof APIError ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(options)]); // Dependencies on search params

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
  };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getProduct(id);
      setProduct(response);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof APIError ? err.message : 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const refetch = () => {
    fetchProduct();
  };

  return {
    product,
    loading,
    error,
    refetch,
  };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getFeaturedProducts();
      setProducts(response.results);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err instanceof APIError ? err.message : 'Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const refetch = () => {
    fetchFeaturedProducts();
  };

  return {
    products,
    loading,
    error,
    refetch,
  };
}