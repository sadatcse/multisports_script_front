import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import logo from '../../../assets/Logo/login.png'; // Replace with your logo path
import { AuthContext } from '../../../providers/AuthProvider';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, logoutUser,branch  } = useContext(AuthContext);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleSignOut = async () => {
    try {
      await logoutUser(); 
      navigate("/"); 
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="Company Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold">LEAVE RESTAURANT MANAGEMENT SYSTEM</h1>
        </div>

        {/* Hamburger Icon for Mobile */}
        <button
          onClick={toggleNav}
          className="md:hidden text-2xl focus:outline-none"
        >
          <FaBars />
        </button>



        {/* User Profile */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 focus:outline-none"
          >
            <FaUserCircle className="text-2xl" />
            <span className="hidden md:block">{user.name}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg z-50">
              {/* Dropdown Links */}
              <div className="flex flex-col text-sm">
                <Link
                  to="/profile"
                  className="py-2 px-4 hover:bg-blue-100 text-left"
                >
                  Profile
                </Link>
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
