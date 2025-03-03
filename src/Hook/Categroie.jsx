import { useState, useEffect, useContext } from "react";
import UseAxiosSecure from "./UseAxioSecure";
import { AuthContext } from "../providers/AuthProvider";

const CategroieHook = () => {
  const [categories, setCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext);

  const EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  useEffect(() => {
    if (!branch) return;

    const LOCAL_STORAGE_KEY = `categories_${branch}`;

    const fetchActiveCategories = async () => {
      try {
        const response = await axiosSecure.get(`/category/${branch}/active`);
        const sortedCategories = response.data.sort((a, b) => a.serial - b.serial);
        const categoryData = sortedCategories.map((category) => category.categoryName);

        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ data: sortedCategories, timestamp: Date.now() })
        );

        setCategoryNames(sortedCategories);
        setCategories(categoryData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const checkLocalStorage = () => {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const { data, timestamp } = JSON.parse(storedData);
        if (Date.now() - timestamp < EXPIRATION_TIME) {
          const sortedCategories = data.sort((a, b) => a.serial - b.serial);
          const categoryData = sortedCategories.map((category) => category.categoryName);
          setCategoryNames(sortedCategories);
          setCategories(categoryData);
          setLoading(false);
          return;
        }
      }
      fetchActiveCategories();
    };

    checkLocalStorage();
  }, [branch, axiosSecure, EXPIRATION_TIME]); 

  return { categoryNames, categories, loading, error };
};

export default CategroieHook;
