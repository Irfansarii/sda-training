import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface OfflineAction {
  id: string;
  method: string;
  url: string;
  data: any;
  timestamp: number;
  retries: number;
}

interface OfflineData {
  key: string;
  data: any;
  timestamp: number;
  expiresAt?: number;
}

class OfflineService {
  private static instance: OfflineService;
  private offlineQueue: OfflineAction[] = [];
  private offlineData: Map<string, OfflineData> = new Map();
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;

  private constructor() {
    this.initializeNetworkListener();
    this.loadOfflineQueue();
    this.loadOfflineData();
  }

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      
      if (this.isOnline && !this.syncInProgress) {
        this.syncOfflineData();
      }
    });
  }

  private async loadOfflineQueue() {
    try {
      const queueData = await AsyncStorage.getItem('offlineQueue');
      if (queueData) {
        this.offlineQueue = JSON.parse(queueData);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  private async saveOfflineQueue() {
    try {
      await AsyncStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  private async loadOfflineData() {
    try {
      const data = await AsyncStorage.getItem('offlineData');
      if (data) {
        const parsedData = JSON.parse(data);
        this.offlineData = new Map(parsedData);
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }

  private async saveOfflineData() {
    try {
      const data = Array.from(this.offlineData.entries());
      await AsyncStorage.setItem('offlineData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  async queueRequest(method: string, url: string, data: any) {
    const action: OfflineAction = {
      id: Date.now().toString(),
      method,
      url,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    this.offlineQueue.push(action);
    await this.saveOfflineQueue();
  }

  async storeOfflineData(key: string, data: any, expiresAt?: number) {
    const offlineData: OfflineData = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt,
    };

    this.offlineData.set(key, offlineData);
    await this.saveOfflineData();
  }

  async getOfflineData(key: string): Promise<any> {
    const offlineData = this.offlineData.get(key);
    
    if (!offlineData) {
      return null;
    }

    // Check if data has expired
    if (offlineData.expiresAt && Date.now() > offlineData.expiresAt) {
      this.offlineData.delete(key);
      await this.saveOfflineData();
      return null;
    }

    return offlineData.data;
  }

  async syncOfflineData() {
    if (this.syncInProgress || !this.isOnline || this.offlineQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      const queue = [...this.offlineQueue];
      this.offlineQueue = [];
      await this.saveOfflineQueue();

      for (const action of queue) {
        try {
          await this.syncRequest(action);
        } catch (error) {
          console.error('Failed to sync request:', error);
          
          // Re-queue failed requests with retry limit
          if (action.retries < 3) {
            action.retries++;
            this.offlineQueue.push(action);
          }
        }
      }

      await this.saveOfflineQueue();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncRequest(action: OfflineAction) {
    // Implement actual sync logic here
    // This would typically make the API call
    console.log('Syncing offline request:', action);
  }

  getOfflineQueue(): OfflineAction[] {
    return this.offlineQueue;
  }

  getOfflineDataKeys(): string[] {
    return Array.from(this.offlineData.keys());
  }

  isConnected(): boolean {
    return this.isOnline;
  }

  async clearOfflineData() {
    this.offlineData.clear();
    this.offlineQueue = [];
    await AsyncStorage.multiRemove(['offlineQueue', 'offlineData']);
  }
}

export const offlineService = OfflineService.getInstance();
