// components/CategoryNav.tsx
import { useCategories } from "@/hooks/useCategories";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export default function CategoryNav({
  onCategoryChange,
  activeCategory
}: CategoryNavProps) {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const navigate = useNavigate();

  // Always include “All” at the front
  const categories = [
    { id: "all", name: "All" },
    ...(categoriesData|| []).map((cat) => ({
      id: cat.id,
      name: cat.name,
    })),
  ];

  const handleCategoryChange = (cat: { id: string; name: string; }) => {
    onCategoryChange(cat.id);
    navigate(`/videos?name=${cat.name}&category=${cat.id}`);
  };

  if (categoriesLoading) {
    // Render 6 shimmering pills as placeholders
    return (
      <nav className="px-4 py-3 sticky top-0 z-20 bg-[#111217]">
        <div className="container mx-auto flex space-x-2 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-full bg-gray-700 h-8 w-20 animate-pulse mx-2"
            />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="px-4 py-2 sticky top-0 z-20 bg-[#111217]">
      <div className="container mx-auto flex space-x-2 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat)}
              className={`
                flex-shrink-0
                text-sm font-medium px-4 py-2 rounded-full transition
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
