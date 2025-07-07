import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <FaSpinner className="animate-spin text-4xl  mb-4" />
      <p className="text-lg font-semibold">Loading... Please wait</p>
      <p className="text-sm text-gray-500 mt-1">Ooops! Still working on it 👀</p>
    </div>
  );
};

export default Loading;
