import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4" role="alert">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{message || "An unexpected error occurred."}</span>
  </div>
);

export default ErrorMessage;