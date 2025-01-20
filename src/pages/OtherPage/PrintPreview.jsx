import React from "react";
import { useLocation } from "react-router-dom";

const PrintPreview = () => {
  const location = useLocation();
  const { invoiceDetails } = location.state || {}; // Access passed state

  const handlePrint = () => {
    window.print(); // Trigger the browser's print functionality
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Invoice</h1>
      <div className="border p-4 rounded shadow">
        <p><strong>Branch:</strong> {invoiceDetails.branch}</p>
        <p><strong>Order Type:</strong> {invoiceDetails.orderType}</p>
        <p><strong>Counter:</strong> {invoiceDetails.counter}</p>
        <p><strong>User:</strong> {invoiceDetails.loginUserName} ({invoiceDetails.loginUserEmail})</p>
        <table className="min-w-full border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">Product</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
  
            </tr>
          </thead>
          <tbody>
            {invoiceDetails.products.map((product, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{product.productName}</td>
                <td className="border px-2 py-1">{product.qty}</td>
                <td className="border px-2 py-1">{product.rate} TK</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <p><strong>Total Qty:</strong> {invoiceDetails.totalQty}</p>
          <p><strong>Discount:</strong> {invoiceDetails.discount} TK</p>
          <p><strong>Total Amount:</strong> {invoiceDetails.totalAmount} TK</p>
          <p><strong>Total Sale:</strong> {invoiceDetails.totalSale} TK</p>
        </div>
        <button
          onClick={handlePrint}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default PrintPreview;
