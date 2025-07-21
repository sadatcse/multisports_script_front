import React, { useState, useEffect, useCallback, useContext } from "react";
import moment from "moment";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";
import DailySales from "./../../components/Dashboard/DailySales";
import MonthlyRevenue from "./../../components/Dashboard/MonthlyRevenue";
import OrderTimingChart from "./../../components/Dashboard/OrderTimingChart";
import FavouriteCharts from "./../../components/Dashboard/FavouriteCharts";
import TrendingOrders from "./../../components/Dashboard/TrendingOrders";
import CookingAnimation from "../../components/CookingAnimation";
import SummaryCards from "./../../components/Dashboard/SummaryCards";
import RecentlyPlacedOrders from "./../../components/Dashboard/RecentlyPlacedOrders";

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, branch } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axiosSecure.get(`/invoice/${branch}/dashboard`);
      setDashboardData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, branch]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <CookingAnimation />;
  if (error)
    return <div className="text-center text-red-500 p-8">{error}</div>;

  const {
    todaysTotalSale,
    yesterdaysTotalSale,
    dailySales,
    thisMonthName,
    todaysPendingOrders,
  } = dashboardData;

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome, {user?.name || "Admin"}
          </h1>
        </div>

        <div className="col-span-12">
          <SummaryCards
            todaysPendingOrders={todaysPendingOrders}
            todaysTotalSale={todaysTotalSale}
            yesterdaysTotalSale={yesterdaysTotalSale}
            dailySales={dailySales}
            thisMonthName={thisMonthName}
          />
        </div>

        {/* --- CHANGED: Daily Sales Chart (50% width on large screens) --- */}
        <div className="col-span-12 lg:col-span-9">
          <DailySales dailySales={dailySales} />
        </div>

        {/* --- CHANGED: Monthly Revenue Chart (50% width on large screens) --- */}
        <div className="col-span-12 lg:col-span-3">
          <MonthlyRevenue />
        </div>
        
        {/* --- Other Components (2x2 Grid) --- */}
        <div className="col-span-12 lg:col-span-12">
            <TrendingOrders />
        </div>
        
        <div className="col-span-12 lg:col-span-8">
            <OrderTimingChart />
        </div>
        
        <div className="col-span-12 lg:col-span-4">
            <FavouriteCharts />
        </div>
        
        <div className="col-span-12 lg:col-span-12">
            <RecentlyPlacedOrders />
        </div>


        <div className="col-span-12">
          <footer className="text-center py-4 mt-6">
            <p className="text-sm text-gray-600">
              &copy; {moment().format("YYYY")}{" "}
              <span className="font-semibold">
                RESTAURANT MANAGEMENT SYSTEM 1.00
              </span>
              . Designed and Developed by{" "}
              <a
                href="https://www.sadatkhan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline ml-1"
              >
                Sadat Khan
              </a>
              .
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <p>
                All rights reserved. Empowering businesses with modern
                solutions.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;