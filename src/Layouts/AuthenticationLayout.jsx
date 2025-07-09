// AuthenticationLayout.jsx

import React from "react";
import { Outlet } from "react-router";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/delivery.json";

const AuthenticationLayout = () => {
    return (
        <div>
            <div className="min-h-screen flex items-center flex-col justify-center bg-white w-11/12 mx-auto my-3 border-2 border-[#31718f] rounded-lg">
                {/* Logo at the top-left */}
                <div className="w-full px-6 py-4 bg-[#31718f]">
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
                <div className="shadow-xl overflow-hidden w-full grid grid-cols-1 md:grid-cols-2">
                    {/* Left: Authentication Form + Logo */}
                    <div className="flex flex-col">
                        {/* Auth content (Signup/Login forms) */}
                        <div className="flex-grow">
                            <Outlet />
                        </div>
                    </div>

                    {/* Right: Lottie Animation */}
                    <div className="hidden md:flex justify-center items-center bg-white">
                        <Player
                            autoplay
                            loop
                            src={animationData}
                            className="w-full h-full max-w-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthenticationLayout;
