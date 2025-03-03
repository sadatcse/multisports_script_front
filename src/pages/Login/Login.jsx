import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";
import backgroundImage from "../../assets/Background/Login.jpg";
import Logo from "../../assets/Logo/login.png";
import useAuth from "../../Hook/useAuth"; 
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); 
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); 
  const navigate = useNavigate();
  const { loginUser } = useAuth(); 

  // Load saved credentials from local storage on mount
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
    if (password.length < 6) {
      Swal.fire({
        title: "Password Too Short!",
        text: "Password must be at least 6 characters long.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return; 
    }
    e.preventDefault();
    setLoading(true);
    try {
      // Call the loginUser function with email and password
      await loginUser(email, password);

      // Handle "Remember Me" logic
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
      setLoading(false);
      toast.success(`Login Successful! Welcome back!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate("/dashboard"); 
    } catch (error) {

      setLoading(false);
      Swal.fire({
        title: "Login Failed!",
        text: "Invalid email or password. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };


  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >

<Helmet>
        <title>Login | Leave Restaurant Management System</title> {/* Set title */}
        <meta name="description" content="Login to access your account in the Restaurant Management System" /> {/* Meta description */}
        <meta name="robots" content="noindex, nofollow" /> {/* Optionally prevent indexing */}
      </Helmet>
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-md w-full border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img src={Logo} alt="Logo" className="w-70 h-60 md:w-70 md:h-60" />
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
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-700">
              Remember Me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading} 
            className={`w-full py-2 rounded-lg text-sm md:text-base transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <footer className="absolute bottom-0 w-full py-8  text-white text-center">
  <div className="container mx-auto px-6 sm:px-12">
    <p className="text-lg md:text-xl font-semibold">
      Leave Restaurant Management System 
    </p>
  </div>
</footer>

    </div>
  );
};

export default Login;
