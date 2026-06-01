"use client";

import { useRouter } from "next/navigation";

type ErrorProps = {
  message?: string;
};

const ErrorPage = ({ message = "Something went wrong" }: ErrorProps) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-2xl font-semibold text-red-500">Oops! Error</h2>

      <p className="mb-6 text-gray-600">{message}</p>

      <div className="flex gap-3">
        {/* 🔙 Go Back */}
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Go Back
        </button>

        {/* 🔄 Refresh */}
        <button
          onClick={() => router.refresh()}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
