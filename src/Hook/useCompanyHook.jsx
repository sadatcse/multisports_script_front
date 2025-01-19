import { useState, useEffect, useContext } from "react";
import UseAxiosSecure from "./UseAxioSecure";
import { AuthContext } from "../providers/AuthProvider"; // Assuming branch is provided in AuthContext

const useCompanyHook = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext); // Assuming AuthContext provides the branch

  useEffect(() => {
    const fetchCompaniesByBranch = async () => {
      try {
        const response = await axiosSecure.get(`/company/branch/${branch}`);
        setCompanies(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (branch) {
      fetchCompaniesByBranch();
    }
  }, [branch, axiosSecure]);

  return { companies, loading, error };
};

export default useCompanyHook;
