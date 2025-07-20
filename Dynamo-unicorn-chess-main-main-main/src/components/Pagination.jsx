import React from 'react';
import { MdNavigateNext, MdKeyboardArrowLeft } from "react-icons/md";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxVisiblePages = 5; // Max pages to show in the pagination

  // Logic to create page numbers based on the total pages
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Calculate the range of page numbers to display
  const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const end = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));

  const displayedPageNumbers = pageNumbers.slice(start - 1, end);

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 rounded bg-gray-700 text-white disabled:opacity-50"
      >
        Prev
      </button>

      {displayedPageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 mx-1 rounded ${
            number === currentPage
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 text-white"
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 rounded bg-gray-700 text-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;



