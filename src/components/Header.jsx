import React, { useContext, useState } from "react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaClipboardList,
  FaUserCircle,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

import person from "../assets/Raw-Image/Person.jpg";
import UseAxiosSecure from "../Hook/UseAxioSecure";
import Preloader from "./Shortarea/Preloader";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [products, setProducts] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 
  const { user, logoutUser,branch  } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = () => {
    setIsLoading(true);
    setIsModalOpen(true);

    axiosSecure
      .get(`/invoice/${branch}/item`) // Updated API endpoint
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false); // Move inside the .then() block
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false); // Ensure it is also set in case of an error
      });
};

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logoutUser(); // Call the logout function
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg flex items-center justify-between">
      {/* Left Menu */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FaClipboardList />
          <span>COUNTER {user?.counter || "1"}</span>
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
              {/* <button className="py-2 px-4 hover:bg-blue-100 text-left">
                Profile
              </button> */}
               <button
                onClick={handleSignOut} // Call handleSignOut on click
                className="py-2 px-4 hover:bg-blue-100 text-left text-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Sell Product */}
      {isModalOpen && (

<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center animate-fadeIn">
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl relative p-8 border border-gray-200">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl focus:outline-none transition duration-200"
        aria-label="Close modal"
      >
        ✖
      </button>

      {/* Modal Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Today's Sell Product</h2>
        <p className="text-sm text-gray-500 mt-2">
          Review product sales and check quantities .
        </p>
      </div>

      {/* Product Table */}

      {isLoading ? (
    <Preloader />
  ) : (

      <div className="overflow-auto max-h-80">
        <table className="min-w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
              <th className="py-3 px-5 border-b border-gray-300">Product Name</th>
              <th className="py-3 px-5 border-b border-gray-300">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="py-3 px-5 border-b border-gray-300 text-gray-700">
                  {product.productName}
                </td>
                <td className="py-3 px-5 border-b border-gray-300 text-gray-700">
                  {product.qty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


 )}




      {/* Footer */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={closeModal}
          className="px-5 py-3 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Close Now
        </button>
      </div>
    </div>
  </div>



)}
    </header>
  );
};

export default Header;
