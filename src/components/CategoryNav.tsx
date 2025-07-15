// components/CategoryNav.jsx
import React from "react";

export default function CategoryNav({
  categories = [],
  activeCategory,
  onCategoryChange = (id) => {},
}) {
  return (
    <nav className="px-4 py-2 top-0 z-20 bg-[#111217]">
      <div className="container flex space-x-2 overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`
              text-sm font-medium px-4 py-2 rounded-full transition
              mx-2
              ${
                isActive
                  ? "bg-pink-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
