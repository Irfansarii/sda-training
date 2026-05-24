import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    setAnalyticsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAnalyticsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAnalyticsData, setAnalyticsLoading, setAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
