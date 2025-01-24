import React, { useState, useEffect, useContext } from "react";
import UseAxiosSecure from "./UseAxioSecure";
import { AuthContext } from "../providers/AuthProvider";

const CategroieHook = () => {
  const [categories, setCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext); 

  const LOCAL_STORAGE_KEY = `categories_${branch}`;
  const EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    const fetchActiveCategories = async () => {
      try {
        const response = await axiosSecure.get(`/category/${branch}/active`);
        const categoryData = response.data.map((category) => category.categoryName);


        const storageData = {
          data: response.data,
          timestamp: Date.now(),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storageData));

        setCategoryNames(response.data);
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
          const categoryData = data.map((category) => category.categoryName);
          setCategoryNames(data);
          setCategories(categoryData);
          setLoading(false);
          return;
        }
      }
 
      fetchActiveCategories();
    };

    if (branch) {
      checkLocalStorage();
    }
  }, [branch, axiosSecure]);

  return { categoryNames, categories, loading, error };
};

export default CategroieHook;
