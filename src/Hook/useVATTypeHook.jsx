import { useState, useEffect, useContext } from "react";
import UseAxiosSecure from "./UseAxioSecure";
import { AuthContext } from "../providers/AuthProvider"; // Assuming branch is provided in AuthContext

const useVATTypeHook = () => {
  const [vatTypes, setVatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext); // Assuming AuthContext provides the branch

  useEffect(() => {
    const fetchVATTypesByBranch = async () => {
      try {
        const response = await axiosSecure.get(`/vat-type/${branch}/get-all`);
        setVatTypes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (branch) {
      fetchVATTypesByBranch();
    }
  }, [branch, axiosSecure]);

  return { vatTypes, loading, error };
};

export default useVATTypeHook;
