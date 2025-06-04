import React, { useState, useEffect } from "react";

const categories = [
  "All",
  "Residential",
  "Commercial",
  "Houses",
  "Architecture",
  "Interior",
  "Landscape",
];

const Landscape = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black mt-24 p-4 md:p-6 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-1/4 flex-col space-y-2 pr-4 border-r border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-left p-2 text-sm rounded-lg transition-colors ${
              selectedCategory === category
                ? "text-black font-semibold bg-gray-100"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {category}
          </button>
        ))}
      </aside>

      {/* Mobile category scroll */}
      <div className="md:hidden mb-4">
        <h2 className="text-2xl font-bold mb-2">Landscape</h2>
        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === category
                  ? "text-black font-bold bg-gray-100"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main
        className={`w-full md:w-3/4 flex items-center justify-center transition-all duration-700 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider">
            Landscape Projects
          </h2>
          <p className="text-gray-500 text-lg">Coming up...</p>
        </div>
      </main>
    </div>
  );
};

export default Landscape;
