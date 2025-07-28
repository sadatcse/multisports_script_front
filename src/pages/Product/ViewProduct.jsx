// src/pages/ViewProduct.js

import React, { useState, useEffect, useCallback, useContext } from 'react';
import SkeletonLoader from "../../components library/SkeletonLoader";
import UseAxiosSecure from '../../Hook/UseAxioSecure';
import useCategories from '../../Hook/Categroie'; // Assuming this hook fetches all categories
import { HiOutlineHome, HiPencil, HiTrash } from 'react-icons/hi';
import Swal from 'sweetalert2';

// Import the new and existing components
import TableControls from '../../components/TableControls';
import Pagination from '../../components/Pagination';
import EditProductModal from '../../components/EditProductModal'; // Import the new modal
import { AuthContext } from '../../providers/AuthProvider';

const ViewProduct = () => {
    // --- State ---
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { user} = useContext(AuthContext);
    // --- State for Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // --- Hooks ---
    const axiosSecure = UseAxiosSecure();
    const { categories: availableCategories, fetchCategories } = useCategories();

    // --- Data Fetching ---
    // Fetch all categories once for the edit modal dropdown
    useEffect(() => {
        fetchCategories({ limit: 999 }); // Fetch all categories
    }, [fetchCategories]);

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
    }, [axiosSecure]);

    // Debounced search effect
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchProducts(currentPage, itemsPerPage, searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, currentPage, itemsPerPage, fetchProducts]);

    // --- Event Handlers ---
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= (pagination?.totalPages || 1)) {
            setCurrentPage(newPage);
        }
    };
    
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    // --- Modal and CRUD Handlers ---
    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleUpdateSuccess = () => {
        handleCloseModal();
        fetchProducts(currentPage, itemsPerPage, searchTerm); // Refetch data
        Swal.fire('Updated!', 'Product has been updated successfully.', 'success');
    };
    
    const handleDelete = (productId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/products/delete/${productId}`);
                    Swal.fire('Deleted!', 'The product has been deleted.', 'success');
                    // Refetch data to reflect the deletion
                    fetchProducts(currentPage, itemsPerPage, searchTerm);
                } catch (err) {
                    Swal.fire('Error!', 'Failed to delete the product.', 'error');
                }
            }
        });
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
                <TableControls
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />

                {error && <div className="text-red-500 text-center p-4 bg-red-100 rounded-md">{error}</div>}

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">Product Code</th>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonLoader columns={5} />
                            ) : (
                                products.map(product => (
                                    <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hidden md:table-cell">
                                            {product.productCode}
                                        </td>
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={product.productPhoto || 'https://placehold.co/40x40/E2E8F0/4A5568?text=P'}
                                                alt={product.productName}
                                            />
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">{product.productName}</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">{product.productCategory || 'N/A'}</td>
                                        <td className="px-6 py-4">{product.productPrice ? `৳${product.productPrice.toFixed(2)}` : 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200">
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

                {!loading && pagination && pagination.totalItems > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {/* Render the modal conditionally */}
            {isModalOpen && (
                 <EditProductModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    product={editingProduct}
                    onUpdateSuccess={handleUpdateSuccess}
                    availableCategories={availableCategories}
                />
            )}
        </div>
    );
};

export default ViewProduct;