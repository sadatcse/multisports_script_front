import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

import useAuth from "../../Hook/useAuth"; 

// Import your assets
import loginPanelImage from "../../assets/Background/Login.jpg"; // Example path
import Logo from "../../assets/Logo/login.png"; // Make sure this path is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // Load saved credentials from local storage
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      Swal.fire("Password Too Short!", "Password must be at least 6 characters long.", "warning");
      return;
    }
    
    setLoading(true);
    try {
      await loginUser(email, password);

      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
      setLoading(false);
      toast.success("Login Successful! Welcome back!");
      navigate("/dashboard/home");

    } catch (error) {
      setLoading(false);
      Swal.fire("Login Failed!", "Invalid email or password. Please try again.", "error");
    }
  };
  
  // Handle password reset submission
  const handlePasswordReset = (e) => {
    e.preventDefault();
    setShowForgotModal(false); // Close modal on submit
    // Implement your password reset API call here
    Swal.fire("Request Sent", "If an account exists, a reset link will be sent.", "success");
  };

  return (
    <>
      <Helmet>
        <title>Login | Restaurant Management System</title>
        <meta name="description" content="Login to your account." />
      </Helmet>
      
      {/* Main container */}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full bg-white">
          
          {/* Left Panel (Image) */}
          <div 
            className="hidden md:block md:w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${loginPanelImage})` }}
          />

          {/* Right Panel (Form) */}
          <div className="w-full md:w-1/2 p-8">
            
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={Logo} alt="Company Logo" className="w-48 h-auto" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 text-center">Login to Your Account</h2>
            <p className="text-center text-gray-600 mb-8">Please enter your details to continue</p>
            
            <form onSubmit={handleLogin} noValidate>
              
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginEmail">
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginPassword">
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input 
                    id="rememberMe" 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    Remember Me
                  </label>
                </div>
                
                <button type="button" onClick={() => setShowForgotModal(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Forgot Password?
                </button>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
              
              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Built with Tailwind CSS) */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-sm w-full relative">
            <button onClick={() => setShowForgotModal(false)} className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-gray-800">&times;</button>
            <h3 className="text-xl font-bold mb-2">Forgot Password?</h3>
            <p className="text-gray-600 mb-4">Enter your email to receive a reset link.</p>
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;