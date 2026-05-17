import { Skeleton } from "@/shared/components/ui/skeleton";

const SignupSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl p-8 md:p-10 space-y-8">
        {/* Heading */}
        <div className="space-y-3 text-center">
          <Skeleton className="h-10 w-72 mx-auto rounded-md" />

          <Skeleton className="h-5 w-64 mx-auto rounded-md" />
        </div>

        {/* Google Button */}
        <Skeleton className="h-14 w-full rounded-xl" />

        {/* Divider */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-px flex-1" />

          <Skeleton className="h-5 w-10 rounded-md" />

          <Skeleton className="h-px flex-1" />
        </div>

        {/* Full Name */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-24 rounded-md" />

          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Email */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-16 rounded-md" />

          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Password */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-24 rounded-md" />

          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Confirm Password */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-36 rounded-md" />

          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-20 rounded-md" />

          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 rounded-xl" />

            <Skeleton className="h-12 rounded-xl" />
          </div>
        </div>

        {/* Signup Button */}
        <Skeleton className="h-12 w-full rounded-xl" />

        {/* Footer */}
        <div className="flex justify-center">
          <Skeleton className="h-5 w-64 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SignupSkeleton;
