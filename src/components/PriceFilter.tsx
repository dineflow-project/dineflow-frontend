import React, { useState } from "react";

interface FilterProps {
  onFilter: (min: number, max: number) => void;
}

export default function Filter({ onFilter }: FilterProps) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilter = () => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    onFilter(min, max);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Filter by Price</h2>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label htmlFor="minPrice" className="block font-medium text-gray-700">
            Minimum Price:
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="maxPrice" className="block font-medium text-gray-700">
            Maximum Price:
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex-none">
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
