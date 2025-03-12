import { useState, useEffect } from "react";
import axios from "axios";
import UseAxiosSecure from "./UseAxioSecure";

const useTotalBranch = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosSecure.get("/branch/");
        setBranches(response.data.branches); // Update state with branch data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []); // Runs only once when the component mounts

  return { branches, loading, error };
};

export default useTotalBranch;
