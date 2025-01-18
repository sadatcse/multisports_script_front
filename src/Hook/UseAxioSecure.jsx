import axios from "axios";


const axiosSecure = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`, 
});

const UseAxiosSecure = () => {
  return axiosSecure;
};

export default UseAxiosSecure;
