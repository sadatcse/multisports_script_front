import React from 'react';
import {
  MdHome,
  MdAddShoppingCart,
  MdTableView,
  MdGroup,
} from "react-icons/md";

const menuItems = () => {
  return [
    {
      title: "Search",
      path: "/dashboard/search",
      icon: <MdHome className="text-lg" />, // Home is okay for Search
    },
        {
      title: "Categorie",
      path: "/dashboard/categorie",
      icon: <MdAddShoppingCart className="text-lg" />, // Cart icon for adding products
    },
    {
      title: "Add Product",
      path: "/dashboard/add",
      icon: <MdAddShoppingCart className="text-lg" />, // Cart icon for adding products
    },
    {
      title: "View Product",
      path: "/dashboard/view",
      icon: <MdTableView className="text-lg" />, // Table view for viewing list
    },
    {
      title: "Staff",
      path: "/dashboard/users",
      icon: <MdGroup className="text-lg" />, // People icon for staff
    },
  ];
};

export default menuItems;
