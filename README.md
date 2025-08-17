# MediMart Client

## Overview

MediMart is a modern e-commerce web application designed for purchasing medicines and healthcare products online. It offers a smooth and secure experience for customers to browse medicines, manage their carts, place orders, and receive invoices. The platform includes tailored dashboards for customers, sellers, and administrators, enabling efficient management of orders, inventory, and sales.

The application emphasizes **performance, accessibility, and responsive design**, ensuring a consistent experience across desktops, tablets, and mobile devices.

---

## Technologies Used

MediMart leverages a modern tech stack for scalability, maintainability, and a rich user interface:

- **React.js** for building the user interface  
- **React Router** for navigation and routing  
- **Tailwind CSS** and **DaisyUI** for fast styling and components  
- **Framer Motion** for engaging animations  
- **React Icons** for vector-based icons  
- **Axios** for API requests  
- **Express.js** for backend APIs  
- **MongoDB** for database storage  
- **Firebase** for authentication and hosting  

---

## Table of Contents

- [Features](#features)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Configuration](#configuration)  
- [Live-Link](https://medi-hurt.web.app/)  

---

## Features

- Secure user authentication (signup, login, logout)  
- Browse medicines by category, brand, and generic name  
- Shopping cart and checkout process  
- Downloadable order invoice after checkout  
- Seller dashboard for managing products and inventory  
- Admin dashboard for managing users, orders, and reports  
- Advertisement slider for promoted products  
- Sales analytics and reporting  
- Fully responsive design  

---

## Installation

1. Clone the **client repository**:
   ```bash
   git clone https://github.com/sharifulislamudoy/MediMart-Client
   cd MediMart-Client

2. Clone the repository (server side):
   ```bash
   git clone https://github.com/sharifulislamudoy/MediMart-Server
   cd Rentizo-Server

3. Install dependencies and run
   ```bash
   npm install
   npm run dev
   nodemon index.js

## Usage

After setting up and running the development server locally (`npm start` or `yarn start`), you can use the MediMart client as follows:

1. **Browse Medicines**  
   - On the homepage, view featured and available medicines.  
   - Use search and filter options to find products by category, brand, or generic name.  

2. **User Authentication**  
   - Register a new account or log in using your credentials.  
   - Use social login options if enabled (Google, Facebook, GitHub).  

3. **Add to Cart & Checkout**  
   - Select medicines you want to purchase.  
   - Add them to your cart and proceed to checkout.  
   - Confirm your order and receive a downloadable invoice.  

4. **Manage Orders**  
   - View your active and past orders in your user dashboard.  
   - Cancel or track orders (if applicable).  

5. **Seller Dashboard (if applicable)**  
   - Add and manage your listed products.  
   - Track inventory, orders, and sales.  

6. **Admin Dashboard (if applicable)**  
   - Manage users, sellers, and products.  
   - Access analytics and sales reports.  
   - Approve or remove listed medicines if required.  


## Configuration

To properly run the Medi Hurt client, you need to configure environment variables and API endpoints.


### Environment Variables

Create a `.env.local` file in the root of the project and add the following variables:

   ```env.local
VITE_FIREBASE_API_KEY=AIzaSyCdvR4fGPxJflpVMeFP7acvb7eKqsw4hmQ
VITE_FIREBASE_AUTH_DOMAIN=medi-hurt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medi-hurt
VITE_FIREBASE_STORAGE_BUCKET=medi-hurt.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=240385503530
VITE_FIREBASE_APP_ID=1:240385503530:web:85dcf71adba4606ccd6e53

