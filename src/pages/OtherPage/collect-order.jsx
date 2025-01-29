import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";
import Food from "../../assets/Raw-Image/Food.jpg";
import useCompanyHook from "../../Hook/useCompanyHook";
import ReceiptTemplate from "../../components/Receipt/ReceiptTemplate ";
import CategroieHook from "../../Hook/Categroie";
import CookingAnimation from "../../components/CookingAnimation";
const CollectOrder = () => {

  const { user } = useContext(AuthContext);
  const loginUserEmail = user?.email || "info@teaxo.com.bd";
  const [isProcessing, setIsProcessing] = useState(false);
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



  const { companies } = useCompanyHook();
  const receiptRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories } = CategroieHook();
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axiosSecure.get("/product/");
      const data = response.data;
      const availableProducts = data.filter(
        (product) => product.status === "available"
      );
  
      const uniqueCategories = [
        ...new Set(availableProducts.map((p) => p.category)),
      ];
      setProducts(availableProducts);
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [axiosSecure]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const roundAmount = (amount) => Math.round(amount);

  const handlePrintComplete = () => {
    setIsModalOpen(false); // Close modal after printing
  };

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

  const resetOrder = () => {
    setAddedProducts([]);
    setInvoiceSummary({ vat: 0, discount: 0, paid: 0 });
  };
  const validateInputs = () => {
    if (addedProducts.length === 0) {
      alert("Please add at least one product to the order.");
      return false;
    }
    if (invoiceSummary.discount < 0 || invoiceSummary.paid < 0) {
      alert("Discount and paid amounts cannot be negative.");
      return false;
    }
    return true;
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
    if (!validateInputs()) return;
    setIsProcessing(true);
    const {  vat, discount, payable } = calculateTotal();
    
    

    let data;

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
      totalAmount: roundAmount(payable),
      totalSale: roundAmount(payable),
      loginUserEmail,
      loginUserName,
      counter: "Counter 1",
      branch: "teaxo",
      vat:roundAmount(vat),
    };

    try {
      data = await axiosSecure.post("/invoice/post", invoiceDetails);
 
      setprint(data.data);
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save the invoice. Please try again.");
    }

    if (number === 2 && companies[0] && data?.data) {
      // Show and print the receipt
      setprint(data.data);
      setIsModalOpen(true); // Update the state with the saved invoice data
      if (receiptRef.current) {
        receiptRef.current.printReceipt(); // Trigger printing
        
      }
    }
    setIsProcessing(false);
    resetOrder();
  };
  

  const { subtotal, vat,  payable } = calculateTotal();
  const paid = roundAmount(parseFloat(invoiceSummary.paid || 0));
  const change = paid - payable;

  return (
<div>
   
{loading ? (
    <CookingAnimation />
  ) : (
    <div className="flex p-4 gap-4">

 <div className="w-4/6">
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
        <div className="overflow-x-auto">

    <table className="table-auto w-full border-collapse">
      <thead>
        <tr className="bg-blue-500">
          <th className="border px-4 py-2">Picture</th>
          <th className="border px-4 py-2">Product</th>
          <th className="border px-4 py-2">Rate</th>
          <th className="border px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {products
          .filter((product) => product.category === selectedCategory)
          .map((product) => (
            <tr key={product._id}>
              <td className="border px-4 py-2">
                <img
                  src={product.photo ? product.photo : Food}
                  alt={product.productName || "Food item"}
                  className="h-16 w-16 object-cover rounded"
                />
              </td>
              <td className="border px-4 py-2">{product.productName}</td>

              <td className="border px-4 py-2">{product.price} TK</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => addProduct(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>

</div>

      </div>




      <div className="w-2/6 border p-4 rounded shadow">
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
                <td className="px-4 py-2 border-b">Sub Total (TK):</td>
                <td className="px-4 py-2 border-b text-right">{subtotal}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">VAT (TK):</td>
                <td className="px-4 py-2 border-b text-right">{vat}</td>
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
                <td className="px-4 py-2 border-b">Total Amount (TK):</td>
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
                  onClick={() => printInvoice(1)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Save"}
                </button>
                <button
                  onClick={() => printInvoice(2)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Print"}
                </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)} // Close modal when clicking outside
        >
          <div
            className="bg-white p-6 rounded shadow-lg relative w-3/4"
            onClick={(e) => e.stopPropagation()} // Prevent closing on content click
          >
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded px-2 py-1"
              onClick={() => setIsModalOpen(false)} // Close button
            >
              Close
            </button>
            <ReceiptTemplate
              ref={receiptRef}
              onPrintComplete={handlePrintComplete}
              profileData={companies[0]} // Company profile
              invoiceData={print} // Invoice data
            />
          </div>
        </div>
      )}
    </div>

 )}
</div>
  );
};

export default CollectOrder;
