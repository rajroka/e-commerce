import React from 'react';

const Loading = () => {
  const skeletonArray = Array(8).fill(null); // adjust number based on your grid

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Loading products...</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {skeletonArray.map((_, index) => (
          <div
            key={index}
            className=" p-4 rounded animate-pulse flex flex-col items-center space-y-2"
          >
            <div className="bg-gray-300 h-40 w-full rounded" />
            <div className="bg-gray-300 h-4 w-3/4 rounded" />
            <div className="bg-gray-300 h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
