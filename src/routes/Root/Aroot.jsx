import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "../../components/Header";

const Aroot = () => {
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

export default Aroot;