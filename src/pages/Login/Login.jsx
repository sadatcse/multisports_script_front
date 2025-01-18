import React, { useState } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import backgroundImage from './../../assets/Background/Login.jpg';
import Logo from './../../assets/Logo/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Handle Login Submission
  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember Me:', rememberMe);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Use imported background image
    >
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-md w-full border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={Logo} // Use imported logo
            alt="Logo"
            className="w-20 h-20 md:w-28 md:h-28"
          />
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="px-3 text-gray-500 bg-gray-100">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 focus:outline-none text-sm md:text-base"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="px-3 text-gray-500 bg-gray-100">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 focus:outline-none text-sm md:text-base"
                required
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
            <label htmlFor="rememberMe" className="ml-2 text-gray-600 text-sm md:text-base">
              Remember Me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm md:text-base"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
