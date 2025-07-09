import {
  createBrowserRouter
} from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import AuthenticationLayout from "../Layouts/AuthenticationLayout";
import Signup from "../Pages/Signup";
import ShopPage from "../Pages/Shop";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children:[
        {
            index:true,
            Component: Home,
        },
        {
          path: '/Shop',
          Component: ShopPage
        }
    ]
  },
  {
    path: '/auth',
    Component: AuthenticationLayout,
    children: [
      {
        path: 'signup',
        Component: Signup,
      }
    ]
  }
]);