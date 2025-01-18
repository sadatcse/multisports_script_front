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
        path: "/dashboard/collect-order",
        icon: <MdShoppingCart className="text-lg" />,
      },
      {
        title: "Pending Orders",
        path: "/dashboard/pending-orders",
        icon: <MdPending className="text-lg" />,
      },
      {
        title: "Update Orders History",
        path: "/dashboard/update-orders-history",
        icon: <MdUpdate className="text-lg" />,
      },
      {
        title: "Reports",
        icon: <MdReport className="text-lg" />,
        list: [
          {
            title: "Sales Reports (Daily)",
            path: "/dashboard/sales-reports-daily",
            icon: <MdAnalytics className="text-lg" />,
          },
          {
            title: "Delivery Time Report",
            path: "/dashboard/delivery-time-report",
            icon: <MdAccessTime className="text-lg" />,
          },
          {
            title: "Materials Used Report",
            path: "/dashboard/materials-used-report",
            icon: <MdAnalytics className="text-lg" />,
          },
          {
            title: "Fund Report (Daily)",
            path: "/dashboard/fund-report-daily",
            icon: <MdAccountBalance className="text-lg" />,
          },
          {
            title: "Product Sales Report",
            path: "/dashboard/product-sales-report",
            icon: <MdAttachMoney className="text-lg" />,
          },
          {
            title: "Sales Reports (With Addons)",
            path: "/dashboard/sales-reports-with-addons",
            icon: <MdAnalytics className="text-lg" />,
          },
          {
            title: "Sales Report (Details)",
            path: "/dashboard/sales-report-details",
            icon: <MdAnalytics className="text-lg" />,
          },
          {
            title: "Counter Report (Daily)",
            path: "/dashboard/counter-report-daily",
            icon: <MdCountertops className="text-lg" />,
          },
          {
            title: "User Access",
            path: "/dashboard/user-access",
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
            path: "/dashboard/category",
            icon: <MdCategory className="text-lg" />,
          },
          {
            title: "Product",
            path: "/dashboard/product",
            icon: <MdAddShoppingCart className="text-lg" />,
          },
          {
            title: "Add-ons",
            path: "/dashboard/add-ons",
            icon: <MdAddShoppingCart className="text-lg" />,
          },
          {
            title: "Counter",
            path: "/dashboard/counter",
            icon: <MdCountertops className="text-lg" />,
          },
          {
            title: "VAT/BIN",
            path: "/dashboard/vat-bin",
            icon: <MdAccountBalance className="text-lg" />,
          },
          {
            title: "System Settings",
            path: "/dashboard/system-settings",
            icon: <MdSettings className="text-lg" />,
          },
        ],
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <MdPerson className="text-lg" />,
      },

    ];
  };
  
  export default menuItems;
  