import { createBrowserRouter, Navigate } from "react-router-dom";

import Error404 from "../pages/Error404/Error";
import Login from "../pages/Login/Login";
import Root from "./Root/Root";
import DRoot from "./Root/DRoot";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import CollectOrder from "../pages/OtherPage/collect-order";
import PendingOrders from "../pages/OtherPage/pending-orders";
import UpdateOrdersHistory from "../pages/OtherPage/update-orders-history";
import SalesReportsDaily from "../pages/OtherPage/sales-reports-daily";
import DeliveryTimeReport from "../pages/OtherPage/delivery-time-report";
import MaterialsUsedReport from "../pages/OtherPage/materials-used-report";
import FundReportDaily from "../pages/OtherPage/fund-report-daily";
import ProductSalesReport from "../pages/OtherPage/product-sales-report";
import SalesReportsWithAddons from "../pages/OtherPage/sales-reports-with-addons";
import SalesReportDetails from "../pages/OtherPage/sales-report-details";
import CounterReportDaily from "../pages/OtherPage/counter-report-daily";
import UserAccess from "../pages/OtherPage/user-access";
import Category from "../pages/OtherPage/category";
import Product from "../pages/OtherPage/product";
import AddOns from "../pages/OtherPage/add-ons";
import Counter from "../pages/OtherPage/counter";
import VatBin from "../pages/OtherPage/vat-bin";
import SystemSettings from "../pages/OtherPage/system-settings";
import Users from "../pages/OtherPage/users";
import PrintPreview from "../pages/OtherPage/PrintPreview";
import OrderHistory from "../pages/OtherPage/orderhistory";
import PrivateRoot from "./Root/PrivateRoot";
import TableManagement from "../pages/OtherPage/table";
import Customer from "../pages/OtherPage/Customer";

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
    ],
  },
  {
    path: "dashboard",
    element: <DRoot />,
    errorElement: <Error404 />,
    children: [
      {
        path: "",
        element: (
          <PrivateRoot>
            <Navigate to="home" replace />
          </PrivateRoot>
        ),
      },
      {
        path: "home",
        element: (
          <PrivateRoot>
            <DashboardHome />
          </PrivateRoot>
        ),
      },
      {
        path: "collect-order",
        element: (
          <PrivateRoot>
            <CollectOrder />
          </PrivateRoot>
        ),
      },
      {
        path: "pending-orders",
        element: (
          <PrivateRoot>
            <PendingOrders />
          </PrivateRoot>
        ),
      },
      {
        path: "update-orders-history",
        element: (
          <PrivateRoot>
            <UpdateOrdersHistory />
          </PrivateRoot>
        ),
      },
      {
        path: "sales-reports-daily",
        element: (
          <PrivateRoot>
            <SalesReportsDaily />
          </PrivateRoot>
        ),
      },
      {
        path: "delivery-time-report",
        element: (
          <PrivateRoot>
            <DeliveryTimeReport />
          </PrivateRoot>
        ),
      },
      {
        path: "materials-used-report",
        element: (
          <PrivateRoot>
            <MaterialsUsedReport />
          </PrivateRoot>
        ),
      },
      {
        path: "fund-report-daily",
        element: (
          <PrivateRoot>
            <FundReportDaily />
          </PrivateRoot>
        ),
      },
      {
        path: "product-sales-report",
        element: (
          <PrivateRoot>
            <ProductSalesReport />
          </PrivateRoot>
        ),
      },
      {
        path: "sales-reports-with-addons",
        element: (
          <PrivateRoot>
            <SalesReportsWithAddons />
          </PrivateRoot>
        ),
      },
      {
        path: "sales-report-details",
        element: (
          <PrivateRoot>
            <SalesReportDetails />
          </PrivateRoot>
        ),
      },
      {
        path: "counter-report-daily",
        element: (
          <PrivateRoot>
            <CounterReportDaily />
          </PrivateRoot>
        ),
      },
      {
        path: "user-access",
        element: (
          <PrivateRoot>
            <UserAccess />
          </PrivateRoot>
        ),
      },
      {
        path: "category",
        element: (
          <PrivateRoot>
            <Category />
          </PrivateRoot>
        ),
      },
      {
        path: "product",
        element: (
          <PrivateRoot>
            <Product />
          </PrivateRoot>
        ),
      },
      {
        path: "add-ons",
        element: (
          <PrivateRoot>
            <AddOns />
          </PrivateRoot>
        ),
      },
      {
        path: "counter",
        element: (
          <PrivateRoot>
            <Counter />
          </PrivateRoot>
        ),
      },
      {
        path: "vat-bin",
        element: (
          <PrivateRoot>
            <VatBin />
          </PrivateRoot>
        ),
      },
      {
        path: "customer",
        element: (
          <PrivateRoot>
            <Customer />
          </PrivateRoot>
        ),
      },
      {
        path: "table",
        element: (
          <PrivateRoot>
            <TableManagement />
          </PrivateRoot>
        ),
      },
      {
        path: "system-settings",
        element: (
          <PrivateRoot>
            <SystemSettings />
          </PrivateRoot>
        ),
      },
      {
        path: "users",
        element: (
          <PrivateRoot>
            <Users />
          </PrivateRoot>
        ),
      },
      {
        path: "print-preview",
        element: (
          <PrivateRoot>
            <PrintPreview />
          </PrivateRoot>
        ),
      },
      {
        path: "order-orders",
        element: (
          <PrivateRoot>
            <OrderHistory />
          </PrivateRoot>
        ),
      },
    ],
  },
]);
