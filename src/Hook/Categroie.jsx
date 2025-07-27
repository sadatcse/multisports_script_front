import { useState, useCallback } from 'react';
import axios from 'axios';
import UseAxiosSecure from './UseAxioSecure';

// Assume axios is configured with a base URL.
// If not, you'll need to prepend this to your requests.
const API_URL = '/categories'; // Adjust this to your actual API base URL for categories

/**
 * Custom hook for managing category data.
 * @returns {object} An object containing category state and functions.
 */
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const axiosSecure = UseAxiosSecure();
  /**
   * Fetches categories from the API with pagination and search.
   * useCallback is used to memoize the function, preventing unnecessary re-creations.
   */
  const fetchCategories = useCallback(async ({ page = 1, limit = 10, search = '' }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit, search });
      const response = await axiosSecure.get(`${API_URL}?${params.toString()}`);
      setCategories(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Creates a new category.
   * @param {object} categoryData - The data for the new category, e.g., { name: 'Electronics' }.
   * @param {string} token - The authentication token.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const addCategory = async (categoryData, token) => {
    setLoading(true);
    setError(null);
    try {
      await axiosSecure.post(`${API_URL}/post`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Re-fetch the first page to show the new category
      await fetchCategories({ page: 1, limit: 10, search: '' });
      return true;
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
      console.error("Failed to add category:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates an existing category by its ID.
   * @param {string} id - The ID of the category to update.
   * @param {object} categoryData - The updated data, e.g., { name: 'New Name' }.
   * @param {string} token - The authentication token.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const updateCategoryById = async (id, categoryData, token) => {
    setLoading(true);
    setError(null);
    try {
      await axiosSecure.put(`${API_URL}/update/${id}`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // You might want to re-fetch the current page instead of the first one.
      // This would require storing the current page/search params in state.
      await fetchCategories({ page: pagination.currentPage || 1, limit: 10, search: '' });
      return true;
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
      console.error("Failed to update category:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes a category by its ID.
   * @param {string} id - The ID of the category to delete.
   * @param {string} token - The authentication token.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const deleteCategoryById = async (id, token) => {
    setLoading(true);
    setError(null);
    try {
      await axiosSecure.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
       // Re-fetch the current page after deletion.
      await fetchCategories({ page: pagination.currentPage || 1, limit: 10, search: '' });
      return true;
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
      console.error("Failed to delete category:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    pagination,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategoryById,
    deleteCategoryById,
  };
};

export default useCategories;
