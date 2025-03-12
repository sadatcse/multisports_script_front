import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";


const DRoot = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen width to determine if it's mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Example breakpoint for mobile
    };

    handleResize(); // Initialize on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      {/* Conditionally render the sidebar */}
      {!isMobile && (
        <div className="fixed w-[200px] h-full">
          <Sidebar />
        </div>
      )}

      {/* Main content area */}
      <div className={`${!isMobile ? "ml-[270px]" : "ml-0"} flex-1`}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default DRoot;
