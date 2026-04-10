"use client";

import Image from "next/image";
import Img from "../../../public/auth-layout.webp";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* 🔐 Left Side (Form) */}
      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* 🖼 Right Side (Image) */}
      <div className="relative hidden lg:block">
        <Image
          src={Img}
          alt="Authentication"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        <h3 className=" text-[4rem] text-slate-400 absolute top-1/2 -translate-1/2 left-1/2">
          Hey👋
        </h3>
      </div>
    </section>
  );
}
