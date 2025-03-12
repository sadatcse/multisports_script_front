import React, { useState, useEffect, useCallback } from "react";
import { FaStore, FaBoxOpen, FaClipboardList, FaUserCheck, FaExchangeAlt, FaDollarSign, FaCheckCircle, FaTimesCircle, FaUser } from "react-icons/fa";

import UseAxiosSecure from "../../Hook/UseAxioSecure";

const AHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = UseAxiosSecure();
  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axiosSecure.get("/superadmin/dashboard");
      setDashboardData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const {
    totalBranches,
    totalProducts,
    totalCategories,
    todaysLogins,
    todaysTransactions,
    todaysSales,
    totalSuccessTransactions,
    totalUserLogs,
    totalErrorTransactions,
  } = dashboardData;

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Super Admin Dashboard</h1>
      
      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard icon={<FaStore />} title="Total Branches" value={totalBranches} color="bg-blue-500" />
        <DashboardCard icon={<FaBoxOpen />} title="Total Products" value={totalProducts} color="bg-green-500" />
        <DashboardCard icon={<FaClipboardList />} title="Total Categories" value={totalCategories} color="bg-yellow-500" />
        <DashboardCard icon={<FaUserCheck />} title="Today's Logins" value={todaysLogins} color="bg-purple-500" />
        <DashboardCard icon={<FaExchangeAlt />} title="Today's Transactions" value={todaysTransactions} color="bg-indigo-500" />
        <DashboardCard icon={<FaDollarSign />} title="Today's Sales" value={`${todaysSales} TK`} color="bg-red-500" />
        <DashboardCard icon={<FaCheckCircle />} title="Total Success Logs" value={totalSuccessTransactions} color="bg-teal-500" />
        <DashboardCard icon={<FaTimesCircle />} title="Total Error Logs" value={totalErrorTransactions} color="bg-orange-500" />
        <DashboardCard icon={<FaUser />} title="Total User Logs" value={totalUserLogs} color="bg-gray-500" />
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, value, color }) => {
  return (
    <div className={`${color} rounded-lg shadow-lg p-5 text-white flex flex-col justify-between`}>
      <div className="flex justify-between items-center">
        <div className="text-4xl">{icon}</div>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>
      <h3 className="text-lg mt-3">{title}</h3>
    </div>
  );
};

export default AHome;