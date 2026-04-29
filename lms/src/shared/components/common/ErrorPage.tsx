"use client";

import { useRouter } from "next/navigation";

type ErrorProps = {
  message?: string;
};

const ErrorPage = ({ message = "Something went wrong" }: ErrorProps) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-semibold text-red-500 mb-2">
        Oops! Error
      </h2>

      <p className="text-gray-600 mb-6">{message}</p>

      <div className="flex gap-3">
        {/* 🔙 Go Back */}
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Go Back
        </button>

        {/* 🔄 Refresh */}
        <button
          onClick={() => router.refresh()}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;