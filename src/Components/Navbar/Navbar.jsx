import React from 'react';
import { Link, NavLink } from 'react-router';
import './Navbar.css';
import useAuth from '../Hooks/UseAuth';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { user, logout } = useAuth();
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to logout from your account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1db184',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await logout();
                Swal.fire({
                    title: 'Logged Out',
                    text: 'You have successfully logged out.',
                    icon: 'success',
                    confirmButtonColor: '#1db184'
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.message || 'Logout failed. Try again.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }
        }
    };


    const navLinks = (
        <>
            <li className='px-4'><NavLink to='/' className='px-3 py-1 text-white font-bold'>Home</NavLink></li>
            <li className='px-4'><NavLink to='/Shop' className='px-3 py-0 text-white font-bold'>Shop</NavLink></li>
            <li className='px-4'><NavLink to='/Language' className='px-3 py-0 text-white font-bold'>Languages</NavLink></li>
        </>
    );

    return (
        <>
            {/* Navbar */}
            <div className="flex flex-col px-2 py-1 w-11/12 mx-auto rounded-lg border-b-1 shadow-sm bg-[#31718f] mt-3 sticky top-0 inset-0 z-50">
                <div className='flex'>
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden hover:border-blue-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-[#31718f] rounded-xl z-1 mt-3 w-52 p-2 shadow space-y-3">
                                {navLinks}
                            </ul>
                        </div>
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
                    <div className="navbar-center hidden lg:flex rounded-full">
                        <ul className="flex px-7">
                            {navLinks}
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <div className="flex-none">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    {/* Cart Dropdown */}
                                    <div className="dropdown dropdown-end">
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            className="btn btn-ghost btn-circle border-2 border-teal-600 hover:border-teal-800 transition">
                                            <div className="indicator">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="badge badge-sm bg-red-500 text-white border-none indicator-item">8</span>
                                            </div>
                                        </div>
                                        <div
                                            tabIndex={0}
                                            className="dropdown-content z-50 mt-3 w-64 rounded-xl shadow-lg bg-white p-4 space-y-2">
                                            <div className="text-gray-800 font-semibold text-lg">8 Items</div>
                                            <div className="text-gray-500">Subtotal: <span className="text-teal-600 font-medium">$999</span></div>
                                            <button className="btn btn-primary btn-block mt-2">View Cart</button>
                                        </div>
                                    </div>

                                    {/* Avatar Dropdown */}
                                    <div className="dropdown dropdown-end">
                                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle border-2 border-teal-600 avatar">
                                            <div className="w-10 rounded-full ring ring-teal-500 ring-offset-base-100 ring-offset-2">
                                                <img
                                                    alt="User Avatar"
                                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                            </div>
                                        </div>
                                        <ul
                                            tabIndex={0}
                                            className="menu menu-sm dropdown-content mt-3 z-50 w-52 bg-white rounded-xl p-2 shadow-lg">
                                            <li>
                                                <a className="rounded-lg hover:bg-teal-100 transition text-black font-medium text-lg">Dashboard</a>
                                            </li>
                                            <li>
                                                <a className="rounded-lg hover:bg-teal-100 transition text-black font-medium text-lg">Settings</a>
                                            </li>
                                            <li>
                                                <button onClick={handleLogout}
                                                    className="rounded-lg hover:bg-red-100 transition text-red-600 font-medium text-lg">Logout</button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <button className="btn border-teal-700 text-white bg-teal-600 rounded-2xl px-5 py-0 hover:bg-teal-700">
                                    <Link to='/auth/signup'>Join Us</Link>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full mt-2">
                    <div className="flex items-center gap-3">
                        {/* Search bar */}
                        <label className="flex-grow flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm mb-3">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input type="search" required placeholder="Search Your Medicine" className="w-full outline-none" />
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
