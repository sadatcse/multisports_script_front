import React, { useState, useEffect, useContext, useCallback } from 'react';
import Swal from 'sweetalert2';
import { HiOutlineHome, HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

// Import reusable components and hooks
import UseAxiosSecure from '../../Hook/UseAxioSecure';
import { AuthContext } from '../../providers/AuthProvider';
import SkeletonLoader from '../../components library/SkeletonLoader';
import TableControls from '../../components/TableControls';
import Pagination from './../../components/Pagination';
import ImageUpload from '../../config/ImageUploadcpanel'; // Assuming this is your image upload component

// --- Modal Component ---
// For better organization, the modal is defined as a separate component here.
const UserModal = ({ isOpen, onClose, onSave, user, setUser, isLoading }) => {
    if (!isOpen) return null;

    const handleImageUpload = (url) => {
        if (url) {
            setUser(prev => ({ ...prev, photo: url }));
        } else {
            console.error("Image URL is undefined!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md transform transition-all">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{user._id ? 'Edit User' : 'Add New User'}</h2>
                
                <div className="space-y-4">
                    <input
                        type="text"
                        value={user.name || ''}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full Name"
                    />
                    <input
                        type="email"
                        value={user.email || ''}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email Address"
                    />
                    {!user._id && (
                        <input
                            type="password"
                            value={user.password || ''}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Password"
                        />
                    )}
                    
                    {/* A cleaner way to handle image upload and preview */}
                    <div className="flex items-center space-x-4">
                        {user.photo && <img src={user.photo} alt="User" className="w-16 h-16 rounded-full object-cover"/>}
                        <ImageUpload setImageUrl={handleImageUpload} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <select
                            value={user.role || 'user'}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                        </select>
                        <select
                            value={user.status || 'active'}
                            onChange={(e) => setUser({ ...user, status: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                     <select
                        value={user.counter || '1'}
                        onChange={(e) => setUser({ ...user, counter: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="1">Counter 1</option>
                        <option value="2">Counter 2</option>
                        <option value="3">Counter 3</option>
                        <option value="4">Counter 4</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className={`px-6 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save User'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Users Component ---
const Users = () => {
    const axiosSecure = UseAxiosSecure();
    const { branch } = useContext(AuthContext);

    // State for data, pagination, loading, search, and modal
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const initialFormState = {
        email: "",
        name: "",
        role: "user",
        branch: branch || "",
        status: "active",
        photo: "",
        password: "",
        counter: "1"
    };

    // Memoized function to fetch users from the API
    const fetchUsers = useCallback(async (page, limit, search) => {
        setLoading(true);
        setError(null);
        try {
            // Assuming the backend is updated to handle these params
            const response = await axiosSecure.get('/users', {
                params: { branch, page, limit, search }
            });
            setUsers(response.data.data);
            setPagination(response.data.pagination);
        } catch (err) {
            setError('Failed to fetch users. Please ensure the backend server is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [axiosSecure, branch]);

    // useEffect to fetch users with debouncing for search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchUsers(currentPage, itemsPerPage, searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, currentPage, itemsPerPage, fetchUsers]);

    // --- Modal and CRUD Handlers ---

    const handleOpenModal = (user = null) => {
        setCurrentUser(user ? { ...user } : { ...initialFormState });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };
    
    const handleSaveUser = async () => {
        if (!currentUser?.name || !currentUser?.email) {
            Swal.fire('Validation Error', 'Name and Email are required.', 'error');
            return;
        }

        setIsSaving(true);
        try {
            if (currentUser._id) {
                // Update existing user
                await axiosSecure.put(`/user/update/${currentUser._id}`, currentUser);
            } else {
                // Add new user
                await axiosSecure.post('/user/post', currentUser);
            }
            Swal.fire('Success!', `User has been ${currentUser._id ? 'updated' : 'added'}.`, 'success');
            handleCloseModal();
            fetchUsers(currentPage, itemsPerPage, searchTerm); // Refetch data
        } catch (error) {
            console.error('Error saving user:', error);
            Swal.fire('Error!', 'Failed to save user. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/user/delete/${userId}`);
                    Swal.fire('Deleted!', 'The user has been deleted.', 'success');
                    fetchUsers(currentPage, itemsPerPage, searchTerm); // Refetch data
                } catch (error) {
                    console.error('Error deleting user:', error);
                    Swal.fire('Error!', 'Failed to delete user.', 'error');
                }
            }
        });
    };

    // --- Pagination and Search Handlers ---
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

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="py-6">
                <div className="flex items-center text-sm text-gray-500">
                    <HiOutlineHome className="h-5 w-5 mr-2" />
                    <span>Home / User Management</span>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <div className="w-full md:w-auto">
                        <TableControls
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                    >
                        <HiPlus className="w-5 h-5" />
                        <span>Add New User</span>
                    </button>
                </div>

                {error && <div className="text-red-500 text-center p-4 bg-red-100 rounded-md">{error}</div>}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">Role</th>
                                <th scope="col" className="px-6 py-3 hidden sm:table-cell">Status</th>
                                <th scope="col" className="px-6 py-3 hidden sm:table-cell">Counter</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonLoader columns={5} />
                            ) : (
                                users.map(user => (
                                    <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                            <img className="w-10 h-10 rounded-full object-cover" src={user.photo || 'https://placehold.co/40x40/E2E8F0/4A5568?text=U'} alt={`${user.name}'s avatar`} />
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">{user.name}</div>
                                                <div className="font-normal text-gray-500">{user.email}</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4 hidden md:table-cell">{user.role}</td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">{user.counter}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => handleOpenModal(user)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200">
                                                    <HiPencil className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(user._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200">
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

                {!loading && users.length === 0 && !error && (
                    <div className="text-center py-8 text-gray-500">No users found.</div>
                )}

                {!loading && pagination && pagination.totalPages > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveUser}
                user={currentUser}
                setUser={setCurrentUser}
                isLoading={isSaving}
            />
        </div>
    );
};

export default Users;

