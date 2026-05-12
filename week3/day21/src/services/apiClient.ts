import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private isOnline: boolean = true;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupNetworkListener();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      
      if (this.isOnline) {
        this.syncOfflineData();
      }
    });
  }

  private async handleUnauthorized() {
    await AsyncStorage.removeItem('authToken');
    // Navigate to login screen
    // This would typically use a navigation service
  }

  private async syncOfflineData() {
    // Implement offline data synchronization
    const offlineData = await AsyncStorage.getItem('offlineData');
    if (offlineData) {
      const data = JSON.parse(offlineData);
      // Sync offline data with server
      for (const item of data) {
        try {
          await this.makeRequest(item.method, item.url, item.data);
        } catch (error) {
          console.error('Failed to sync offline data:', error);
        }
      }
      await AsyncStorage.removeItem('offlineData');
    }
  }

  private async makeRequest<T>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request({
        method: method as any,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (!this.isOnline) {
        // Queue request for offline sync
        await this.queueOfflineRequest(method, url, data);
        throw new Error('Request queued for offline sync');
      }
      throw error;
    }
  }

  private async queueOfflineRequest(method: string, url: string, data: any) {
    const offlineData = await AsyncStorage.getItem('offlineData');
    const queue = offlineData ? JSON.parse(offlineData) : [];
    
    queue.push({
      method,
      url,
      data,
      timestamp: Date.now(),
    });
    
    await AsyncStorage.setItem('offlineData', JSON.stringify(queue));
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }) {
    return this.makeRequest<{ user: User; token: string }>('POST', '/auth/login', credentials);
  }

  async logout() {
    return this.makeRequest('POST', '/auth/logout');
  }

  async getCurrentUser() {
    return this.makeRequest<User>('GET', '/auth/me');
  }

  // User methods
  async getUsers(filters: UserFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.makeRequest<PaginatedResponse<User>>('GET', `/users?${params}`);
  }

  async getUser(id: string) {
    return this.makeRequest<User>('GET', `/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.makeRequest<User>('PUT', `/users/${id}`, data);
  }

  // Analytics methods
  async getAnalytics(timeRange: string = '30d') {
    return this.makeRequest<AnalyticsData>('GET', `/analytics?timeRange=${timeRange}`);
  }

  // Real-time methods
  async subscribeToUpdates(callback: (data: any) => void) {
    // Implement WebSocket connection
    const ws = new WebSocket(`${this.baseURL.replace('http', 'ws')}/ws`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    
    return ws;
  }
}

export const apiClient = new ApiClient(process.env.API_BASE_URL || 'http://localhost:3000/api/v1');
