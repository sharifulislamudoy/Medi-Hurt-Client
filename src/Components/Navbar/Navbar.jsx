import React from 'react';
import Icon from '../../assets/gmo.png'
import { NavLink } from 'react-router';
import './Navbar.css'

const Navbar = () => {
    const navLinks = <>
        <li className='px-4'><NavLink to={'/'} className={'px-3 py-1'}>Home</NavLink></li>
        <li className='px-4'><NavLink to={'/Shop'} className={'px-3 py-0'}>Shop</NavLink></li>
        <li className='px-4'><NavLink to={'/Language'} className={'px-3 py-0'}>Languages</NavLink></li>
    </>
    return (
        <div className="flex px-2 py-1 w-11/12 mx-auto rounded-2xl border-b-1 shadow-sm bg-blue-50 mt-3">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden hover:border-blue-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {navLinks}
                    </ul>
                </div>
                <a href='#' className='flex items-center gap-3'>
                    <img src={Icon} className='h-8' alt="" />
                    <div>
                        <h2 className='font-bold h-full text-2xl flex'><p>MediHurt</p> <span className='text-blue-400'>.</span></h2>
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
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost hover:bg-blue-100 hover:border-blue-200  btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
                                <span className="badge badge-sm indicator-item">8</span>
                            </div>
                        </div>
                        <div
                            tabIndex={0}
                            className="card card-compact dropdown-content z-1 mt-3 w-52 shadow">
                            <div className="card-body">
                                <span className="text-lg font-bold">8 Items</span>
                                <span className="text-info">Subtotal: $999</span>
                                <div className="card-actions">
                                    <button className="btn btn-primary btn-block">View cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Profile Picture"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content rounded-box z-10 mt-3 w-52 p-2 shadow"
                        >
                            <li><a>Update Profile</a></li>
                            <li><a>Dashboard</a></li>
                            <li><button className="btn btn-sm btn-error bg-red-600 text-white w-full">Logout</button></li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Navbar;