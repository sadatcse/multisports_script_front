import {
  MdHome,
  MdShoppingCart,
  MdPendingActions,
  MdHistory,
  MdReport,
  MdAnalytics,
  MdSettings,
  MdPerson,
  MdAddShoppingCart,
  MdCountertops,
  MdAccountBalance,
  MdTableView,
  MdContacts,
  MdCategory,
  MdInventory, // A better icon for managing products
  MdSell, // A better icon for sales reports
  MdGroup, // A better icon for managing multiple users
  MdTableRestaurant, // A specific icon for tables
  MdDashboard, // Good for a layout/overview screen
  MdExtension, // Good for 'Add-ons'
  MdReceiptLong, // A great icon for order history/finished orders
} from "react-icons/md";

const menuItems = () => {
  return [
    {
      title: "Dashboard",
      path: "/dashboard/home",
      icon: <MdHome className="text-lg" />,
    },
    {
      // "POS" (Point of Sale) or "New Order" is a more standard term than "Collect Order"
      title: "POS / New Order",
      path: "/dashboard/pos",
      icon: <MdAddShoppingCart className="text-lg" />,
    },
    {
      title: "Pending Orders",
      path: "/dashboard/pending-orders",
      icon: <MdPendingActions className="text-lg" />,
    },
    {
      // Combined "Finished Order" and "Order History" for clarity
      title: "Order History",
      path: "/dashboard/order-history",
      icon: <MdHistory className="text-lg" />,
    },
    {
      title: "Customers", // Simpler and more direct
      path: "/dashboard/customers",
      icon: <MdContacts className="text-lg" />,
    },
    {
      title: "Tables",
      icon: <MdTableRestaurant className="text-lg" />, // More appropriate icon
      list: [
        {
          title: "Table View", // Clearer than "Current Table"
          path: "/dashboard/tables/view",
          icon: <MdDashboard className="text-lg" />,
        },
        {
          title: "Table Management",
          path: "/dashboard/tables/manage",
          icon: <MdTableView className="text-lg" />,
        },
      ],
    },
    {
      title: "Reports",
      icon: <MdReport className="text-lg" />,
      list: [
        {
          title: "Daily Sales",
          path: "/dashboard/reports/daily-sales",
          icon: <MdAnalytics className="text-lg" />,
        },
        {
          title: "Product Sales",
          path: "/dashboard/reports/product-sales",
          icon: <MdSell className="text-lg" />, // More specific than a money icon
        },
        {
          title: "Daily Counter Report",
          path: "/dashboard/reports/counter-daily",
          icon: <MdCountertops className="text-lg" />,
        },
        {
          title: "User Activity", // More descriptive for a report
          path: "/dashboard/reports/user-activity",
          icon: <MdPerson className="text-lg" />,
        },
      ],
    },
    {
      title: "Settings",
      icon: <MdSettings className="text-lg" />,
      list: [
        {
          title: "Categories",
          path: "/dashboard/settings/categories",
          icon: <MdCategory className="text-lg" />,
        },
        {
          title: "Products",
          path: "/dashboard/settings/products",
          // MdInventory is more suitable for managing a list of products
          icon: <MdInventory className="text-lg" />,
        },
        {
          title: "Add-ons",
          path: "/dashboard/settings/add-ons",
          icon: <MdExtension className="text-lg" />, // Perfect icon for add-ons
        },
        {
          title: "Counters",
          path: "/dashboard/settings/counters",
          icon: <MdCountertops className="text-lg" />,
        },
        {
          title: "Tax / VAT",
          path: "/dashboard/settings/tax",
          icon: <MdAccountBalance className="text-lg" />,
        },
        {
          title: "System Settings",
          path: "/dashboard/settings/system",
          icon: <MdSettings className="text-lg" />,
        },
      ],
    },
    {
      title: "Staff",
      path: "/dashboard/users",
      // MdGroup is better for managing multiple users
      icon: <MdGroup className="text-lg" />,
    },
  ];
};

export default menuItems;