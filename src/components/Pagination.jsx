import React from 'react';
// Import the desired icons from the react-icons library
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
    // Don't render pagination if there's only one page or no items
    if (totalPages <= 1 || totalItems === 0) {
        return null;
    }

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-4 md:space-y-0">
            {/* Pagination Info */}
            <div className="text-sm text-gray-700">
                Showing {startItem} to {endItem} of {totalItems} entries
            </div>

            {/* Pagination Controls */}
            <nav>
                <ul className="flex items-center -space-x-px h-8 text-sm">
                    {/* Previous Button */}
                    <li>
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            {/* Replaced SVG with react-icon component */}
                            <HiChevronLeft className="w-5 h-5" />
                        </button>
                    </li>

                    {/* Page Number Buttons */}
                    {pageNumbers.map(number => (
                        <li key={number}>
                            <button
                                onClick={() => onPageChange(number)}
                                className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${currentPage === number ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'}`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}

                    {/* Next Button */}
                    <li>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            {/* Replaced SVG with react-icon component */}
                            <HiChevronRight className="w-5 h-5" />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;