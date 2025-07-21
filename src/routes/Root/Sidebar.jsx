// src/layouts/Sidebar.js

import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";
import menuItems from "./MenuItems";
import useCompanyHook from "../../Hook/useCompanyHook";

// The AccordionItem component remains the same.
const AccordionItem = ({ item, isSidebarOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    if (item.list) {
        return (
            <li className="my-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center p-3 rounded-md text-gray-600 hover:bg-gray-200"
                >
                    <div className="flex items-center gap-3">
                        {item.icon}
                        {isSidebarOpen && <span className="font-medium text-sm">{item.title}</span>}
                    </div>
                    {isSidebarOpen && <MdChevronRight className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />}
                </button>
                {isOpen && isSidebarOpen && (
                    <ul className="pl-6 pt-1">
                        {item.list.map((child) => (
                            <li key={child.title}>
                                <Link
                                    to={child.path}
                                    className={`flex p-2 my-1 text-sm rounded-md gap-3 items-center transition-colors ${
                                        location.pathname === child.path
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-500 hover:bg-gray-200"
                                    }`}
                                >
                                    {child.icon}
                                    <span>{child.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    } else {
        return (
            <li>
                <Link
                    to={item.path}
                    className={`flex p-3 my-1 rounded-md gap-3 items-center transition-colors ${
                        location.pathname === item.path
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    {item.icon}
                    {isSidebarOpen && <span className="font-medium text-sm">{item.title}</span>}
                </Link>
            </li>
        );
    }
};


// FIX APPLIED TO THE MAIN SIDEBAR COMPONENT
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const { companies } = useCompanyHook();

    return (
        <>
            {/* Mobile Overlay: Appears when the sidebar is open on mobile */}
            <div
                onClick={toggleSidebar}
                className={`fixed inset-0 bg-black/50 z-20 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            ></div>

            {/* Sidebar Container */}
            <div
                className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-all duration-300 flex flex-col
                    ${isSidebarOpen
                        ? 'w-64 translate-x-0' // Is OPEN on mobile and desktop
                        : 'w-64 -translate-x-full md:w-20 md:translate-x-0' // Is CLOSED
                    }`
                }
            >
                {/* Logo */}
                <div className="flex items-center justify-center p-8 border-b h-[65px] flex-shrink-0 my-5">
                    <img src={companies[0]?.logo} alt="Logo" className={`transition-all duration-300 ${isSidebarOpen ? 'w-24' : 'w-10'}`} />
                </div>

                {/* Menu */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <ul>
                        {menuItems().map((item) => (
                            <AccordionItem key={item.title} item={item} isSidebarOpen={isSidebarOpen} />
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;