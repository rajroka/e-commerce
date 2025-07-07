// components/AuthSync.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginn } from '@/redux/slice/authSlice';

const AuthSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch(loginn(JSON.parse(user)));
    }
  }, []);

  return null;
};

export default AuthSync;
