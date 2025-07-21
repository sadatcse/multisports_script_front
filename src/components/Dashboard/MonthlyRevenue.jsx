import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { AuthContext } from "../../providers/AuthProvider";
import UseAxiosSecure from "../../Hook/UseAxioSecure";

const MonthlyRevenue = () => {
  const allMonths = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const currentMonthIndex = moment().month();
  const months = allMonths.slice(0, currentMonthIndex + 1);
  const currentMonthName = allMonths[currentMonthIndex];
  
  const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);

  // 1. Corrected initial state to match the API response structure
  const [weeklyData, setWeeklyData] = useState({
    weeklyPercentage: [],
    totalMonthSale: 0,
  });

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    if (!branch) return;

    const fetchWeeklyData = async () => {
      try {
        // 2. Convert month name ("July") to month number (7) for the API
        const monthNumber = allMonths.indexOf(selectedMonth) + 1;

        const res = await axiosSecure.get(`/invoice/${branch}/weekly-sales`, {
          params: {
            month: monthNumber, // Send the correct month number
          },
        });
        
        setWeeklyData(res.data || { weeklyPercentage: [], totalMonthSale: 0 });
      } catch (error) {
        console.error("Error fetching weekly sales data:", error);
        // Reset state on error to prevent crashes
        setWeeklyData({ weeklyPercentage: [], totalMonthSale: 0 });
      }
    };

    fetchWeeklyData();
  }, [branch, selectedMonth]); // Removed currentYear from dependency array as it's handled in the backend

  return (
    <div className="col-span-12 xl:col-span-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h6 className="text-lg font-bold text-gray-700">Monthly Earning</h6>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 space-y-4">
          {/* 3. Corrected rendering logic to map over the weeklyPercentage array */}
          {weeklyData.weeklyPercentage.length > 0 ? (
            weeklyData.weeklyPercentage.map((weekInfo, i) => (
              <div key={i}>
                <span className="text-sm font-semibold">{weekInfo.week}</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${weekInfo.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No sales data for this month.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyRevenue;