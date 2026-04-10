import React from "react";
import LoginForm from "../components/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className=" flex flex-col items-center justify-center">
      <h3 className=" text-2xl text-slate-500 mb-4 font-semibold">
        Welcome Back
      </h3>
      <LoginForm />
      <p>
        Don&#39;t have an account?{" "}
        <Link href={"/signup"} className=" text-blue-500 hover:underline">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
