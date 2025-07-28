import { createBrowserRouter, Navigate } from "react-router-dom";

import Error404 from "../pages/Error404/Error";
import Login from "../pages/Login/Login";
import Root from "./Root/Root";
import Users from "../pages/OtherPage/users";
import PrivateRoot from "./Root/PrivateRoot";
import Aroot from "./Root/Aroot";
import ViewProduct from './../pages/Product/ViewProduct';
import AddProduct from './../pages/Product/AddProduct';
import SearchProduct from '../pages/Product/SearchProduct';
import Categorie from "../pages/Product/Categorie";



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
    element: <Aroot />, 
    errorElement: <Error404 />,
    children: [
      {
        path: "",
        element: (
          <PrivateRoot>
            <Navigate to="search" replace />
          </PrivateRoot>
        ),
      },
      {
        path: "search",
        element: <PrivateRoot><SearchProduct /></PrivateRoot>,
      },
      {
        path: "categorie",
        element: <PrivateRoot><Categorie /></PrivateRoot>,
      },
      {
        path: "add",
        element: <PrivateRoot><AddProduct /></PrivateRoot>,
      },

      {
        path: "view",
        element: <PrivateRoot><ViewProduct /></PrivateRoot>,
      },
      {
        path: "users",
        element: <PrivateRoot><Users /></PrivateRoot>,
      },

    ],
  },
]);
