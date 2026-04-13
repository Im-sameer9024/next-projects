"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-999">
      
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />

        {/* Text */}
        <p className="text-sm text-gray-500 animate-pulse">
          Loading...
        </p>
      </div>
      
    </div>
  );
};

export default Loading;