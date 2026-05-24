declare var process: {
  env: {
    API_BASE_URL?: string;
  };
};

declare type HeadersInit = string[][] | Record<string, string>;

interface RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: any;
}

declare function fetch(input: string, init?: RequestInit): Promise<any>;

declare class URLSearchParams {
  constructor(init?: string | string[][] | Record<string, string> | URLSearchParams);
  append(name: string, value: string): void;
  toString(): string;
}

declare module '@react-native-community/netinfo' {
  export interface NetInfoState {
    isConnected: boolean | null;
  }

  export function addEventListener(listener: (state: NetInfoState) => void): { unsubscribe: () => void };

  const NetInfo: {
    addEventListener: typeof addEventListener;
  };

  export default NetInfo;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface UserFilters {
  [key: string]: string | number | boolean | undefined;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

interface AnalyticsData {
  [key: string]: any;
}
