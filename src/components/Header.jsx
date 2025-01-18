import React, { useState } from "react";
import { FaShoppingCart, FaCheckCircle, FaClipboardList, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg flex items-center justify-between">
      {/* Left Menu */}
      <div className="flex items-center gap-4">
  
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FaClipboardList />
          <span>COUNTER 1</span>
        </h1>
      </div>

      {/* Center Navigation */}
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <button className="hover:underline flex items-center gap-1">
          <FaShoppingCart />
          <span>Collect Order</span>
        </button>
        <button className="hover:underline flex items-center gap-1">
          <FaCheckCircle />
          <span>Pending Product</span>
        </button>
        <button className="hover:underline flex items-center gap-1">
          <FaClipboardList />
          <span>Pending Order</span>
        </button>
      </nav>

      {/* User Profile */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 focus:outline-none"
        >
          <FaUserCircle className="text-2xl" />
          <span className="hidden md:block">Super Admin</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg">
            <div className="p-4 text-center border-b">
              <img
                src="https://via.placeholder.com/50"
                alt="Profile"
                className="w-12 h-12 mx-auto rounded-full"
              />
              <h2 className="mt-2 text-sm font-medium">Super Admin</h2>
              <p className="text-xs text-gray-500">superadmin@gmail.com</p>
            </div>
            <div className="flex flex-col text-sm">
              <button className="py-2 px-4 hover:bg-blue-100 text-left">Profile</button>
              <button className="py-2 px-4 hover:bg-blue-100 text-left text-red-600">
                SignOut
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
