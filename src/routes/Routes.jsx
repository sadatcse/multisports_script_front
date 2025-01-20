import { createBrowserRouter, Navigate } from "react-router-dom";

import Error404 from '../pages/Error404/Error';
import Login from '../pages/Login/Login';
import Root from "./Root/Root";
import DRoot from "./Root/DRoot";
import DashboardHome from '../pages/Dashboard/DashboardHome';
import CollectOrder from '../pages/OtherPage/collect-order';
import PendingOrders from '../pages/OtherPage/pending-orders';
import UpdateOrdersHistory from '../pages/OtherPage/update-orders-history';
import SalesReportsDaily from '../pages/OtherPage/sales-reports-daily';
import DeliveryTimeReport from '../pages/OtherPage/delivery-time-report';
import MaterialsUsedReport from '../pages/OtherPage/materials-used-report';
import FundReportDaily from '../pages/OtherPage/fund-report-daily';
import ProductSalesReport from '../pages/OtherPage/product-sales-report';
import SalesReportsWithAddons from '../pages/OtherPage/sales-reports-with-addons';
import SalesReportDetails from '../pages/OtherPage/sales-report-details';
import CounterReportDaily from '../pages/OtherPage/counter-report-daily';
import UserAccess from '../pages/OtherPage/user-access';
import Category from '../pages/OtherPage/category';
import Product from '../pages/OtherPage/product';
import AddOns from '../pages/OtherPage/add-ons';
import Counter from '../pages/OtherPage/counter';
import VatBin from '../pages/OtherPage/vat-bin';
import SystemSettings from '../pages/OtherPage/system-settings';
import Users from '../pages/OtherPage/users';
import PrintPreview from "../pages/OtherPage/PrintPreview";
import Order_history from "../pages/OtherPage/orderhistory";

export const router = createBrowserRouter([

  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ]
  },
  {
    path: "dashboard",
    element: <DRoot />,
    errorElement: <Error404 />,
    children: [
      {
        path: "",
        element: <Navigate to="home" replace />, // Redirects to the home route
      },
      {
        path: "home",
        element: <DashboardHome />,
      },
      {
        path: "collect-order",
        element: <CollectOrder />,
      },
      {
        path: "pending-orders",
        element: <PendingOrders />,
      },
      {
        path: "update-orders-history",
        element: <UpdateOrdersHistory />,
      },
      {
        path: "sales-reports-daily",
        element: <SalesReportsDaily />,
      },
      {
        path: "delivery-time-report",
        element: <DeliveryTimeReport />,
      },
      {
        path: "materials-used-report",
        element: <MaterialsUsedReport />,
      },
      {
        path: "fund-report-daily",
        element: <FundReportDaily />,
      },
      {
        path: "product-sales-report",
        element: <ProductSalesReport />,
      },
      {
        path: "sales-reports-with-addons",
        element: <SalesReportsWithAddons />,
      },
      {
        path: "sales-report-details",
        element: <SalesReportDetails />,
      },
      {
        path: "counter-report-daily",
        element: <CounterReportDaily />,
      },
      {
        path: "user-access",
        element: <UserAccess />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "add-ons",
        element: <AddOns />,
      },
      {
        path: "counter",
        element: <Counter />,
      },
      {
        path: "vat-bin",
        element: <VatBin />,
      },
      {
        path: "system-settings",
        element: <SystemSettings />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "print-preview",
        element: <PrintPreview />,
      },
      {
        path: "order-orders",
        element: <Order_history/>,
      },
    ]
  },

]);
