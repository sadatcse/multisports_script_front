import React, { useState, useEffect, useContext } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import axios from "axios";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";
import Food from "../../assets/Raw-Image/Food.jpg";
import useCompanyHook from "../../Hook/useCompanyHook";

const CollectOrder = () => {
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);
  const loginUserEmail = user?.email || "info@teaxo.com.bd";
  const loginUserName = user?.name || "Teaxo";
  const axiosSecure = UseAxiosSecure();
  const [products, setProducts] = useState([]);
  const [print, setprint] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [orderType, setOrderType] = useState("dine-in"); // New state for orderType
  const [invoiceSummary, setInvoiceSummary] = useState({
    vat: 0,
    discount: 0,
    paid: 0,
  });


  const { companies, loading, error } = useCompanyHook();


  useEffect(() => {
    axiosSecure
      .get("/product/")
      .then((response) => {
        const data = response.data;
        const availableProducts = data.filter(
          (product) => product.status === "available"
        );

        const uniqueCategories = [
          ...new Set(availableProducts.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
        setProducts(availableProducts);
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const roundAmount = (amount) => Math.round(amount);

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
    const payable = subtotal + vat - discount;
    return {
      subtotal: roundAmount(subtotal),
      vat: roundAmount(vat),
      discount: roundAmount(discount),
      payable: roundAmount(payable),
    };
  };

  const printInvoice = async (number) => {
    const { subtotal, vat, discount, payable } = calculateTotal();
    const paid = roundAmount(parseFloat(invoiceSummary.paid || 0));
    const change = paid - payable;
  
    const invoiceDetails = {
      orderType, 
      products: addedProducts.map((p) => ({
        productName: p.productName,
        qty: p.quantity,
        rate: p.price,
        subtotal: roundAmount(p.price * p.quantity),
      })),
      totalQty: addedProducts.reduce((total, p) => total + p.quantity, 0),
      discount: roundAmount(discount),
      totalAmount: payable,
      totalSale: payable, 
      loginUserEmail,
      loginUserName,
      counter: "Counter 1", 
      branch: "teaxo", 
    };
  
    try {
      const response = await axiosSecure.post("/invoice/post", invoiceDetails);
      console.log("Invoice saved successfully:", response.data);
      setprint(response.data);
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save the invoice. Please try again.");
    }
    if (number ==2){
      console.log(companies);
      console.log(print);

    }
  };
  

  const { subtotal, vat, discount, payable } = calculateTotal();
  const paid = roundAmount(parseFloat(invoiceSummary.paid || 0));
  const change = paid - payable;

  return (
    <div className="flex p-4 gap-4">
      <div className="w-3/5">
        {/* Categories */}
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
                  src={product.photo ? product.photo : Food}
                  alt={product.productName || "Food item"}
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

      <div className="w-2/5 border p-4 rounded shadow">
        {/* Order Type Selector */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Invoice Summary</h2>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="dine-in">Dine-in</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        {/* Invoice Table */}
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
                    {roundAmount(product.price * product.quantity)} TK
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

        {/* Invoice Details */}
        <div className="mt-4">
          <table className="w-full border border-gray-300">
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">VAT (TK):</td>
                <td className="px-4 py-2 border-b text-right">{vat}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Grand Total (TK):</td>
                <td className="px-4 py-2 border-b text-right">{subtotal}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Discount (TK):</td>
                <td className="px-4 py-2 border-b text-right">
                  <input
                    type="number"
                    className="border px-2"
                    value={invoiceSummary.discount}
                    onChange={(e) =>
                      setInvoiceSummary({
                        ...invoiceSummary,
                        discount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Payable Amount (TK):</td>
                <td className="px-4 py-2 border-b text-right font-bold">
                  {payable}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Paid Amount (TK):</td>
                <td className="px-4 py-2 border-b text-right">
                  <input
                    type="number"
                    className="border px-2"
                    value={invoiceSummary.paid}
                    onChange={(e) =>
                      setInvoiceSummary({
                        ...invoiceSummary,
                        paid: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Change Amount (TK):</td>
                <td className="px-4 py-2 border-b text-right">{change}</td>
              </tr>
            </tbody>
          </table>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => printInvoice(1)} // Pass 1 for Save button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
            >
              Save
            </button>
            <button
              onClick={() => printInvoice(2)} // Pass 2 for Print button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectOrder;
