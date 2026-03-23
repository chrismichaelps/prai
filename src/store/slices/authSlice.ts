import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User, Session } from '@supabase/supabase-js'

/** @Store.Slice.Auth */
export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  initialized: false,
}

/** @Store.Thunk.Auth */
export const fetchSession = createAsyncThunk<{ user: User | null; session: Session | null }, void, { rejectValue: string }>(
  'auth/fetchSession',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (data.error) return rejectWithValue(data.error)
      return { user: data.user, session: data.session }
    } catch (error) {
      return rejectWithValue('Failed to fetch session')
    }
  }
)


/** @Store.Thunk.Auth */
export const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/signout', { method: 'POST' })
      const data = await res.json()
      if (data.error) return rejectWithValue(data.error)
    } catch (error) {
      return rejectWithValue('Failed to sign out')
    }
  }
)

/** @Store.Slice.Auth */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** @Store.Action.Auth.SetSession */
    setSession: (state, action: PayloadAction<{ user: User | null; session: Session | null }>) => {
      state.user = action.payload.user
      state.session = action.payload.session
      state.isAuthenticated = !!action.payload.session
      state.isLoading = false
      state.initialized = true
      state.error = null
    },
    /** @Store.Action.Auth.SetUser */
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    /** @Store.Action.Auth.SetLoading */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    /** @Store.Action.Auth.SetError */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    /** @Store.Action.Auth.Initialize */
    initialize: (state) => {
      state.initialized = true
    },
    /** @Store.Action.Auth.Reset */
    reset: (state) => {
      state.user = null
      state.session = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.session = action.payload.session
        state.isAuthenticated = !!action.payload.session
        state.isLoading = false
        state.initialized = true
        state.error = null
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.isLoading = false
        state.initialized = true
        state.error = action.payload ?? 'Unknown error'
      })
      .addCase(signOut.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null
        state.session = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = null
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to sign out'
      })
  },
})

export const { setSession, setUser, setLoading, setError, initialize, reset } = authSlice.actions
export default authSlice.reducer
