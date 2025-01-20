import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from "react-paginate";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { Modal } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import moment from "moment/moment";

const OrderHistory = () => {
  const [date, setDate] = useState(new Date());
  const [orderData, setOrderData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 5;
  const axiosSecure = UseAxiosSecure();
  const [showcaseData, setShowcaseData] = useState({
    totalOrders: 0,
    totalQuantity: 0,
    totalAmount: 0,
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      // Format the date to 'YYYY-MM-DD'
      const formattedDate = moment(date).format('YYYY-MM-DD');
      
      // Make the request with the formatted date
      const response = await axiosSecure.get(`/invoice/teaxo/date/${formattedDate}`);
      const data = response.data;
  
      if (data && data.orders) {
        const totalOrders = data.totalOrders || 0;
        const totalQuantity = data.totalQty || 0;
        const totalAmount = data.totalAmount || 0;
  
        setShowcaseData({ totalOrders, totalQuantity, totalAmount });
        setOrderData(data.orders);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const currentOrders = orderData.slice(
    currentPage * ordersPerPage,
    (currentPage + 1) * ordersPerPage
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white border rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">Order History</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-3">Select Date</label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              className="border border-blue-300 rounded-lg px-4 py-3 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchOrders}
              className="bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-800 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center  bg-gray-100 m-5">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white shadow-xl rounded-lg">
    <div className="bg-blue-50 p-6 shadow-md rounded-lg text-center">
      <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
      <p className="text-4xl font-bold text-blue-600 mt-2">{showcaseData.totalOrders}</p>
    </div>
    <div className="bg-blue-50 p-6 shadow-md rounded-lg text-center">
      <h3 className="text-lg font-semibold text-gray-700">Total Quantity</h3>
      <p className="text-4xl font-bold text-blue-600 mt-2">{showcaseData.totalQuantity}</p>
    </div>
    <div className="bg-blue-50 p-6 shadow-md rounded-lg text-center">
      <h3 className="text-lg font-semibold text-gray-700">Total Amount</h3>
      <p className="text-4xl font-bold text-blue-600 mt-2">{showcaseData.totalAmount.toFixed(2)} TK</p>
    </div>
  </div>
</div>


      <div className="bg-white border rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Order Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-4 border">Serial</th>
                <th className="p-4 border">Time</th>
                <th className="p-4 border">Order ID</th>
                <th className="p-4 border">Quantity</th>
                <th className="p-4 border">Amount</th>
                <th className="p-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">No orders found</td>
                </tr>
              ) : (
                currentOrders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-blue-50">
                    <td className="p-4 border text-center">{index + 1 + currentPage * ordersPerPage}</td>
                    <td className="p-4 border text-center">{new Date(order.dateTime).toLocaleTimeString()}</td>
                    <td className="p-4 border text-center">{order.invoiceSerial}</td>
                    <td className="p-4 border text-center">{order.totalQty}</td>
                    <td className="p-4 border text-right">{order.totalAmount.toFixed(2)}</td>
                    <td className="p-4 border text-center">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded shadow hover:bg-blue-800 transition"
                      >
                        <FaEye /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(orderData.length / ordersPerPage)}
            onPageChange={handlePageClick}
            containerClassName={"flex justify-center items-center space-x-4"}
            activeClassName={"bg-blue-700 text-white px-4 py-2 rounded"}
            pageClassName={"px-4 py-2 border rounded hover:bg-blue-200"}
            previousClassName={"px-4 py-2 border rounded hover:bg-blue-200"}
            nextClassName={"px-4 py-2 border rounded hover:bg-blue-200"}
          />
        </div>
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
      <div className="flex justify-between items-center border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-red-500 text-xl"
        >
          ✖
        </button>
      </div>
      {selectedOrder && (
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Order ID:</strong> {selectedOrder.invoiceSerial}</p>
              <p><strong>Staff Name:</strong> {selectedOrder.loginUserName}</p>
              <p><strong>Counter:</strong> {selectedOrder.counter}</p>
              <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
            </div>
            <div>
              <p><strong>Date:</strong> {new Date(selectedOrder.dateTime).toLocaleDateString()}</p>
              <p><strong>Order Type:</strong> {selectedOrder.orderType}</p>
              <p><strong>Total:</strong> ৳{selectedOrder.totalAmount.toFixed(2)}</p>
              <p><strong>VAT:</strong> ৳{selectedOrder.vat.toFixed(2)}</p>
              <p><strong>Discount:</strong> ৳{selectedOrder.discount.toFixed(2)}</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-6">Products:</h3>
          <table className="w-full mt-4 border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
               
                <th className="border px-4 py-2 text-left text-gray-700">Product Name</th>
                <th className="border px-4 py-2 text-center text-gray-700">Quantity</th>
                <th className="border px-4 py-2 text-center text-gray-700">Rate</th>
                <th className="border px-4 py-2 text-center text-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-gray-800">{product.productName}</td>
                  <td className="border px-4 py-2 text-center text-gray-800">{product.qty}</td>
                  <td className="border px-4 py-2 text-center text-gray-800">৳{product.rate.toFixed(2)}</td>
                  <td className="border px-4 py-2 text-center text-gray-800">৳{product.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end px-6 py-4 border-t">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default OrderHistory;
