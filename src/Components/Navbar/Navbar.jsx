import React from 'react';
import { Link, NavLink } from 'react-router';
import './Navbar.css';

const Navbar = () => {
    const navLinks = <>
        <li className='px-4'><NavLink to='/' className='px-3 py-1 text-white'>Home</NavLink></li>
        <li className='px-4'><NavLink to='/Shop' className='px-3 py-0 text-white'>Shop</NavLink></li>
        <li className='px-4'><NavLink to='/Language' className='px-3 py-0 text-white'>Languages</NavLink></li>
    </>;

    return (
        <>
            {/* Navbar */}
            <div className="flex flex-col px-2 py-1 w-11/12 mx-auto rounded-lg border-b-1 shadow-sm bg-[#31718f] mt-3 sticky top-0 inset-0 z-50">
                <div className='flex'>
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden hover:border-blue-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-white rounded-xl z-1 mt-3 w-52 p-2 shadow space-y-3">
                                {navLinks}
                            </ul>
                        </div>
                        <a href="#" className='flex items-center gap-3'>
                            <img src="https://i.ibb.co/Gfv2MGCw/Logo.png" className='h-8' alt="Logo" />
                            <div>
                                <h2 className='font-bold h-full text-2xl flex'>
                                    <p className='text-white'>MediHurt</p>
                                    <span className='text-[#1db184]'>.</span>
                                </h2>
                            </div>
                        </a>
                    </div>
                    <div className="navbar-center hidden lg:flex rounded-full">
                        <ul className="flex px-7">
                            {navLinks}
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <div className="flex-none">
                            <button className="btn border-teal-700 text-white bg-teal-600 rounded-2xl px-5 py-0 hover:bg-teal-700">
                                <Link to='/auth/signup'>Join Us</Link>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-2">
                    <div className="flex items-center gap-3">
                        {/* Search bar */}
                        <label className="flex-grow flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input type="search" required placeholder="Search Your Medicine" className="w-full outline-none" />
                        </label>

                        {/* Track Order Button
                        <button className="px-4 py-2 text-white bg-[#1db184] rounded-xl hover:bg-[#189b71]">
                            <Link to="/track-order">Track Order</Link>
                        </button> */}
                    </div>
                </div>

            </div>

            {/* Search Bar - moved below navbar */}

        </>
    );
};

export default Navbar;
