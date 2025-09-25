// Django API client - replaces Supabase integration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-django-backend.com/api' 
  : 'http://localhost:8000/api';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();
      throw new APIError(response.status, error);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as T;
  }

  // Generic HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<T>(response);
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.post<{
      user: any;
      tokens: { access: string; refresh: string };
      message: string;
    }>('/auth/login/', { email, password });
    
    // Store tokens
    localStorage.setItem('access_token', response.tokens.access);
    localStorage.setItem('refresh_token', response.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    password_confirm: string;
    username: string;
    first_name?: string;
    last_name?: string;
  }) {
    const response = await this.post<{
      user: any;
      tokens: { access: string; refresh: string };
      message: string;
    }>('/auth/register/', userData);
    
    // Store tokens
    localStorage.setItem('access_token', response.tokens.access);
    localStorage.setItem('refresh_token', response.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      this.logout();
      throw new APIError(response.status, 'Token refresh failed');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    
    return data;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Products API
  async getProducts(params?: {
    search?: string;
    brand?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    size?: string;
    color?: string;
    page?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = searchParams.toString() 
      ? `/v1/products/?${searchParams.toString()}`
      : '/v1/products/';
    
    return this.get<{ results: any[]; count: number; next: string | null; previous: string | null }>(endpoint);
  }

  async getProduct(id: string) {
    return this.get<any>(`/v1/products/${id}/`);
  }

  async getFeaturedProducts() {
    return this.get<{ results: any[] }>('/v1/products/featured/');
  }

  // Cart API
  async getCart() {
    return this.get<any[]>('/v1/cart/aggregated/');
  }

  async addToCart(productId: string, quantity: number = 1, size?: string) {
    return this.post('/v1/cart/add_item/', {
      product_id: productId,
      quantity,
      size: size || ''
    });
  }

  async updateCartQuantity(productId: string, quantity: number, size?: string) {
    return this.put('/v1/cart/update_quantity/', {
      product_id: productId,
      quantity,
      size: size || ''
    });
  }

  async removeFromCart(productId: string, size?: string) {
    const params = new URLSearchParams({ product_id: productId });
    if (size) params.append('size', size);
    
    return this.delete(`/v1/cart/remove_item/?${params.toString()}`);
  }

  async clearCart() {
    return this.delete('/v1/cart/clear/');
  }

  async getCartTotals() {
    return this.get<{
      total_items: number;
      subtotal: string;
      tax: string;
      total: string;
      total_usd: number;
    }>('/v1/cart/totals/');
  }

  async getRawCartItems() {
    return this.get<any[]>('/v1/cart/raw_items/');
  }

  // Orders API
  async createOrder(data?: { shipping_address?: any; notes?: string }) {
    return this.post('/v1/orders/', data || {});
  }

  async getOrders() {
    return this.get<{ results: any[] }>('/v1/orders/my_orders/');
  }

  async getOrder(id: string) {
    return this.get<any>(`/v1/orders/${id}/`);
  }

  async cancelOrder(id: string) {
    return this.post(`/v1/orders/${id}/cancel/`);
  }

  // Wishlist API
  async getWishlist() {
    return this.get<any[]>('/v1/wishlist/');
  }

  async toggleWishlist(productId: string) {
    return this.post('/v1/wishlist/toggle/', { product_id: productId });
  }

  // Payments API
  async createCheckoutSession() {
    return this.post<{ url: string; order_id: string }>('/payments/create-checkout/');
  }

  // Profile API
  async getProfile() {
    return this.get<any>('/v1/profiles/me/');
  }

  async updateProfile(data: any) {
    return this.put('/v1/profiles/me/', data);
  }
}

export const apiClient = new APIClient();
export { APIError };