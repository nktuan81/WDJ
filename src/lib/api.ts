const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiError {
  error: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers && typeof options.headers === 'object' && !Array.isArray(options.headers) && !(options.headers instanceof Headers)
        ? (options.headers as Record<string, string>)
        : {}),
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        const error: ApiError = isJson
          ? await response.json().catch(() => ({ error: 'An error occurred' }))
          : { error: response.statusText || 'Request failed' };
        throw new Error(error.error || 'Request failed');
      }

      if (response.status === 204) return null as T;
      return isJson ? await response.json() : (null as T);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<{
      token: string;
      user: { id: string; email: string; role: string };
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async refreshToken() {
    const response = await this.request<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
    });
    this.setToken(response.token);
    return response;
  }

  logout() {
    this.setToken(null);
  }

  // Menu
  async getMenu(element?: string) {
    const endpoint = element ? `/api/menu/${element}` : '/api/menu';
    return this.request(endpoint);
  }

  // Reservations
  async createReservation(data: {
    name: string;
    email?: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    notes?: string;
  }) {
    return this.request('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Discount codes
  async validateDiscountCode(code: string) {
    return this.request(`/api/discount/${code}`);
  }

  // Fortune
  async drawFortune() {
    return this.request<{
      fortune: { de: string; en: string; cn: string };
      discount: {
        code: string;
        discountPercent: number;
        dishId?: string;
      };
    }>('/api/fortune', {
      method: 'POST',
    });
  }

  // Blog
  async getBlogPosts(dishId?: string) {
    const params = dishId ? `?dishId=${dishId}` : '';
    return this.request(`/api/blog${params}`);
  }

  async getBlogPost(id: string) {
    return this.request(`/api/blog/${id}`);
  }

  // Admin endpoints
  async getReservations(status?: string, date?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (date) params.append('date', date);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/admin/reservations${query}`);
  }

  async updateReservation(id: string, data: any) {
    return this.request(`/api/admin/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReservation(id: string) {
    return this.request(`/api/admin/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  async createMenuItem(data: any) {
    return this.request('/api/admin/menu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMenuItem(id: string, data: any) {
    return this.request(`/api/admin/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMenuItem(id: string) {
    return this.request(`/api/admin/menu/${id}`, {
      method: 'DELETE',
    });
  }

  async getDiscountCodes() {
    return this.request('/api/admin/discounts');
  }

  async createDiscountCode(data: any) {
    return this.request('/api/admin/discounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDiscountCode(id: string, data: any) {
    return this.request(`/api/admin/discounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDiscountCode(id: string) {
    return this.request(`/api/admin/discounts/${id}`, {
      method: 'DELETE',
    });
  }

  async getBlogPostsAdmin() {
    return this.request('/api/admin/blog/all');
  }

  async createBlogPost(data: any) {
    return this.request('/api/admin/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(id: string, data: any) {
    return this.request(`/api/admin/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(id: string) {
    return this.request(`/api/admin/blog/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
