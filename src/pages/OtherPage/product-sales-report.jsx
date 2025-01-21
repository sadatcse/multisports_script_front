import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import moment from "moment";

const ProductSalesReport = () => {
  const [categories, setCategories] = useState([]); // Categories list
  const [category, setCategory] = useState("All"); // Selected category
  const [products, setProducts] = useState([]); // Products list
  const [product, setProduct] = useState("All"); // Selected product
  const [startDate, setStartDate] = useState(new Date()); // Start date
  const [endDate, setEndDate] = useState(new Date()); // End date
  const axiosSecure = UseAxiosSecure();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displays, setdisplays] = useState([]); // Categories list
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosSecure.get(`/category/`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when the category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint =
          category === "All"
            ? "/product/all/get-all"
            : `/product/${selectedCategory}/get-all`;
        const response = await axiosSecure.get(endpoint);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  const handleSearch = async () => {
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
  
    try {
      const response = await axiosSecure.get(
        `/invoice/teaxo/sales?category=${category}&product=${product}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      console.log("Fetched data:", response.data);
      setdisplays(response.data);
      // Update state with the fetched data
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="bg-white border rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Product Sales Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Category Selector */}
          <div className="flex flex-col">
  <label className="text-gray-700 font-semibold mb-2">Category</label>
  <select
    value={category}
    onChange={(e) => {
      setCategory(e.target.value); // Update category state
      setSelectedCategory(e.target.value); // Update selectedCategory state
    }}
    className="border rounded-lg px-4 py-2 w-full"
  >
    <option value="All">All</option>
    {categories.map((cat) => (
      <option key={cat._id} value={cat.categoryName}>
        {cat.categoryName}
      </option>
    ))}
  </select>
</div>

          {/* Product Selector */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Product</label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            >
              <option value="All">All</option>
              {products.map((prod) => (
                <option key={prod._id} value={prod.productName}>
                  {prod.productName}
                </option>
              ))}
            </select>
          </div>

          {/* Date Pickers */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">From (Date)</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border rounded-lg px-4 py-2 w-full"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">To (Date)</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border rounded-lg px-4 py-2 w-full"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSearch}
            className="bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-800 transition"
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Report</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-left">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-3 border">SL.No</th>
                <th className="p-3 border">Product</th>
                <th className="p-3 border">Rate</th>
                <th className="p-3 border">Total QTY</th>
              </tr>
            </thead>
            <tbody>
              {displays.map((prod, index) => (
                <tr key={prod._id} className="hover:bg-gray-100">
                  <td className="p-3 border text-center">{index + 1}</td>
                  <td className="p-3 border">{prod.productName}</td>
                  <td className="p-3 border text-right">{prod.rate}</td>
                  <td className="p-3 border text-center">{prod.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductSalesReport;
