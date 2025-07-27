import React, { useState, useEffect, useCallback } from 'react';
import SkeletonLoader from "../../components library/SkeletonLoader"; // Assuming path is correct
import UseAxiosSecure from '../../Hook/UseAxioSecure';
import { HiOutlineHome, HiPencil, HiTrash } from 'react-icons/hi';

// Import the new reusable components
import TableControls from '../../components/TableControls';
import Pagination from './../../components/Pagination';     

const ViewProduct = () => {
    // State for products, pagination, loading, errors, search, and current page
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const axiosSecure = UseAxiosSecure();

    // Function to fetch products from the API (memoized with useCallback)
    const fetchProducts = useCallback(async (page, limit, search) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosSecure.get('/products', {
                params: { page, limit, search }
            });
            setProducts(response.data.data);
            setPagination(response.data.pagination);
        } catch (err) {
            setError('Failed to fetch products. Please ensure the backend server is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]); // Dependency added for UseAxiosSecure instance

    // useEffect to fetch products with debouncing for search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchProducts(currentPage, itemsPerPage, searchTerm);
        }, 500); // 500ms delay
        return () => clearTimeout(handler);
    }, [searchTerm, currentPage, itemsPerPage, fetchProducts]);

    // Handler for changing the current page
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= (pagination?.totalPages || 1)) {
            setCurrentPage(newPage);
        }
    };
    const handleEdit = (productId) => {
        // In a real application, this would navigate to an edit page or open a modal.
        window.alert(`Edit button clicked for product ID: ${productId}`);
    };

    // Handler for the delete button click
    const handleDelete = (productId) => {
        // In a real application, this would open a confirmation modal before deleting.
        if (window.confirm(`Are you sure you want to delete product ID: ${productId}?`)) {
            window.alert(`Confirmed deletion for product ID: ${productId}`);
            // Here you would typically call an API to delete the product and then refetch the list.
            // For example: axiosSecure.delete(`/products/${productId}`).then(() => fetchProducts(...));
        }
    };
    // Handler for search input changes
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    // Handler for changing items per page
    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to first page
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="py-6">
                <div className="flex items-center text-sm text-gray-500">
                    <HiOutlineHome className="h-5 w-5 mr-2" />
                    <span>Home / View Product</span>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
                {/* Use the reusable TableControls component */}
                <TableControls
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />

                {error && <div className="text-red-500 text-center p-4 bg-red-100 rounded-md">{error}</div>}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">Product ID</th>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonLoader />
                            ) : (
                                products.map(product => (
                                    <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hidden md:table-cell">
                                            {product.productCode}
                                        </td>
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={product.productPhoto}
                                                alt={product.productName}
                                            />
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">{product.productName}</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {product.productCategory || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.productPrice || 'N/A'}
                                        </td>
                                                <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => handleEdit(product._id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200">
                                                    <HiPencil className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200">
                                                    <HiTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && products.length === 0 && !error && (
                    <div className="text-center py-8 text-gray-500">No products found.</div>
                )}

                {/* Use the reusable Pagination component */}
                {!loading && pagination && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

// The main App component remains unchanged
const App = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <ViewProduct />
        </div>
    );
};

export default App;