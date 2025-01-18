import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import axios from "axios";

const CollectOrder = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [invoiceSummary, setInvoiceSummary] = useState({
    vat: 0,
    discount: 0,
  });

  useEffect(() => {
    // Fetch products from the API
    axios
      .get("http://localhost:8000/api/product/")
      .then((response) => {
        const data = response.data;
        const availableProducts = data.filter(
          (product) => product.status === "available"
        );

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(availableProducts.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);

        // Set products and default category
        setProducts(availableProducts);
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const addProduct = (product) => {
    const existingProduct = addedProducts.find((p) => p._id === product._id);
    if (existingProduct) {
      setAddedProducts(
        addedProducts.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setAddedProducts([...addedProducts, { ...product, quantity: 1 }]);
    }
  };

  const incrementQuantity = (id) => {
    setAddedProducts(
      addedProducts.map((p) =>
        p._id === id ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  const decrementQuantity = (id) => {
    setAddedProducts(
      addedProducts.map((p) =>
        p._id === id && p.quantity > 1
          ? { ...p, quantity: p.quantity - 1 }
          : p
      )
    );
  };

  const removeProduct = (id) => {
    setAddedProducts(addedProducts.filter((p) => p._id !== id));
  };

  const calculateTotal = () => {
    const subtotal = addedProducts.reduce(
      (total, p) => total + p.price * p.quantity,
      0
    );
    const vat = addedProducts.reduce(
      (total, p) => total + (p.vat * p.price * p.quantity) / 100,
      0
    );
    const discount = parseFloat(invoiceSummary.discount || 0);
    return subtotal + vat - discount;
  };

  return (
    <div className="flex p-4 gap-4">
      {/* Left Side: Tabs and Product List */}
      <div className="w-3/5">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 border p-2 rounded shadow">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4">
          {products
            .filter((product) => product.category === selectedCategory)
            .map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded shadow hover:shadow-lg"
              >
                <img
                  src={product.photo}
                  alt={product.productName}
                  className="h-32 w-full object-cover rounded mb-2"
                />
                <h3 className="font-bold">{product.productName}</h3>
                <p>{product.price} TK</p>
                <button
                  onClick={() => addProduct(product)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Right Side: Invoice Summary */}
      <div className="w-2/5 border p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Invoice Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Product</th>
                <th className="px-4 py-2 border-b">Quantity</th>
                <th className="px-4 py-2 border-b">Price</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {addedProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-2 border-b">{product.productName}</td>
                  <td className="px-4 py-2 border-b flex items-center gap-2">
                    <button
                      onClick={() => decrementQuantity(product._id)}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FaMinus />
                    </button>
                    {product.quantity}
                    <button
                      onClick={() => incrementQuantity(product._id)}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FaPlus />
                    </button>
                  </td>
                  <td className="px-4 py-2 border-b">
                    {product.price * product.quantity} TK
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => removeProduct(product._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span>Discount (TK):</span>
            <input
              type="number"
              className="border px-2 w-16"
              value={invoiceSummary.discount}
              onChange={(e) =>
                setInvoiceSummary({ ...invoiceSummary, discount: e.target.value })
              }
            />
          </div>
          <div className="flex justify-between mb-2">
            <span>Total:</span>
            <span>{calculateTotal().toFixed(2)} TK</span>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
            Confirm & Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectOrder;
