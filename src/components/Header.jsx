// src/components/Header.js

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { RiMenuFold4Fill } from "react-icons/ri";
import {
  MdMenu,
  MdSearch,
} from "react-icons/md";
import { AuthContext } from "../providers/AuthProvider";
// Removed unused import: UseAxiosSecure

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md w-full p-2 flex items-center justify-between z-10">
      {/* Left side: Toggler, Search */}
      <div className="flex items-center gap-4">
        {/* ✨ UPDATED TOGGLE BUTTON ✨ */}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full focus:outline-none transition-colors duration-200"
        >
          {isSidebarOpen ? (
            <RiMenuFold4Fill className="text-2xl" />
          ) : (
            <MdMenu className="text-2xl" />
          )}
        </button>

        <div className="relative hidden md:block">
          <MdSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-gray-100 border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right side: Icons and User Profile */}
      <div className="flex items-center gap-4">
        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {user?.photo ? (
              <img
                src={user.photo}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-2xl text-gray-600" />
            )}
            <span className="hidden md:block font-medium text-sm text-gray-700">
              {user?.name || "Guest"}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg z-20">
              <div className="p-4 border-b">
                <h2 className="text-sm font-medium">
                  {user?.role || "User"}
                </h2>
                <p className="text-xs text-gray-500">
                  {user?.email || "No Email"}
                </p>
              </div>
              <div className="flex flex-col text-sm">
                <button
                  onClick={handleSignOut}
                  className="py-2 px-4 hover:bg-blue-100 text-left text-red-600"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
