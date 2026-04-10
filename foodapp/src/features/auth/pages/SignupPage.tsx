import React from "react";
import SignupForm from "../components/SignupForm";
import Link from "next/link";

const SignupPage = () => {
  return (
    <div className=" flex flex-col items-center justify-center">
      <h3 className=" text-2xl text-slate-500 mb-4 font-semibold">Welcome Back</h3>
      <SignupForm />
      <p>
        Already have an account?{" "}
        <Link href={"/login"} className=" text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
