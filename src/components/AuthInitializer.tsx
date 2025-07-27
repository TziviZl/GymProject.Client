import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { loadAuth } from '../store/slices/authSlice';

export const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAuth());
  }, [dispatch]);

  return null;
};

