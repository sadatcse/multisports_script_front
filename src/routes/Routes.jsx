import { createBrowserRouter } from "react-router-dom";

import Error404 from '../pages/Error404/Error';
import Login from '../pages/Login/Login';
import Root from "./Root/Root";
import DRoot from "./Root/DRoot";
import DashboardHome from '../pages/Dashboard/DashboardHome';

export const router = createBrowserRouter([

  {
    path: "/",
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: "/",
        element: <Login />,
      },      
    ]
  },
  {
    path: "dashboard",
    element:<DRoot/>,
    errorElement: <Error404></Error404>,
    children: [
      {
        path:"home",
        element:<DashboardHome/>
      },

    ]

  },


]
);