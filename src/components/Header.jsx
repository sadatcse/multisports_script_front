import React, { useContext, useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaClipboardList,
  FaUserCircle,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import { Link } from "react-router-dom";
import axios from "axios";
import person from "../assets/Raw-Image/Person.jpg";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);

    // Fetch product data from the backend
    axios
      .get("http://localhost:8000/api/products") // Replace with your API endpoint
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg flex items-center justify-between">
      {/* Left Menu */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FaClipboardList />
          <span>COUNTER {user?.counter || "N/A"}</span>
        </h1>
      </div>

      {/* Center Navigation */}
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <Link
          to="/dashboard/collect-order"
          className="hover:underline flex items-center gap-1"
        >
          <FaShoppingCart />
          <span>Collect Order</span>
        </Link>
        <button
          onClick={openModal}
          className="hover:underline flex items-center gap-1"
        >
          <FaCheckCircle />
          <span>Sell Product</span>
        </button>
        <Link
          to="/dashboard/pending-orders"
          className="hover:underline flex items-center gap-1"
        >
          <FaClipboardList />
          <span>Pending Order</span>
        </Link>
      </nav>

      {/* User Profile */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 focus:outline-none"
        >
          <FaUserCircle className="text-2xl" />
          <span className="hidden md:block">{user?.name || "Guest"}</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg z-50">
            {/* User Info */}
            <div className="p-4 text-center border-b">
              <img
                src={user?.photo || person}
                alt="Profile"
                className="w-12 h-12 mx-auto rounded-full"
              />
              <h2 className="mt-2 text-sm font-medium">{user?.role || "User"}</h2>
              <p className="text-xs text-gray-500">{user?.email || "No Email"}</p>
            </div>
            {/* Dropdown Links */}
            <div className="flex flex-col text-sm">
              <button className="py-2 px-4 hover:bg-blue-100 text-left">
                Profile
              </button>
              <button className="py-2 px-4 hover:bg-blue-100 text-left text-red-600">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Sell Product */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative p-6">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl"
      >
        ✖
      </button>

      {/* Modal Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sell Product</h2>
        <p className="text-sm text-gray-500">
          Manage product sales by reviewing available stock and quantities.
        </p>
      </div>

      {/* Product Table */}
      <div className="overflow-auto max-h-80">
        <table className="min-w-full text-left border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Product Name</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.quantity}</td>
                <td className="py-2 px-4 border-b">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Confirm Sale
        </button>
      </div>
    </div>
  </div>
)}
    </header>
  );
};

export default Header;
