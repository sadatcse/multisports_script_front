import {
    MdHome,
    MdShoppingCart,
    MdPending,
    MdUpdate,
    MdReport,
    MdAnalytics,
    MdAccessTime,
    MdCategory,
    MdSettings,
    MdExitToApp,
    MdPerson,
    MdAddShoppingCart,
    MdCountertops,
    MdAccountBalance,
    MdAttachMoney,
  } from "react-icons/md";
  
  const menuItems = () => {
    return [
      {
        title: "Home",
        path: "/dashboard/home",
        icon: <MdHome className="text-lg" />,
      },
      {
        title: "Collect Order",
        path: "/collect-order",
        icon: <MdShoppingCart className="text-lg" />,
      },
      {
        title: "Pending Orders",
        path: "/pending-orders",
        icon: <MdPending className="text-lg" />,
      },
      {
        title: "Update Orders History",
        path: "/update-orders-history",
        icon: <MdUpdate className="text-lg" />,
      },
      {
        title: "Reports",
        icon: <MdReport className="text-lg" />,
        list: [
          {
            title: "Sales Reports (Daily)",
            path: "/reports/sales-daily",
            icon: <MdAnalytics className="text-lg" />,
          },
          {
            title: "Delivery Time Report",
            path: "/reports/delivery-time",
            icon: <MdAccessTime className="text-lg" />,
          },
          {
            title: "Materials Used Report",
            path: "/reports/materials-used",
            icon: <MdAnalytics className="text-lg" />,
          },
          {
            title: "Fund Report (Daily)",
            path: "/reports/fund-daily",
            icon: <MdAccountBalance className="text-lg" />,
          },
          {
            title: "Product Sales Report",
            path: "/reports/product-sales",
            icon: <MdAttachMoney className="text-lg" />,
          },
          {
            title: "Sales Reports (With Addons)",
            path: "/reports/sales-addons",
            icon: <MdAnalytics className="text-lg" />,
          },
          {
            title: "Sales Report (Details)",
            path: "/reports/sales-details",
            icon: <MdAnalytics className="text-lg" />,
          },
          {
            title: "Counter Report (Daily)",
            path: "/reports/counter-daily",
            icon: <MdCountertops className="text-lg" />,
          },
          {
            title: "User Access",
            path: "/reports/user-access",
            icon: <MdPerson className="text-lg" />,
          },
        ],
      },
      {
        title: "Settings",
        icon: <MdSettings className="text-lg" />,
        list: [
          {
            title: "Category",
            path: "/settings/category",
            icon: <MdCategory className="text-lg" />,
          },
          {
            title: "Product",
            path: "/settings/product",
            icon: <MdAddShoppingCart className="text-lg" />,
          },
          {
            title: "Add-ons",
            path: "/settings/add-ons",
            icon: <MdAddShoppingCart className="text-lg" />,
          },
          {
            title: "Counter",
            path: "/settings/counter",
            icon: <MdCountertops className="text-lg" />,
          },
          {
            title: "VAT/BIN",
            path: "/settings/vat-bin",
            icon: <MdAccountBalance className="text-lg" />,
          },
          {
            title: "System Settings",
            path: "/settings/system",
            icon: <MdSettings className="text-lg" />,
          },
        ],
      },
      {
        title: "Users",
        path: "/users",
        icon: <MdPerson className="text-lg" />,
      },

    ];
  };
  
  export default menuItems;
  