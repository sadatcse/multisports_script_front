import React, { useState, useEffect } from "react";
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
import axios from "axios";
import UseAxiosSecure from "../../Hook/UseAxioSecure";

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = UseAxiosSecure();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosSecure.get("/invoice/teaxo/dashboard");
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const {
    todaysTotalSale,
    yesterdaysTotalSale,
    todaysTotalItems,
    dailySales,
    thisMonthName,
    todaysPendingOrders,
  } = dashboardData;

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
            <h2 className="text-3xl font-bold">{todaysPendingOrders}</h2> 
          </div>
          <h3 className="text-lg mt-3">Pending Orders</h3>
        </div>

        {/* Total Sale Today */}
        <div className="bg-green-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <FaChartBar className="text-3xl" />
            <h2 className="text-3xl font-bold">{todaysTotalSale} TK</h2>
          </div>
          <h3 className="text-lg mt-3">Total Sale (Today)</h3>
        </div>

        {/* Yesterday Sale */}
        <div className="bg-yellow-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <FaDollarSign className="text-3xl" />
            <h2 className="text-3xl font-bold">{yesterdaysTotalSale} TK</h2>
          </div>
          <h3 className="text-lg mt-3">Yesterday Sale</h3>
        </div>

        {/* Total Monthly Sale */}
        <div className="bg-red-500 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <FaBoxes className="text-3xl" />
            <h2 className="text-3xl font-bold">
              {dailySales.reduce((total, day) => total + day.totalSale, 0)} TK
            </h2>
          </div>
          <h3 className="text-lg mt-3">Total Sale ({thisMonthName})</h3>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">
          Daily Sales (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={dailySales.map((day) => ({
              date: moment(day.date).format("MMM DD"),
              sales: day.totalSale,
            }))}
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
          &copy; {moment().format("YYYY")}{" "}
          <span className="font-semibold">Teaxo POS Version 1.00</span>. Designed
          and Developed by
          <a
            href="https://www.sadatkhan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline transition duration-300"
          >
            Sadat Khan
          </a>
          .
        </p>
        <div className="mt-2 text-xs text-gray-500">
          <p>All rights reserved. Empowering businesses with modern solutions.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardHome;
