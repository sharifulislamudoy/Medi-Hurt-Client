import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  RouterProvider
} from "react-router";
import './index.css'
import { router } from './Router/Routes';
import AuthProvider from './Provider/AuthProvider';
import { CartProvider } from './Provider/CartProvider';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
