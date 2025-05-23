import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64" aria-label="Loading content">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
  </div>
);

export default LoadingSpinner;