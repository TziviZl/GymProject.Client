import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../../types';
import { storage } from '../../utils/storage';

interface AuthState {
  userId: string | null;
  userType: UserType;
  isAuthLoaded: boolean;
}

const initialState: AuthState = {
  userId: null,
  userType: null,
  isAuthLoaded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; type: UserType }>) => {
      state.userId = action.payload.id;
      state.userType = action.payload.type;
      storage.setUserId(action.payload.id);
      if (action.payload.type) {
        storage.setUserType(action.payload.type);
      }
    },
    logout: (state) => {
      state.userId = null;
      state.userType = null;
      storage.clearAuth();
    },
    loadAuth: (state) => {
      const id = storage.getUserId();
      const type = storage.getUserType();
      
      if (id && type && ['gymnast', 'trainer', 'secretary'].includes(type)) {
        state.userId = id;
        state.userType = type;
      }
      state.isAuthLoaded = true;
    },
  },
});

export const { login, logout, loadAuth } = authSlice.actions;
export default authSlice.reducer;