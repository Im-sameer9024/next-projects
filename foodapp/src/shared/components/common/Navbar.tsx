"use client";

import { NavbarLinks } from "@/shared/data/data";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomButton from "../custom/CustomButton";
import { Menu, Phone, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import MobileSidebar from "./MobileSidebar";

const Navbar = () => {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [addShadow, setAddShadow] = useState(false);

  useEffect(() => {
    const handleChangeWidth = () => {
      if (window.innerWidth >= 640) {
        setOpen(false);
      }
    };

    const handleNavbarShadow = () => {
      if (window.scrollY > 30) {
        setAddShadow(true)
      }else{
        setAddShadow(false)
      }
    };

    window.addEventListener("resize", handleChangeWidth);
    window.addEventListener("scroll",handleNavbarShadow)

    return () => {
      window.removeEventListener("resize", handleChangeWidth);
      window.removeEventListener("scroll", handleNavbarShadow);
    };
  }, []);

  return (
    <>
      <nav
        className={`flex transition-all duration-200 justify-between items-center py-4 px-6 sm:px-10 md:px-14 fixed top-0 w-full z-30 bg-white ease-in-out ${addShadow ? "shadow-md backdrop-blur bg-white/90" : "bg-white"}`}
      >
        {/* LEFT */}
        <section className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden"
            onClick={() => {
              if (!open) setOpen(true); // ✅ prevent spam click
            }}
          >
            <Menu />
          </Button>

          <h2 className="font-heading text-2xl">MASSIMO</h2>
        </section>

        {/* CENTER (Desktop Links) */}
        <section className="space-x-6 hidden sm:flex">
          {NavbarLinks.map((link) => (
            <Link
              key={link.id}
              href={link.link}
              className={`hover:underline underline-offset-4 ${
                link.link === path ? "underline text-red-400" : ""
              } transition-all duration-200`}
            >
              {link.name}
            </Link>
          ))}
        </section>

        {/* RIGHT */}
        <section className="flex items-center gap-3">
          <CustomButton leftIcon={<ShoppingBag size={18} />}>Cart</CustomButton>
          <CustomButton leftIcon={<User size={18} />}>Sign In</CustomButton>
        </section>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;
