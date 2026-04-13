import Image from "next/image";
import React from "react";
import HeaderImg from "../../../../public/header.avif";
import CustomButton from "@/shared/components/custom/CustomButton";

const Header = () => {
  return (
    <header className="w-full min-h-screen flex items-center">
      <section className="grid grid-cols-1 md:grid-cols-2 w-full">

        {/* Left Content */}
        <article className="flex flex-col justify-center items-start bg-gray-100 px-8 md:px-16 py-12">
          <h1 className="text-4xl md:text-6xl font-bold text-red-500 leading-tight">
            ALWAYS FRESH <br />
            & ALWAYS CRISPY <br />
            & ALWAYS HOT
          </h1>

          <CustomButton className="mt-8 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition">
            Order Now
          </CustomButton>
        </article>

        {/* Right Image */}
        <figure className="relative w-full h-100 md:h-screen">
          <Image
            src={"https://i.postimg.cc/RFdXby5Q/header.avif"}
            alt="Pizza Header"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </figure>

      </section>
    </header>
  );
};

export default Header;