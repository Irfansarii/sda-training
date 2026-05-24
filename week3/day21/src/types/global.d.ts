declare var process: {
  env: {
    API_BASE_URL?: string;
  };
};

declare type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

declare type UserFilters = Record<string, string | number | boolean | null | undefined>;

declare type AnalyticsData = Record<string, any>;
