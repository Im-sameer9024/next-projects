import { Skeleton } from "../ui/skeleton";

const AuthLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
        <div className="space-y-2">
          <Skeleton className="mx-auto h-8 w-48" />

          <Skeleton className="mx-auto h-4 w-64" />
        </div>

        <Skeleton className="h-12 w-full rounded-xl" />

        <Skeleton className="h-12 w-full rounded-xl" />

        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default AuthLoader;
