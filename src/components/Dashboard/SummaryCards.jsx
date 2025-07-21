import React from "react";
import { FaShoppingBag, FaChartBar, FaBoxes, FaDollarSign } from "react-icons/fa";

const SummaryCards = ({ todaysPendingOrders, todaysTotalSale, yesterdaysTotalSale, dailySales, thisMonthName }) => (
  <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-blue-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <FaShoppingBag className="text-3xl opacity-75" />
        <h2 className="text-3xl font-bold">{todaysPendingOrders}</h2>
      </div>
      <h3 className="text-lg mt-3">Pending Orders</h3>
    </div>
    <div className="bg-green-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <FaChartBar className="text-3xl opacity-75" />
        <h2 className="text-3xl font-bold"><span>৳</span>{todaysTotalSale.toLocaleString()}</h2>
      </div>
      <h3 className="text-lg mt-3">Total Sale (Today)</h3>
    </div>
    <div className="bg-yellow-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <FaDollarSign className="text-3xl opacity-75" />
        <h2 className="text-3xl font-bold"><span>৳</span>{yesterdaysTotalSale.toLocaleString()}</h2>
      </div>
      <h3 className="text-lg mt-3">Yesterday's Sale</h3>
    </div>
    <div className="bg-red-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <FaBoxes className="text-3xl opacity-75" />
        <h2 className="text-3xl font-bold"><span>৳</span>{dailySales.reduce((total, day) => total + day.totalSale, 0).toLocaleString()}</h2>
      </div>
      <h3 className="text-lg mt-3">Total Sale ({thisMonthName})</h3>
    </div>
  </div>
);

export default SummaryCards;
