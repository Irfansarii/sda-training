import { useMemo } from 'react';
import ApiService from '../services/ApiService';

export function useApiService() {
  const apiService = useMemo(() => {
    return new ApiService('https://jsonplaceholder.typicode.com');
  }, []);

  return apiService;
}