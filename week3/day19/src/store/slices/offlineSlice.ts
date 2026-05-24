import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OfflineState {
  items: any[];
  syncing: boolean;
  error: string | null;
}

const initialState: OfflineState = {
  items: [],
  syncing: false,
  error: null,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOfflineItems: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
    setOfflineSyncing: (state, action: PayloadAction<boolean>) => {
      state.syncing = action.payload;
    },
    setOfflineError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setOfflineItems, setOfflineSyncing, setOfflineError } = offlineSlice.actions;
export default offlineSlice.reducer;
