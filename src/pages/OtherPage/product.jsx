import React, { useState, useEffect, useContext } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { TfiSearch } from "react-icons/tfi";
import { GoPlus } from "react-icons/go";
import Mpagination from "../../components library/Mpagination";
import MtableLoading from "../../components library/MtableLoading";
import Mtitle from "../../components library/Mtitle";
import ImageUpload from "../../config/ImageUploadcpanel";
import CategroieHook from "../../Hook/Categroie";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";

const Product = () => {
  const { categories, loading: categoriesLoading, error: categoriesError } = CategroieHook();
  const axiosSecure = UseAxiosSecure();
   const { branch } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    productName: "",
    flavour: false,
    cFlavor: false,
    addOns: false,
    vat: 0,
    price: "",
    vatType: "amount",
    status: "available",
    productDetails: "",
    branch: branch || "",
    photo: "",

  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vatInput, setVatInput] = useState(""); // Temporary state for VAT input
  const [debounceTimeout, setDebounceTimeout] = useState(null); // Timeout for debounce

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosSecure.get(`/product/`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddOrEditProduct = async () => {
    setIsLoading(true);
    try {
      if (editId) {
        // Update product
        await axiosSecure.put(`/product/update/${editId}`, formData);
      } else {
        // Add new product
        await axiosSecure.post("/product/post", formData);
      }
      fetchProducts();
      setIsModalOpen(false);
      setFormData({
        category: "",
        productName: "",
        flavour: false,
        cFlavor: false,
        addOns: false,
        vat: 0,
        price: "",
        vatType: "amount",
        status: "available",
        productDetails: "",
        branch: branch || "",
        photo: "",
      });
      setVatInput("");
      setEditId(null);
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVatInputChange = (value) => {
    setVatInput(value); // Update the VAT input immediately
    clearTimeout(debounceTimeout); // Clear the previous timeout

    const timeout = setTimeout(() => {
      // Perform the VAT calculation after 2 seconds of no input
      const numericValue = parseFloat(value) || 0;
      if (formData.vatType === "percentage") {
        const calculatedVAT = (numericValue / 100) * formData.price;
        setFormData((prev) => ({ ...prev, vat: calculatedVAT }));
      } else {
        setFormData((prev) => ({ ...prev, vat: numericValue }));
      }
    }, 2000);

    setDebounceTimeout(timeout); // Set the new timeout
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p._id === id);
    setEditId(id);
    setFormData(product);
    setVatInput(product.vatType === "percentage" ? product.vat : "");
    setIsModalOpen(true);
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/product/delete/${id}`)
          .then(() => {
            fetchProducts();
            Swal.fire("Deleted!", "The product has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
            Swal.fire("Error!", "Failed to delete product.", "error");
          });
      }
    });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleImageUpload = (url) => {
    if (url) {
      setFormData((prev) => ({ ...prev, photo: url }));
    } else {
      console.error("Image URL is undefined!");
    }
  };

  const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: filteredProducts });

  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="Product Management" rightcontent={
        <div className="flex md:mt-0 mt-3 justify-between">
          <div className="flex justify-end gap-4 items-center mb-4">
            {/* Search bar */}
            <div className="md:w-64 border shadow-sm py-2 px-3 bg-white rounded-xl">
              <div className="flex items-center gap-2">
                <TfiSearch className="text-2xl font-bold text-gray-500" />
                <input
                  type="text"
                  className="outline-none w-full"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            {/* Add new button */}
            <div className="flex gap-2 cursor-pointer items-center bg-blue-600 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-600 transition duration-300">
              <button
                onClick={() => setIsModalOpen(true)}
                className="font-semibold"
              >
                New
              </button>
              <GoPlus className="text-xl text-white" />
            </div>
          </div>
        </div>
      } ></Mtitle>

      <div className="text-sm md:text-base">
        {rowsPerPageAndTotal}
      </div>

      <section className="overflow-x-auto border shadow-sm rounded-xl p-4 pb- mt-5">
        <table className="table w-full">
          <thead className="bg-blue-600">
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3 rounded-l-xl">Product Name</td>
              <td className="p-3">Category</td>
              <td className="p-3">Price</td>
              <td className="p-3">Status</td>
              <td className="p-3 rounded-r-xl text-right px-8">Action</td>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No products found</td>
              </tr>
            ) : (
              paginatedData.map((product, index) => (
                <tr key={index} className="hover:bg-slate-100 hover:rounded-xl">
                  <td className="px-4 py-5">{product.productName}</td>
                  <td className="px-4 py-5">{product.category}</td>
                  <td className="px-4 py-5">৳{product.price}</td>
                  <td className="px-4 py-5">{product.status}</td>
                  <td className="py-5 px-6 text-lg flex justify-end space-x-4">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="text-blue-500 hover:text-yellow-700 transition duration-150"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="text-red-500 hover:text-red-700 transition duration-150"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <MtableLoading data={products}></MtableLoading>
        {paginationControls}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">{editId !== null ? "Edit Product" : "Add New Product"}</h2>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
            >
              <option value="">Select Category</option>
              {categoriesLoading ? (
                <option disabled>Loading...</option>
              ) : categoriesError ? (
                <option disabled>Error loading categories</option>
              ) : (
                categories.map((category) => (
                  <option key={category._id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))
              )}
            </select>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
              placeholder="Product Name"
            />
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
              placeholder="Price"
            />
            <div className="flex gap-4 items-center mb-5">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.flavour}
                  onChange={(e) => setFormData({ ...formData, flavour: e.target.checked })}
                />
                Flavour
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.cFlavor}
                  onChange={(e) => setFormData({ ...formData, cFlavor: e.target.checked })}
                />
                cFlavor
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.addOns}
                  onChange={(e) => setFormData({ ...formData, addOns: e.target.checked })}
                />
                Add-Ons
              </label>
            </div>
            <div className="mb-5">
              <label className="block mb-2">VAT</label>
              <select
                onChange={(e) => {
                  const type = e.target.value;
                  if (type === "amount") {
                    setFormData({ ...formData, vatType: "amount", vat: 0 });
                    setVatInput("");
                  } else if (type === "percentage") {
                    setFormData({ ...formData, vatType: "percentage", vat: 0 });
                    setVatInput("");
                  }
                }}
                className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-3"
              >
                <option value="amount">Amount</option>
                <option value="percentage">Percentage</option>
              </select>
              <input
                type="number"
                value={vatInput}
                onChange={(e) => handleVatInputChange(e.target.value)}
                className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={formData.vatType === "percentage" ? "Enter VAT (%)" : "Enter VAT (Amount)"}
              />
              {formData.vatType === "percentage" && (
                <p className="text-gray-500 text-sm mt-1">
                  VAT calculated from price: {formData.vat.toFixed(2)} Taka
                </p>
              )}
            </div>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <ImageUpload setImageUrl={(url) => handleImageUpload(url)} />
            <textarea
              value={formData.productDetails}
              onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
              placeholder="Product Details"
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({
                    category: "",
                    productName: "",
                    flavour: false,
                    cFlavor: false,
                    addOns: false,
                    vat: 0,
                    price: "",
                    vatType: "amount",
                    status: "available",
                    productDetails: "",
                    photo: "",
                  });
                  setVatInput("");
                  setEditId(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditProduct}
                className={`bg-blue-500 text-white py-2 px-4 font-semibold hover:bg-blue-700 rounded-xl transition duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : editId !== null ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
