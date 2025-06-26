/**
 * Year Filter Dropdown Component
 * A reusable dropdown for filtering content by year
 */

"use client";

import { useState, useRef, useEffect } from 'react';

export default function YearFilter({ 
  selectedYear, 
  onYearChange, 
  className = '',
  placeholder = 'All Years'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Generate year options (current year back to 1900)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleYearSelect = (year) => {
    onYearChange(year);
    setIsOpen(false);
  };

  const displayValue = selectedYear ? selectedYear.toString() : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-left text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      >
        <span className="block truncate">{displayValue}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* All Years Option */}
          <button
            type="button"
            onClick={() => handleYearSelect(null)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors duration-200 ${
              !selectedYear 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-200'
            }`}
          >
            {placeholder}
          </button>

          {/* Year Options */}
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => handleYearSelect(year)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors duration-200 ${
                selectedYear === year 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
