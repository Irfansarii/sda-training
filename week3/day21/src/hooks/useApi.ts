import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { realtimeService } from '../services/realtimeService';
import { offlineService } from '../services/offlineService';

interface UseApiOptions {
  enableRealtime?: boolean;
  enableOffline?: boolean;
  cacheKey?: string;
  cacheExpiry?: number;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(offlineService.isConnected());

  const {
    enableRealtime = false,
    enableOffline = true,
    cacheKey,
    cacheExpiry = 5 * 60 * 1000, // 5 minutes
  } = options;

  const fetchData = useCallback(async () => {
    if (!isOnline && enableOffline) {
      // Try to get cached data
      const cachedData = await offlineService.getOfflineData(cacheKey || endpoint);
      if (cachedData) {
        setData(cachedData);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<T>(endpoint);
      setData(response.data);

      // Cache data if offline support is enabled
      if (enableOffline && cacheKey) {
        await offlineService.storeOfflineData(cacheKey, response.data, Date.now() + cacheExpiry);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, isOnline, enableOffline, cacheKey, cacheExpiry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (enableRealtime) {
      const handleRealtimeUpdate = (updateData: any) => {
        setData(updateData);
      };

      realtimeService.subscribe('dataUpdate', handleRealtimeUpdate);

      return () => {
        realtimeService.unsubscribe('dataUpdate', handleRealtimeUpdate);
      };
    }
  }, [enableRealtime]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    isOnline,
  };
}
