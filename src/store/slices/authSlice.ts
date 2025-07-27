import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../../types';

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
      localStorage.setItem('userId', action.payload.id);
      if (action.payload.type) {
        localStorage.setItem('userType', action.payload.type);
      }
    },
    logout: (state) => {
      state.userId = null;
      state.userType = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
    },
    loadAuth: (state) => {
      const id = localStorage.getItem('userId');
      const type = localStorage.getItem('userType') as UserType;
      
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