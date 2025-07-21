import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";
import Food from "../../assets/Raw-Image/Food.jpg";
import useCompanyHook from "../../Hook/useCompanyHook";
import ReceiptTemplate from "../../components/Receipt/ReceiptTemplate ";
import CategroieHook from "../../Hook/Categroie";
import CookingAnimation from "../../components/CookingAnimation";
import useCustomerTableSearch from "../../Hook/useCustomerTableSearch";
import NewCustomerModal from "../../components/Modal/NewCustomerModal";
import Swal from "sweetalert2";
import TableSelectionModal from "../../components/Modal/TableSelectionModal";
import OrderTypeSelectionModal from "../../components/Modal/OrderTypeSelectionModal.js";
import DeliveryProviderSelectionModal from "../../components/Modal/DeliveryProviderSelectionModal"; // Import the new modal
import { toast } from "react-toastify";

const CollectOrder = () => {
  const { user, branch } = useContext(AuthContext);
  const loginUserEmail = user?.email || "info@leavesoft.com";
  const [isProcessing, setIsProcessing] = useState(false);
  const loginUserName = user?.name || "leavesoft";
  const [mobile, setMobile] = useState("");

  const {
    customer,
    tables,
    searchCustomer,
    selectedTable,
    isCustomerModalOpen,
    setSelectedTable,
    setCustomerModalOpen,
  } = useCustomerTableSearch();

  const axiosSecure = UseAxiosSecure();
  const [products, setProducts] = useState([]);
  const [TableName, setTableName] = useState("");
  const [print, setprint] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const customerName = customer?.name || "Guest";
  const customerMobile = customer?.mobile || "n/a";
  const [addedProducts, setAddedProducts] = useState([]);
  const [orderType, setOrderType] = useState(null);
  const [deliveryProvider, setDeliveryProvider] = useState("");

  const [invoiceSummary, setInvoiceSummary] = useState({
    vat: 0,
    discount: 0,
    paid: 0,
  });

  // Modal state management
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(true);
  const [isTableSelectionModalOpen, setIsTableSelectionModalOpen] = useState(false);
  const [isDeliveryProviderModalOpen, setIsDeliveryProviderModalOpen] = useState(false); // State for the new modal

  const handleCustomerSearch = () => {
    if (!mobile) {
      Swal.fire("Error", "Please enter a mobile number.", "error");
      return;
    }
    if (!/^\d{11}$/.test(mobile)) {
      Swal.fire("Invalid Number", "Mobile number must be exactly 11 digits.", "warning");
      return;
    }
    searchCustomer(mobile);
  };

  const { companies } = useCompanyHook();
  const receiptRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories } = CategroieHook();
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axiosSecure.get(`/product/branch/${branch}/get-all/`);
      const data = response.data;
      const availableProducts = data.filter((product) => product.status === "available");
      const uniqueCategories = [...new Set(availableProducts.map((p) => p.category))];
      setProducts(availableProducts);
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [axiosSecure, branch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOrderTypeSelect = (type) => {
    setOrderType(type);
    setIsOrderTypeModalOpen(false);

    if (type === "dine-in") {
      setIsTableSelectionModalOpen(true);
    } else if (type === "delivery") {
      setIsDeliveryProviderModalOpen(true);
    } else {
      setTableName("");
      setSelectedTable("");
      setDeliveryProvider("");
    }
  };
  
const handleOrderTypeChange = (type) => {
  setOrderType(type);
  // Reset table/delivery info when changing type
  setSelectedTable("");
  setTableName("");
  setDeliveryProvider("");

  // Open the relevant modal
  if (type === "dine-in") {
    setIsTableSelectionModalOpen(true);
  } else if (type === 'delivery') {
    setIsDeliveryProviderModalOpen(true); 
  } else {
    // For "takeaway", close any other modals that might be open
    setIsTableSelectionModalOpen(false);
    setIsDeliveryProviderModalOpen(false);
  }
};
  
  const handleDeliveryProviderSelect = (provider) => {
    setDeliveryProvider(provider);
    setIsDeliveryProviderModalOpen(false);
  };

  const roundAmount = (amount) => Math.round(amount);

  const addProduct = (product) => {
    const existingProduct = addedProducts.find((p) => p._id === product._id);
    if (existingProduct) {
      setAddedProducts(addedProducts.map((p) => (p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p)));
    } else {
      setAddedProducts([...addedProducts, { ...product, quantity: 1 }]);
    }
  };

  const incrementQuantity = (id) => {
    setAddedProducts(addedProducts.map((p) => (p._id === id ? { ...p, quantity: p.quantity + 1 } : p)));
  };

const handleTableSelect = (tableId) => {
  setSelectedTable(tableId); // Use the tableId passed directly to the function
  const selectedTableObj = tables.find((table) => table._id === tableId);
  setTableName(selectedTableObj ? selectedTableObj.tableName : "");
};

  const handleTableSelectionConfirm = () => {
    if (selectedTable) {
      setIsTableSelectionModalOpen(false);
    } else {
      Swal.fire("Error", "Please select a table to continue.", "error");
    }
  };

  const handleKitchenClick = () => {
    if (addedProducts.length === 0) {
      toast.warn("Please add products before sending to kitchen.");
      return;
    }
    toast.info("KOT Sent to Kitchen!");
  };

  const resetOrder = () => {
    setAddedProducts([]);
    setInvoiceSummary({ vat: 0, discount: 0, paid: 0 });
    setMobile("");
    setSelectedTable("");
    setTableName("");
    setOrderType(null);
    setDeliveryProvider("");
    setIsOrderTypeModalOpen(true);
    toast.error("Order Reset!");
  };

  const decrementQuantity = (id) => {
    setAddedProducts(addedProducts.map((p) => (p._id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p)));
  };
  
  const validateInputs = () => {
    if (addedProducts.length === 0) {
      Swal.fire("Validation Error", "Please add at least one product.", "error");
      return false;
    }
    if (orderType === "dine-in" && !TableName) {
        Swal.fire("Validation Error", "Please select a table for the dine-in order.", "error");
        return false;
    }
    if (orderType === "delivery" && !deliveryProvider) {
        Swal.fire("Validation Error", "Please select a delivery provider.", "error");
        return false;
    }
    if (invoiceSummary.discount < 0 || invoiceSummary.paid < 0) {
      Swal.fire("Validation Error", "Discount and paid amounts cannot be negative.", "error");
      return false;
    }
    return true;
  };

  const removeProduct = (id) => {
    setAddedProducts(addedProducts.filter((p) => p._id !== id));
  };

  const calculateTotal = () => {
    const subtotal = addedProducts.reduce((total, p) => total + p.price * p.quantity, 0);
    const vat = addedProducts.reduce((total, p) => total + (p.vat * p.price * p.quantity) / 100, 0);
    const discount = parseFloat(invoiceSummary.discount || 0);
    const payable = subtotal + vat - discount;
    return {
      subtotal: roundAmount(subtotal),
      vat: roundAmount(vat),
      discount: roundAmount(discount),
      payable: roundAmount(payable),
    };
  };

  const printInvoice = async (isPrintAction) => {
    if (!validateInputs()) return;
    setIsProcessing(true);

    const { vat, discount } = calculateTotal();
    const invoiceDetails = {
      orderType,
      products: addedProducts.map((p) => ({
        productName: p.productName,
        qty: p.quantity,
        rate: p.price,
        subtotal: roundAmount(p.price * p.quantity),
      })),
      discount: roundAmount(discount),
      vat: roundAmount(vat),
      loginUserEmail,
      loginUserName,
      customerName,
      customerMobile,
      counter: "Counter 1",
      branch: branch,
    };

    if (orderType === "dine-in") {
      invoiceDetails.tableName = TableName;
    }
    if (orderType === "delivery") {
      invoiceDetails.deliveryProvider = deliveryProvider;
    }

    try {
      const { data } = await axiosSecure.post("/invoice/post", invoiceDetails);
      setprint(data);
      toast.success("Invoice saved successfully!");

      if (isPrintAction && companies[0] && data) {
        setIsModalOpen(true);
      } else {
        resetOrder();
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      const errorMessage = error.response?.data?.error || "Failed to save the invoice.";
      Swal.fire("Error", errorMessage, "error");
    } finally {
        setIsProcessing(false);
    }
  };

  const { subtotal, vat, payable } = calculateTotal();
  const paid = roundAmount(parseFloat(invoiceSummary.paid || 0));
  const change = paid - payable;

  return (
    <div>
      <OrderTypeSelectionModal
        isOpen={isOrderTypeModalOpen}
        onSelect={handleOrderTypeSelect}
        onClose={() => !orderType && setIsOrderTypeModalOpen(true)}
      />

      <TableSelectionModal
        isOpen={isTableSelectionModalOpen}
        tables={tables}
        selectedTable={selectedTable}
        handleTableSelect={handleTableSelect}
        onConfirm={handleTableSelectionConfirm}
        onClose={() => setIsTableSelectionModalOpen(false)}
      />

      <DeliveryProviderSelectionModal
        isOpen={isDeliveryProviderModalOpen}
        onSelect={handleDeliveryProviderSelect}
        onClose={() => setIsDeliveryProviderModalOpen(false)}
      />
      
      {/* Main Order Screen will only render when all preliminary modals are closed */}
      {!isOrderTypeModalOpen && !isTableSelectionModalOpen && !isDeliveryProviderModalOpen && (
        loading ? (
          <CookingAnimation />
        ) : (
          <div className="flex flex-col lg:flex-row p-4 gap-4">
            <NewCustomerModal
              isOpen={isCustomerModalOpen}
              onClose={() => setCustomerModalOpen(false)}
              mobile={mobile}
            />
            <div className="w-full lg:w-4/6">
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
              <div className="overflow-y-auto h-[calc(100vh-200px)]">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-500 text-white sticky top-0">
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

            <div className="w-full lg:w-2/6 ">
              <div className="border p-4 rounded shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Enter Mobile Number:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                      <button className="p-2 bg-blue-500 text-white rounded" onClick={handleCustomerSearch}>
                        Search
                      </button>
                    </div>
                  </div>
                  {orderType === 'dine-in' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium">Selected Table:</label>
                      <div className="p-2 border rounded bg-gray-100 font-bold text-center">
                        {TableName || 'N/A'}
                      </div>
                    </div>
                  )}
                  {/* Display selected delivery provider */}
                  {orderType === 'delivery' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium">Provider:</label>
                      <div className="p-2 border rounded bg-gray-100 font-bold text-center">
                        {deliveryProvider || 'N/A'}
                      </div>
                    </div>
                  )}
                </div>

                {customer && (
                  <div className="mb-4 p-4 border rounded ">
                    <p><strong>Customer Name:</strong> {customer.name}</p>
                  </div>
                )}
              </div>

              <div className="border p-4 rounded shadow mt-4">
                <div className="flex justify-between items-center mb-4 ">
                  <h2 className="text-xl font-bold">Invoice Summary</h2>
                  <select
                    value={orderType}
                    onChange={(e) => handleOrderTypeChange(e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="dine-in">Dine-in</option>
                    <option value="takeaway">Takeaway</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
                
                {/* The inline dropdown is now removed from here */}

                <div className="overflow-x-auto max-h-60">
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
                          <td className="px-4 py-2 border-b flex items-center gap-2 justify-center">
                            <button onClick={() => decrementQuantity(product._id)} className="p-2 bg-gray-200 rounded hover:bg-gray-300"><FaMinus /></button>
                            {product.quantity}
                            <button onClick={() => incrementQuantity(product._id)} className="p-2 bg-gray-200 rounded hover:bg-gray-300"><FaPlus /></button>
                          </td>
                          <td className="px-4 py-2 border-b">{roundAmount(product.price * product.quantity)} TK</td>
                          <td className="px-4 py-2 border-b">
                            <button onClick={() => removeProduct(product._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
                            className="border px-2 w-24 text-right"
                            value={invoiceSummary.discount}
                            onChange={(e) => setInvoiceSummary({ ...invoiceSummary, discount: parseFloat(e.target.value) || 0 })}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b font-bold">Total Amount (TK):</td>
                        <td className="px-4 py-2 border-b text-right font-bold">{payable}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b">Paid Amount (TK):</td>
                        <td className="px-4 py-2 border-b text-right">
                          <input
                            type="number"
                            className="border px-2 w-24 text-right"
                            value={invoiceSummary.paid}
                            onChange={(e) => setInvoiceSummary({ ...invoiceSummary, paid: parseFloat(e.target.value) || 0 })}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b">Change Amount (TK):</td>
                        <td className="px-4 py-2 border-b text-right">{change}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <button onClick={() => printInvoice(false)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Save"}
                    </button>
                    <button onClick={() => printInvoice(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Print"}
                    </button>
                    <button onClick={handleKitchenClick} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 w-full" disabled={isProcessing}>Kitchen</button>
                    <button onClick={resetOrder} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full" disabled={isProcessing}>Reset</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg relative w-3/4 max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded px-2 py-1"
              onClick={() => {
                  setIsModalOpen(false);
                  resetOrder();
              }}
            >
              Close
            </button>
            <ReceiptTemplate
              ref={receiptRef}
              onPrintComplete={() => {
                  setIsModalOpen(false);
                  resetOrder();
              }}
              profileData={companies[0]}
              invoiceData={print}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectOrder;