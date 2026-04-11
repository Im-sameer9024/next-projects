"use client";

import Image from "next/image";
import Img from "../../../public/auth-layout.webp";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* 🔐 Left Side (Form) */}
      <div className="flex items-center justify-center px-6 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* 🖼 Right Side (Image) */}
      <div className="relative hidden lg:block">
        <Image
          src={Img}
          alt="Authentication"
          fill
          sizes="full"
          priority
          className="object-cover size-full"
        />

        {/* Fixed Center Text */}
        <h3 className="text-[4rem] text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Hey 👋
        </h3>
      </div>
    </section>
  );
}