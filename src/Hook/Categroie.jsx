import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";
import UseAxiosSecure from "./UseAxioSecure";

const CategroieHook = () => {
  const [categories, setCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { branch } = useContext(AuthContext); // Assuming AuthContext provides the branch
console.log(categories);
  useEffect(() => {
    const fetchActiveCategories = async () => {
      try {
        const response = await axiosSecure.get(`/category/${branch}/active`);
        const names = response.data.map((category) => category.categoryName);
        setCategoryNames(response.data);
        setCategories(names);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (branch) {
      fetchActiveCategories();
    }
  }, [branch]);

  return { categoryNames,categories, loading, error };
};

export default CategroieHook;
