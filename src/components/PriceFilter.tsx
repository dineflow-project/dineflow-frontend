import React, { useState } from "react";

export default function PriceFilter({
  onFilter,
}: {
  onFilter: (min: number | null, max: number | null) => void;
}) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateAndConvertPrice = (price: string): number | null => {
    if (price.trim() === "") {
      // If the input is empty, treat it as no filter (null)
      return null;
    }
    const parsedPrice = parseFloat(price);
    // Check if the parsed price is a number and not negative or a fraction.
    if (
      !isNaN(parsedPrice) &&
      parsedPrice >= 0 &&
      parsedPrice === Math.floor(parsedPrice)
    ) {
      return parsedPrice;
    } else {
      // If the input is not a valid positive integer or zero, set an error message.
      setValidationError("Please enter a valid non-negative integer.");
      return null;
    }
  };

  const handleFilter = () => {
    // Reset validation error
    setValidationError("");

    const min = validateAndConvertPrice(minPrice);
    const max = validateAndConvertPrice(maxPrice);
    // Check if min is greater than max
    if (min !== null && max !== null && min > max) {
      setValidationError(
        "Maximum price must be greater than or equal to minimum price."
      );
      return;
    }
    // If min or max is not null, call the filter callback.
    if (min !== null || max !== null) {
      onFilter(min, max);
    }
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
      {validationError && (
        <div className="text-red-500 text-sm mt-2">{validationError}</div>
      )}
    </div>
  );
}
