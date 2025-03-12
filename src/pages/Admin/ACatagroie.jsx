import React, { useState, useEffect, useContext, useCallback } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { TfiSearch } from "react-icons/tfi";
import { GoPlus } from "react-icons/go";
import Mpagination from "../../components library/Mpagination";
import MtableLoading from "../../components library/MtableLoading";
import Mtitle from "../../components library/Mtitle";
import UseAxiosSecure from '../../Hook/UseAxioSecure';
import { AuthContext } from "../../providers/AuthProvider";
import Preloader from './../../components/Shortarea/Preloader';
import useTotalBranch from "../../Hook/UseTotalBrach";

const ACategory = () => {
  const axiosSecure = UseAxiosSecure();
  const { branches, loading: branchLoading } = useTotalBranch();
  const { branch } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    serial: "",
    branch: branch || "",
    isActive: true,
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const LOCAL_STORAGE_KEY = `categories_${branch}`;

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get(`/category/`);
      const filteredData = response.data.filter(
        (category) => category.branch === branch && category.isActive === true
      );
      setCategories(response.data);
      setFilteredCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  }, [axiosSecure, branch]);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddOrEditCategory = async () => {
    setIsLoading(true);
    try {
      if (editId) {
        // Update category
        await axiosSecure.put(`/category/update/${editId}`, formData);
      } else {
        // Add new category
        await axiosSecure.post('/category/post', formData);
      }
      
      fetchCategories();
      setIsModalOpen(false);

      setFormData({
        categoryName: "",
        serial: "",
        branch: branch || "",
        isActive: true,
      });
      setEditId(null);
    } catch (error) {
      console.error('Error saving category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save category. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const category = categories.find(c => c._id === id);
    setEditId(id);
    setFormData(category);
    setIsModalOpen(true);
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/category/delete/${id}`)
          .then(() => {
         
            fetchCategories();
            Swal.fire('Deleted!', 'The category has been deleted.', 'success');
          })
          .catch(error => {
            console.error('Error deleting category:', error);
            Swal.fire('Error!', 'Failed to delete category.', 'error');
          });
      }
    });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = categories.filter(category =>
      category.categoryName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: filteredCategories });

  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="Category Management" rightcontent={
        <div className='flex md:mt-0 mt-3 justify-between'>
          <div className="flex justify-end gap-4 items-center mb-4">
            {/* Search bar */}
            <div className='md:w-64 border shadow-sm py-2 px-3 bg-white rounded-xl'>
              <div className='flex items-center gap-2'>
                <TfiSearch className='text-2xl font-bold text-gray-500' />
                <input
                  type="text"
                  className='outline-none w-full'
                  placeholder='Search here'
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            {/* Add new button */}
            <div className="flex gap-2 cursor-pointer items-center bg-blue-600 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-600 transition duration-300">
              <button
                onClick={() => setIsModalOpen(true)}
                className="font-semibold"
              >
                New
              </button>
              <GoPlus className="text-xl text-white" />
            </div>
          </div>
        </div>
      } ></Mtitle>

      <div className="text-sm md:text-base">
        {rowsPerPageAndTotal}
      </div>

      {Loading ? (
    <Preloader />
  ) : (

      <section className="overflow-x-auto border shadow-sm rounded-xl p-4 pb- mt-5">
        <table className="table w-full">
          <thead className='bg-blue-600'>
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3 rounded-l-xl">Category Name</td>
              <td className="p-3">Serial</td>
              <td className="p-3">Branch</td>
              <td className="p-3">Status</td>
              <td className="p-3 rounded-r-xl text-right px-8">Action</td>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No categories found</td>
              </tr>
            ) : (
              paginatedData.map((category, index) => (
                <tr key={index} className="hover:bg-slate-100 hover:rounded-xl">
                  <td className="px-4 py-5">{category.categoryName}</td>
                  <td className="px-4 py-5">{category.serial}</td>
                  <td className="px-4 py-5">{category.branch}</td>
                  <td className="px-4 py-5">{category.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="py-5 px-6 text-lg flex justify-end space-x-4">
                    <button
                      onClick={() => handleEdit(category._id)}
                      className="text-blue-500 hover:text-yellow-700 transition duration-150"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleRemove(category._id)}
                      className="text-red-500 hover:text-red-700 transition duration-150"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <MtableLoading data={categories}></MtableLoading>
        {paginationControls}
      </section>
 )}

{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4">{editId !== null ? 'Edit Category' : 'Add New Category'}</h2>
      <input
        type="text"
        value={formData.categoryName}
        onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
        className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
        placeholder="Category Name"
      />
      <input
        type="number"
        value={formData.serial}
        onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
        className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
        placeholder="Serial Number"
      />
               <select
        value={formData.branch}
        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
        className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
      >
        <option value="">Select Branch</option>
        {branchLoading ? (
          <option disabled>Loading branches...</option>
        ) : (
          branches.map((branchItem) => (
            <option key={branchItem._id} value={branchItem.name}>
              {branchItem.name}
            </option>
          ))
        )}
      </select>
      <select
        value={formData.isActive}
        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
        className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
      >
        <option value={true}>Active</option>
        <option value={false}>Inactive</option>
      </select>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => {
            setIsModalOpen(false);
            setFormData({
              categoryName: "",
              serial: "",
              branch: branch || "",
              isActive: true,
            });
            setEditId(null);
          }}
          className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleAddOrEditCategory}
          className={`bg-blue-500 text-white py-2 px-4 font-semibold hover:bg-blue-700 rounded-xl transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : editId !== null ? 'Save' : 'Add'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ACategory;
