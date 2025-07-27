import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { login, logout } from './slices/authSlice';
import { UserType } from '../types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for auth
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { userId, userType, isAuthLoaded } = useAppSelector((state) => state.auth);

  const loginUser = (id: string, type: UserType) => {
    dispatch(login({ id, type }));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    userId,
    userType,
    isAuthLoaded,
    login: loginUser,
    logout: logoutUser,
  };
};