import {
  createBrowserRouter
} from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import SignupForm from "../Layouts/AuthenticationLayout";
import AuthenticationLayout from "../Layouts/AuthenticationLayout";
import Signup from "../Pages/Signup";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children:[
        {
            index:true,
            Component: Home,
        },
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