import React, { useState, useEffect, useContext, useRef } from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Swal from "sweetalert2";
import Mtitle from "../../components library/Mtitle";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";
import useCompanyHook from "../../Hook/useCompanyHook";
import ReceiptTemplate from "../../components/Receipt/ReceiptTemplate ";

const UpdateOrdersHistory  = () => {
  const axiosSecure = UseAxiosSecure();
  const { companies, loading, error } = useCompanyHook();
  const receiptRef = useRef();
  const { branch } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printOrderId, setPrintOrderId] = useState(null);
const [print, setprint] = useState([]);


  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await axiosSecure.get(`/invoice/${branch}/status/completed`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  const handleOrderUpdate = async (id, status) => {
    try {
      setIsLoading(true);
      await axiosSecure.put(`/invoice/update/${id}`, { orderStatus: status });
      fetchPendingOrders();
      Swal.fire("Success!", `Order has been updated to ${status}.`, "success");
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire("Error!", "Failed to update order status. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setIsModalOpen(true);
  };

  const handlePrintComplete = () => {
    setIsPrintModalOpen(false); // Close modal after printing
  };

  const handlePrintOrder = (id) => {
    // Find the order with the matching ID
    const order = orders.find((order) => order._id === id);
  
    if (order) {
      // Set the found order to the printOrder state
      setprint(order);
    }
  
    // Set the print modal to open
    setIsPrintModalOpen(true);
  
    // Trigger printing if the receiptRef is defined
    if (receiptRef.current) {
      receiptRef.current.printReceipt();
    }
  };
  const handleSaveEditOrder = async () => {
    try {
      setIsLoading(true);
      await axiosSecure.put(`/invoice/update/${editOrder._id}`, { products: editOrder.products });
      fetchPendingOrders();
      setIsModalOpen(false);
      Swal.fire("Success!", "Order has been updated.", "success");
    } catch (error) {
      console.error("Error saving order edits:", error);
      Swal.fire("Error!", "Failed to save order edits. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/invoice/delete/${id}`);
          fetchPendingOrders();
          Swal.fire("Deleted!", "The order has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire("Error!", "Failed to delete order.", "error");
        }
      }
    });
  };

  const handleProductChange = (index, qty) => {
    const updatedProducts = [...editOrder.products];
    updatedProducts[index].qty = qty;
    updatedProducts[index].subtotal = qty * updatedProducts[index].rate;
    setEditOrder({ ...editOrder, products: updatedProducts });
  };

  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="Finished Order" />

      <section className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
        <table className="table w-full">
          <thead className="bg-blue-600">
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3">Order ID</td>
              <td className="p-3">Date</td>
              <td className="p-3">User</td>
              <td className="p-3">Total</td>
              <td className="p-3">Order Type</td>
              <td className="p-3 text-right">Action</td>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No Finished Order found</td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3">{order.invoiceSerial}</td>
                  <td className="p-3">{new Date(order.dateTime).toLocaleString()}</td>
                  <td className="p-3">{order.loginUserName}</td>
                  <td className="p-3">{order.totalAmount} Taka</td>
                  <td className="p-3">{order.orderType}</td>
                  <td className="p-3 text-right flex justify-end gap-4">
                  <button
                      onClick={() => handlePrintOrder(order._id)}
                      className="bg-purple-500 text-white py-1 px-3 rounded hover:bg-purple-700 transition"
                      disabled={isLoading}
                    >
                      Print
                    </button>
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                      disabled={isLoading}
                    >
                       
                        <span>View</span>
                    </button>
              
                    <button
                      onClick={() => handleRemove(order._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                      disabled={isLoading}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {isModalOpen && editOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Tea XO</h2>
                <p className="text-sm text-gray-600">26/C Block Taj Mahal Road, Mohammadpur, Dhaka</p>
                <p className="text-sm text-gray-600">
                  Cell: 01711659618
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-600 text-lg hover:text-red-800"
              >
                ✖
              </button>
            </div>

            {/* Order Details */}
            <div className="mb-6">
              <p className="text-gray-800">
                <strong>Order Type:</strong> {editOrder.orderType} | <strong>Counter:</strong> {editOrder.counter} | <strong>Served By:</strong> {editOrder.loginUserName}
              </p>
              <p className="text-gray-600">
                <strong>Date:</strong> {new Date(editOrder.dateTime).toLocaleString()}
              </p>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="table-auto w-full text-left border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-gray-700 font-semibold border">SL. NO</th>
                    <th className="p-3 text-gray-700 font-semibold border">Product</th>
                    <th className="p-3 text-gray-700 font-semibold border">Qty</th>
                    <th className="p-3 text-gray-700 font-semibold border">Rate</th>
                    <th className="p-3 text-gray-700 font-semibold border">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {editOrder.products.map((product, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3 text-gray-700">{index + 1}</td>
                      <td className="p-3 text-gray-700">{product.productName}</td>
                      <td className="p-3 text-gray-700">{product.qty}</td>
                      <td className="p-3 text-gray-700">{product.rate} Taka</td>
                      <td className="p-3 text-gray-700">{product.subtotal} Taka</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-800 font-medium">
                <strong>Total Qty:</strong> {editOrder.products.reduce((sum, p) => sum + p.qty, 0)}
              </p>
              <p className="text-gray-800 font-medium">
                <strong>Total Amount:</strong> {editOrder.products.reduce((sum, p) => sum + p.subtotal, 0)} Taka
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <p className="text-gray-500 text-sm">Powered by Tea XO</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

{isPrintModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Print Order</h2>
            <p>Order ID: {printOrderId}</p>
            <div className="flex justify-end gap-4 mt-6">
       
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
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
        </div>
      )}
    </div>
  );
};

export default UpdateOrdersHistory ;