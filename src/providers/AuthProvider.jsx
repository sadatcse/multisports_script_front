import { createContext, useState } from "react";
import PropTypes from "prop-types"; 
import useAxiosSecure from "../Hook/UseAxioSecure"; 

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false); 
  const axiosSecure = useAxiosSecure(); 
  const [branch, setBranch] = useState(() => {
    const storedBranch = localStorage.getItem("authBranch");
    return storedBranch || user?.branch || "teaxo";
  });


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


  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosSecure.post("/user/login", { email, password });
      const data = response.data;
  
      setUser(data.user);
      setBranch(data.user.branch);
  
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("authBranch", data.user.branch);
      localStorage.setItem("authToken", data.token);
  
      return data.user;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.put("/user/change-password", { oldPassword, newPassword });
      return data; 
    } catch (error) {
      console.error("Change password error:", error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logoutUser = async () => {
    setLoading(true);
    try {
      await axiosSecure.post("/user/logout", { email: user.email });
      setUser(null);
      setBranch(user.branch);
      localStorage.removeItem("authUser");
      localStorage.removeItem("authBranch");
      localStorage.removeItem("authToken"); 
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider) => {
    try {
      window.location.href = `${process.env.REACT_APP_BACKEND_URL}/user/${provider}`;
    } catch (error) {
      console.error("Social login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const authInfo = {
    user,
    loading,
    branch,
    registerUser,
    socialLogin,
    loginUser,
    logoutUser,
    changePassword,
  };



  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Marked as required for clarity
};

export default AuthProvider;
