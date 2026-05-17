import { Skeleton } from "../ui/skeleton";

const AuthLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />

          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        <Skeleton className="h-12 w-full rounded-xl" />

        <Skeleton className="h-12 w-full rounded-xl" />

        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default AuthLoader;
