import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/** @Logic.Health.ServiceType */
export interface HealthService {
  status: 'ok' | 'error' | 'loading';
  error?: string;
  lastChecked?: string;
}

/** @Logic.Health.State */
export interface HealthState {
  supabase: HealthService;
  openrouter: HealthService;
  loading: boolean;
}

const initialState: HealthState = {
  supabase: { status: 'loading' },
  openrouter: { status: 'loading' },
  loading: false,
};

/** @Logic.Health.Thunk.CheckSupabase */
export const checkSupabaseHealth = createAsyncThunk(
  'health/checkSupabase',
  async (_, { rejectWithValue }) => {
    const res = await fetch('/api/health/supabase');
    if (!res.ok) {
      const error = await res.json();
      return rejectWithValue(error.error || 'Failed to check Supabase');
    }
    return { 
      status: 'ok' as const, 
      lastChecked: new Date().toISOString() 
    };
  }
);

/** @Logic.Health.Thunk.CheckOpenRouter */
export const checkOpenRouterHealth = createAsyncThunk(
  'health/checkOpenRouter',
  async (_, { rejectWithValue }) => {
    const res = await fetch('/api/health/openrouter');
    if (!res.ok) {
      const error = await res.json();
      return rejectWithValue(error.error || 'Failed to check OpenRouter');
    }
    return { 
      status: 'ok' as const, 
      lastChecked: new Date().toISOString() 
    };
  }
);

/** @Logic.Health.Thunk.CheckAll */
export const checkAllHealth = createAsyncThunk(
  'health/checkAll',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(checkSupabaseHealth()),
      dispatch(checkOpenRouterHealth()),
    ]);
  }
);

/** @Logic.Health.Slice */
const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    resetHealth: (state) => {
      state.supabase = { status: 'loading' };
      state.openrouter = { status: 'loading' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSupabaseHealth.pending, (state) => {
        state.supabase.status = 'loading';
        state.supabase.error = undefined;
      })
      .addCase(checkSupabaseHealth.fulfilled, (state, action) => {
        state.supabase.status = action.payload.status;
        state.supabase.lastChecked = action.payload.lastChecked;
        state.supabase.error = undefined;
      })
      .addCase(checkSupabaseHealth.rejected, (state, action) => {
        state.supabase.status = 'error';
        state.supabase.error = action.payload as string;
      })
      .addCase(checkOpenRouterHealth.pending, (state) => {
        state.openrouter.status = 'loading';
        state.openrouter.error = undefined;
      })
      .addCase(checkOpenRouterHealth.fulfilled, (state, action) => {
        state.openrouter.status = action.payload.status;
        state.openrouter.lastChecked = action.payload.lastChecked;
        state.openrouter.error = undefined;
      })
      .addCase(checkOpenRouterHealth.rejected, (state, action) => {
        state.openrouter.status = 'error';
        state.openrouter.error = action.payload as string;
      });
  },
});

export const { resetHealth } = healthSlice.actions;
export default healthSlice.reducer;
