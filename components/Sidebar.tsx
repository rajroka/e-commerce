import React from "react";
import Link from "next/link";

const Sidebar = () => {
  const linkStyle =
    "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-600 hover:text-white transition-colors";

  const categories = [
    { name: "Shop All", slug: "" },
    { name: "Computers", slug: "computers" },
    { name: "Tablets", slug: "tablets" },
    { name: "Drones & Cameras", slug: "drones-cameras" },
    { name: "Audio", slug: "audio" },
    { name: "T.V & Home Cinema", slug: "tv-home-cinema" },
    { name: "Mobile", slug: "mobile" },
    { name: "Wearable Tech", slug: "wearable-tech" },
    { name: "Sale", slug: "sale" },
  ];

  return (
    <div className="w-64 fixed left-0 top-0 h-screen hidden md:block pt-24 bg-gray-200 px-6 text-gray-800">
      <div className="w-full h-full flex flex-col items-start justify-start gap-4">
        <Link href="/" className={linkStyle}>🏠 Home</Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products/${cat.slug}`}
            className={linkStyle}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
