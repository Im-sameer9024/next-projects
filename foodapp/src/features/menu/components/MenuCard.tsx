import Image from "next/image";
import type { Category } from "../../../../generated/prisma/client";
import Link from "next/link";

const MenuCard = ({ item }: { item: Category }) => {
  return (
    <article className="relative h-64 rounded-xl overflow-hidden flex items-center">
      {/* Background */}
      <div
        className={`absolute inset-0 ${
          item.title.includes("Pizza")
            ? "bg-red-500"
            : item.title.includes("Pasta")
              ? "bg-green-600"
              : "bg-gray-100"
        }`}
      />

      {/* Content */}
      <div className="relative z-10 space-y-2 p-6 max-w-[60%]">
        <h2
          className={`text-2xl font-bold ${
            item.color === "white" ? "text-white" : "text-black"
          }`}
        >
          {item.title.toUpperCase()}
        </h2>

        <p
          className={` text-sm ${
            item.color === "white" ? "text-white/90" : "text-gray-700"
          }`}
        >
          {item.description}
        </p>

        <Link
          href={`/menu/${item.slug}`}
          className=" px-4 py-2 bg-white text-black text-sm rounded-md"
        >
          Explore
        </Link>
      </div>

      {/* Image */}
      <div className="absolute right-0 bottom-0 w-40 h-40 md:w-52 md:h-52">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </article>
  );
};

export default MenuCard;
