"use client";

import Navbar from "@/shared/components/common/Navbar";
import Footer from "@/shared/components/common/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
