import Navbar from "@/shared/components/common/Navbar";
import Sidebar from "@/shared/components/common/Sidebar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Layout  */}

      <div className=" flex flex-1 overflow-hidden">
        <Sidebar/>
        <section className=" flex-1 overflow-y-auto bg-slate-50 w-full h-full ">

          {/*--------------- Navbar ------------------- */}
          <Navbar/>
          <main className="p-4">{children}</main>
        </section>
      </div>
    </div>
  );
};

export default MainLayout;
