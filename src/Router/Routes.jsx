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
import Admin from "../Layouts/Admin";
import AppWrapper from "../Components/AppWrapper/AppWrapper";
import Login from "../Pages/Login";
import AdminDashboard from "../Components/Dashboards/AdminDashboard";
import SellerDashboard from "../Components/Dashboards/SallerDashboard";
import UserDashboard from "../Components/Dashboards/UserDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children:[
        {
            index:true,
            element: <AppWrapper>
              <Home />
            </AppWrapper>
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
      },
      {
        path: 'login',
        Component: Login,
      }
    ]
  },
  {
    path: '/admin',
    Component: Admin,
  },
  {
    path: '/admin/dashboard',
    Component: AdminDashboard
  },
  {
    path :'/seller/dashboard',
    Component: SellerDashboard,
  },
  {
    path: '/user/dashboard',
    Component: UserDashboard,
  }
]);