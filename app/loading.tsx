import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F4F5]">
      <div className="w-10 h-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mb-6" />
      <p className="text-sm font-medium text-gray-500">Loading...</p>
    </div>
  );
};

export default Loading;
