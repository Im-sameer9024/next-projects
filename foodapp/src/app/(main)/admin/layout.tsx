"use client";

import AdminSidebar from "@/features/admin/dashboard/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex overflow-hidden">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <section className="flex-1 overflow-y-auto p-4 ">
        {children}
      </section>

    </main>
  );
}