import {
  createBrowserRouter
} from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import AuthenticationLayout from "../Layouts/AuthenticationLayout";
import Signup from "../Pages/Signup";
import ShopPage from "../Pages/Shop";
import CategoryDetails from "../Pages/CategoryDetails";
import Cart from "../Pages/Cart";
import Checkout from "../Pages/CheckOut";
import Invoice from "../Components/Checkout/Invoice";

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
        },
        {
          path: '/category/:categoryName',
          Component: CategoryDetails,
        },
        {
          path: '/cart',
          Component: Cart
        },
        {
          path: '/checkout',
          Component: Checkout,
        },
        {
          path: '/invoice',
          Component: Invoice
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