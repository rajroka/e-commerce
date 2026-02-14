// components/Loading.tsx
'use client';

import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-900">
      <FiLoader className="animate-spin text-blue-600 dark:text-white text-5xl" />
    </div>
  );
};

export default Loading;
