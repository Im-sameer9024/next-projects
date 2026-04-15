/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const ErrorMessage = (ApiError: any) => {
  return (
    <div className="flex items-center justify-center min-h-50">
      <p className="text-sm text-red-500">
        {ApiError instanceof Error
          ? ApiError.message
          : "Something went wrong while fetching categories"}
      </p>
    </div>
  );
};

export default ErrorMessage;
