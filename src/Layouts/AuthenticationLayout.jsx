// AuthenticationLayout.jsx

import React from "react";
import { Outlet } from "react-router";
import Image from '../assets/Logo3.jpg'
// import { Player } from "@lottiefiles/react-lottie-player";
// import animationData from "../assets/delivery.json";

const AuthenticationLayout = () => {
    return (
        <div>
            <div className="min-h-screen flex items-center flex-col justify-center bg-white w-11/12 mx-auto my-3  rounded-lg">
                {/* Logo at the top-left */}
                <div className="w-full px-2 py-2 bg-[#31718f] rounded-lg sticky top-0 inset-0 z-50">
                    <a href="/" className='flex items-center gap-3'>
                        <img src="https://i.ibb.co/Gfv2MGCw/Logo.png" className='h-8' alt="Logo" />
                        <div>
                            <h2 className='font-bold h-full text-2xl flex'>
                                <p className='text-white'>MediHurt</p>
                                <span className='text-[#1db184]'>.</span>
                            </h2>
                        </div>
                    </a>
                </div>
                <div className="shadow-2xl overflow-hidden w-full grid grid-cols-1 md:grid-cols-2 mt-2 rounded-md">
                    {/* Left: Authentication Form + Logo */}
                    <div className="flex flex-col">
                        {/* Auth content (Signup/Login forms) */}
                        <div className="flex-grow">
                            <Outlet />
                        </div>
                    </div>

                    {/* Right: Lottie Animation */}
                    <div className="hidden md:flex object-center object-cover">
                        <img src={Image} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthenticationLayout;
