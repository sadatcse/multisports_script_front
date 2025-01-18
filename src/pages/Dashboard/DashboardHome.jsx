import React, { useState } from "react";
import {
  FaShoppingBag,
  FaChartBar,
  FaBoxes,
  FaDollarSign,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

// Fake Sales Data
const fakeSalesData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  sales: Math.floor(Math.random() * 1000) + 100,
}));

const DashboardHome = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex flex-col justify-between">
      {/* Dashboard Title */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-700">
          Dashboard <span className="text-blue-600">(Control Panel)</span>
        </h1>
      </div>

      {/* Card Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Pending Orders Card */}
        <div className="bg-blue-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <FaShoppingBag className="text-3xl" />
            <h2 className="text-3xl font-bold">0</h2>
          </div>
          <h3 className="text-lg mt-3">Pending Orders</h3>
        </div>

        {/* Total Sale Today */}
        <div className="bg-green-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <FaChartBar className="text-3xl" />
            <h2 className="text-3xl font-bold">$2,450</h2>
          </div>
          <h3 className="text-lg mt-3">Total Sale (Today)</h3>
        </div>

        {/* Yesterday Sale */}
        <div className="bg-yellow-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <FaDollarSign className="text-3xl" />
            <h2 className="text-3xl font-bold">$1,980</h2>
          </div>
          <h3 className="text-lg mt-3">Yesterday Sale</h3>
        </div>

        {/* Total Monthly Sale */}
        <div className="bg-red-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <FaBoxes className="text-3xl" />
            <h2 className="text-3xl font-bold">$65,430</h2>
          </div>
          <h3 className="text-lg mt-3">Total Monthly Sale</h3>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">
          Daily Sales (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={fakeSalesData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 text-center p-6 mt-auto rounded-lg shadow-lg">
  <p className="text-sm text-gray-700 font-medium">
    &copy; {moment().format("YYYY")} <span className="font-semibold">Teaxo POS Version 1.00</span>. Designed and Developed by 
    <a 
      href="https://www.sadatkhan.com" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-blue-500 hover:text-blue-700 underline transition duration-300">
      Sadat Khan
    </a>.
  </p>
  <div className="mt-2 text-xs text-gray-500">
    <p>All rights reserved. Empowering businesses with modern solutions.</p>
  </div>
</footer>

    </div>
  );
};

export default DashboardHome;