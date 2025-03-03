

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
  
  const DMenuitems = () => {
    return [
      {
        title: "Home",
        path: "/dashboard/home",
        icon: <MdHome className="text-lg" />,
      },
    //   {
    //     title: "Reports",
    //     icon: <MdReport className="text-lg" />,
    //     list: [
    //       {
    //         title: "Sales Reports (Daily)",
    //         path: "/dashboard/sales-reports-daily",
    //         icon: <MdAnalytics className="text-lg" />,
    //       },

    //       {
    //         title: "Product Sales Report",
    //         path: "/dashboard/product-sales-report",
    //         icon: <MdAttachMoney className="text-lg" />,
    //       },
    //       {
    //         title: "Counter Report (Daily)",
    //         path: "/dashboard/counter-report-daily",
    //         icon: <MdCountertops className="text-lg" />,
    //       },
    //       {
    //         title: "User Access",
    //         path: "/dashboard/user-access",
    //         icon: <MdPerson className="text-lg" />,
    //       },
    //     ],
    //   },

    ];
  };
  
  export default DMenuitems;
  