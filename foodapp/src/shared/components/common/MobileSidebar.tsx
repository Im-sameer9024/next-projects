"use client";

import { NavbarLinks } from "@/shared/data/data";
import Link from "next/link";
import { X, ShoppingBag, Phone, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "../custom/CustomButton";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

const MobileSidebar = ({ open, setOpen }: Props) => {
  const path = usePathname();

  // ✅ Safe scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />

          {/* Sidebar */}
          <motion.aside
            key="sidebar"
            className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl p-6 flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }} // ✅ FIXED
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-4">
              {NavbarLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.link}
                  onClick={() => setOpen(false)}
                  className={`text-lg ${
                    link.link === path
                      ? "text-red-400 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Bottom Buttons */}
            <div className="mt-auto flex flex-col gap-3 pt-6">
              <CustomButton leftIcon={<ShoppingBag />}>
                Cart
              </CustomButton>
              <CustomButton leftIcon={<User />}>
                Sign In
              </CustomButton>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;