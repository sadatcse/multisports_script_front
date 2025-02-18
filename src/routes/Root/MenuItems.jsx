import {
    MdHome,
    MdShoppingCart,
    MdPending,
    MdUpdate,
    MdReport,
    MdAnalytics,
    MdCategory,
    MdSettings,
    MdPerson,
    MdAddShoppingCart,
    MdCountertops,
    MdAccountBalance,
    MdAttachMoney,
    MdHistory,
    MdTableView,
    MdContacts,
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
        title: "Finished Order",
        path: "/dashboard/update-orders-history",
        icon: <MdUpdate className="text-lg" />,
      },
      {
        title: "Order History",
        path: "/dashboard/order-orders",
        icon: <MdHistory className="text-lg" />,
      },
      {
        title: "Customer Manager",
        path: "/dashboard/customer",
        icon: <MdContacts className="text-lg" />,
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
            title: "Product Sales Report",
            path: "/dashboard/product-sales-report",
            icon: <MdAttachMoney className="text-lg" />,
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
            title: "Table management",
            path: "/dashboard/table",
            icon: <MdTableView className="text-lg" />,
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
  