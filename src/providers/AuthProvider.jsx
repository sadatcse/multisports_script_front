import { createContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for type-checking
import useAxiosSecure from "../Hook/UseAxioSecure"; // Import your axios instance

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Set initial loading to false
  const axiosSecure = useAxiosSecure(); // Use the configured axios instance

  // Register a new user
  const registerUser = async (email, password, name, branch) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.post("/user/post", {
        email,
        password,
        name,
        branch,
      });
      return data;
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Log in a user
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.post("/user/login", {
        email,
        password,
      });
      setUser(data.user); // Set user state
      return data.user;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Log out the user
  const logoutUser = () => {
    setUser(null); // Reset user state
  };

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    logoutUser,
  };
  console.log('Auth Context in AuthProvider:', authInfo);
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Marked as required for clarity
};

export default AuthProvider;
