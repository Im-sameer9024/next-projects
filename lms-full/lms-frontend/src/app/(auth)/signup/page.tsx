import SignupForm from "@/features/auth/components/SignupForm";
import CustomButton from "@/shared/components/custom/CustomButton";
import { Separator } from "@/shared/components/ui/separator";
import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const SignUpPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg">
        {/*--------------- Heading section ----------- */}
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold">Create Your Account ✨</h2>
          <p className="text-muted-foreground text-xs">Signup to continue with LMS Platform</p>
        </div>

        <CustomButton
          leftIcon={<FcGoogle size={20} />}
          fullWidth
          className="border border-gray-200 bg-gray-100 text-black hover:cursor-pointer hover:bg-gray-200"
        >
          Continue with Google
        </CustomButton>

        {/* ----------------- Divider---------------------- */}
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">OR</span>
          <Separator className="flex-1" />
        </div>

        {/*----------------- Login form --------------- */}

        <SignupForm />

        {/* 🔹 Footer */}
        <p className="text-muted-foreground text-center text-xs">
          Already have an account?{" "}
          <Link href={"/login"} className="font-medium text-black hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default SignUpPage;
