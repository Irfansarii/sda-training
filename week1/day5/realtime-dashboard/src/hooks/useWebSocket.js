import { useMemo } from 'react';
import WebSocketService from '../services/WebSocketService';

export function useWebSocket(url = 'ws://localhost:8080') {
  const wsService = useMemo(() => {
    return new WebSocketService(url);
  }, [url]);

  return wsService;
}