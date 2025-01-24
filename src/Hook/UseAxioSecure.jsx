import axios from "axios";

const axiosSecure = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});

const UseAxiosSecure = () => {
  // Add a request interceptor to attach the token
  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken"); // Replace with your token storage logic
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor to handle errors or token expiration
  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle token expiration or unauthorized access
        console.error("Unauthorized or Token expired");
        // Optionally, redirect to login or refresh token logic
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default UseAxiosSecure;
