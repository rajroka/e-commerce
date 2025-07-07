'use client';
import React from 'react';
import { Provider } from 'react-redux';
import store from './store'; 
import { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import AuthSync from '@/components/AuthSync';

const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
       <AuthSync />
      <PersistGate loading={<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900">
      <svg
        className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading spinner"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold mt-4">
        Loading...
      </p>
    </div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
