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
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import CoverageArea from "../Pages/CoverageArea";
import FAQ from "../Pages/FAQ";
import ProtectedRoute from "../Provider/ProtectedRoutes";
import Unauthorized from "../Pages/Unauthorized";
import UpdateProfile from "../Components/UpdateProfile/UpdateProfile";
import ErrorElement from "../Pages/ErrorElement";
import BecomeSeller from "../Pages/BecomeSeller";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <ErrorElement />,
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
          element: <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        },
        {
          path: '/invoice',
          element: <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        },
        {
          path: '/profile-update',
          element: <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        },
        {
          path: '/about',
          Component: About,
        },
        {
          path: '/contact',
          Component: Contact
        },
        {
          path: '/coverage-area',
          Component: CoverageArea,
        },
        {
          path: '/faq',
          Component: FAQ,
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
    element: <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  },
  {
    path :'/seller/dashboard',
    element: <ProtectedRoute allowedRoles={['seller']}>
      <SellerDashboard />
    </ProtectedRoute>
  },
  {
    path: '/user/dashboard',
    element: <ProtectedRoute allowedRoles={['user']}>
      <UserDashboard />
    </ProtectedRoute>
  },
  {
    path: '/unauthorized',
    Component: Unauthorized
  },
  {
    path:'/become-seller',
    Component: BecomeSeller,
  }
]);