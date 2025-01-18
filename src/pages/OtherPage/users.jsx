import React, { useState, useEffect, useContext } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { TfiSearch } from "react-icons/tfi";
import { GoPlus } from "react-icons/go";
import Mpagination from "../../components library/Mpagination";
import MtableLoading from "../../components library/MtableLoading";
import Mtitle from "../../components library/Mtitle";
import ImageUpload from "../../config/ImageUploadcpanel";
import UseAxiosSecure from '../../Hook/UseAxioSecure';
import { AuthContext } from "../../providers/AuthProvider";

const Users = () => {
  const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "user",
    branch: branch || "",
    status: "active",
    photo: "",
    password: ""
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosSecure.get(`/user/`);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddOrEditUser = async () => {
    console.log("Form Data before save:", formData);
    setIsLoading(true);
    try {
      if (editId) {
        // Update user
        await axiosSecure.put(`/user/update/${editId}`, formData);
      } else {
        // Add new user
        await axiosSecure.post('/user/post', formData);
      }
      fetchUsers();
      setIsModalOpen(false);
      setFormData({
        email: "",
        name: "",
        role: "user",
        branch: branch || "",
        status: "active",
        photo: "",
        password: ""
      });
      setEditId(null);
    } catch (error) {
      console.error('Error saving user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save user. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const user = users.find(u => u._id === id);
    setEditId(id);
    setFormData(user);
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
        axiosSecure.delete(`/user/delete/${id}`)
          .then(() => {
            fetchUsers();
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            Swal.fire('Error!', 'Failed to delete user.', 'error');
          });
      }
    });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleImageUpload = (url) => {
    if (url) {
        console.log("Image URL successfully set:", url);
        setFormData((prev) => ({ ...prev, photo: url }));
    } else {
        console.error("Image URL is undefined!");
    }
  };

  const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: filteredUsers });

  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="User Management" rightcontent={
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

      <section className="overflow-x-auto border shadow-sm rounded-xl p-4 pb- mt-5">
        <table className="table w-full">
          <thead className='bg-blue-600'>
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3 rounded-l-xl">Name</td>
              <td className="p-3">Email</td>
              <td className="p-3">Role</td>
              <td className="p-3">Status</td>
              <td className="p-3 rounded-r-xl text-right px-8">Action</td>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No users found</td>
              </tr>
            ) : (
              paginatedData.map((user, index) => (
                <tr key={index} className="hover:bg-slate-100 hover:rounded-xl">
                  <td className="px-4 py-5">{user.name}</td>
                  <td className="px-4 py-5">{user.email}</td>
                  <td className="px-4 py-5">{user.role}</td>
                  <td className="px-4 py-5">{user.status}</td>
                  <td className="py-5 px-6 text-lg flex justify-end space-x-4">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="text-blue-500 hover:text-yellow-700 transition duration-150"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleRemove(user._id)}
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
        <MtableLoading data={users}></MtableLoading>
        {paginationControls}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">{editId !== null ? 'Edit User' : 'Add New User'}</h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
              placeholder="Name"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
              placeholder="Email"
            />
            {editId === null && (
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
                placeholder="Password"
              />
            )}
            <ImageUpload setImageUrl={(url) => handleImageUpload(url)} />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({
                    email: "",
                    name: "",
                    role: "user",
                    branch: branch || "",
                    status: "active",
                    photo: "",
                    password: ""
                  });
                  setEditId(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditUser}
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

export default Users;
