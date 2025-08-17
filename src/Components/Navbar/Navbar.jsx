import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { FaShoppingCart, FaFacebook, FaTwitter, FaInstagram, FaBars, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useCart } from '../../Provider/CartProvider';
import './Navbar.css';
import useAuth from '../Hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItemCount, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allMedicines, setAllMedicines] = useState([]);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Hamburger menu open state
    const [menuOpen, setMenuOpen] = useState(false);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) =>
        date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });

    // Fetch user role if user logged in
    useEffect(() => {
        if (!user?.email) return;
        fetch("https://medi-hurt-server.vercel.app/users")
            .then((res) => res.json())
            .then((data) => {
                const foundUser = data.find(u => u.email === user.email);
                if (foundUser) setUserRole(foundUser.role);
            })
            .catch(err => console.error(err));
    }, [user?.email]);

    // Fetch all medicines for suggestions
    useEffect(() => {
        fetch("https://medi-hurt-server.vercel.app/medicines-data")
            .then(res => res.json())
            .then(data => setAllMedicines(data));
    }, []);

    // Update suggestions based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") return setSuggestions([]);
        const filtered = allMedicines
            .filter(m =>
                m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.brand.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5);
        setSuggestions(filtered);
    }, [searchTerm, allMedicines]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
            setShowSuggestions(false);
            setMenuOpen(false); // close menu on search if mobile
        }
    };

    const handleSuggestionClick = (medicineName) => {
        setSearchTerm(medicineName);
        navigate(`/shop?search=${encodeURIComponent(medicineName)}`);
        setShowSuggestions(false);
        setMenuOpen(false); // close menu on suggestion click if mobile
    };

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
                setMenuOpen(false); // close menu on logout
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

    // NavLinks JSX reused in desktop and mobile menu
    const navLinks = (
        <>
            <li className='px-4'><NavLink to='/' className='px-3 py-1 text-white font-bold' onClick={() => setMenuOpen(false)}>Home</NavLink></li>
            <li className='px-4'><NavLink to='/Shop' className='px-3 py-0 text-white font-bold' onClick={() => setMenuOpen(false)}>Shop</NavLink></li>
            <li className='px-4'><NavLink to='/about' className='px-3 py-0 text-white font-bold' onClick={() => setMenuOpen(false)}>About Us</NavLink></li>
            <li className='px-4'><NavLink to='/contact' className='px-3 py-0 text-white font-bold' onClick={() => setMenuOpen(false)}>Contact Us</NavLink></li>
            <li className='px-4'><NavLink to='/faq' className='px-3 py-0 text-white font-bold' onClick={() => setMenuOpen(false)}>FAQ</NavLink></li>
        </>
    );

    return (
        <div className='w-full sticky top-0 z-2000 bg-[#31718f] shadow-lg'>
            <div className="w-11/12 mx-auto ">
                {/* Top Row: social | search | clock + seller */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
                    {/* Social Links */}
                    <div className="md:flex gap-3 hidden text-white">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook size={20} /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter size={20} /></a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram size={20} /></a>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-grow max-w-xl mx-4 relative">
                        <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm relative">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input
                                type="search"
                                placeholder="Search Your Medicine"
                                className="w-full outline-none"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    {suggestions.map((medicine) => (
                                        <div
                                            key={medicine._id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                                            onClick={() => handleSuggestionClick(medicine.name)}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            <img
                                                src={medicine.image}
                                                alt={medicine.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{medicine.name}</p>
                                                <p className="text-xs text-gray-600">{medicine.brand}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </label>
                    </form>

                    {/* Time + Seller */}
                    <div className="flex items-center gap-3">
                        <div className="text-white font-mono font-bold text-sm hidden md:flex bg-teal-600 px-3 py-1 rounded-lg shadow">
                            {formatTime(currentTime)}
                        </div>
                        {/* <Link
                            to="/become-seller"
                            className="btn border-teal-700 text-white bg-teal-600 rounded-2xl px-4 py-0 hover:bg-teal-700"
                        >
                            Become a Seller
                        </Link> */}
                    </div>
                </div>

                {/* Bottom Row: logo | nav links | cart + user */}
                <div className="flex items-center justify-between px-2 py-1">
                    <div className="navbar-start flex items-center gap-3">
                        {/* Hamburger button (small screens) */}
                        <button
                            className="lg:hidden text-white ml-2 focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                        <a href="/" className='flex items-center gap-3'>
                            <img src="https://i.ibb.co/Gfv2MGCw/Logo.png" className='h-8' alt="Logo" />
                            <h2 className='font-bold text-2xl flex'>
                                <p className='text-white'>MediHurt</p>
                                <span className='text-[#1db184]'>.</span>
                            </h2>
                        </a>


                    </div>

                    {/* Nav links for desktop */}
                    <div className="navbar-center hidden lg:flex rounded-full">
                        <ul className="flex px-7">
                            {navLinks}
                        </ul>
                    </div>

                    <div className="navbar-end">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* Cart */}
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-ghost btn-circle border-2 border-teal-600 hover:border-teal-800 transition relative"
                                    >
                                        <FaShoppingCart className="h-5 w-5 text-black" />
                                        {cartItemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 badge rounded-full min-w-6 h-6 p-0 bg-teal-800 text-white border-none flex items-center justify-center">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </div>

                                    <div tabIndex={0} className="dropdown-content z-50 mt-3 w-80 md:w-96 rounded-xl shadow-2xl bg-white p-4 space-y-4 border border-gray-100">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <h3 className="font-bold text-lg">Your Cart</h3>
                                            <span className="text-sm text-gray-500">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</span>
                                        </div>

                                        {cartItems.length === 0 ? (
                                            <div className="text-center py-6 flex flex-col items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <p className="text-gray-600">Your cart is empty</p>
                                                <Link to="/shop" className="btn btn-outline btn-sm mt-4 rounded-lg border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white">
                                                    Browse Products
                                                </Link>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="max-h-60 md:max-h-72 overflow-y-auto pr-2 space-y-3">
                                                    {cartItems.map((item) => (
                                                        <div key={`${item._id}-${item.formulationType}`} className="flex items-center gap-2 border-b pb-2 last:border-0">
                                                            <div className="relative">
                                                                <img
                                                                    src={item.image || '/default-medicine.png'}
                                                                    alt={item.name}
                                                                    className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-lg bg-gray-100 p-1"
                                                                    onError={(e) => { e.target.src = '/default-medicine.png'; }}
                                                                />
                                                                {item.quantity > 1 && (
                                                                    <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                                        {item.quantity}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-sm md:text-base truncate">{item.name}</h4>
                                                                <p className="text-xs text-gray-600 truncate">{item.formulationType}</p>
                                                                <p className="text-sm font-semibold text-teal-800">
                                                                    ৳{item.formulations.tablet}

                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, item.formulationType, item.quantity - 1); }}
                                                                    className="btn btn-xs btn-circle btn-outline border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, item.formulationType, item.quantity + 1); }}
                                                                    className="btn btn-xs btn-circle btn-outline border-gray-300 hover:bg-gray-100"
                                                                >
                                                                    +
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); removeFromCart(item._id, item.formulationType); }}
                                                                    className="btn btn-xs btn-ghost text-red-500 hover:bg-red-50"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="border-t pt-3 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold">Subtotal:</span>
                                                        <span className="font-bold text-lg text-teal-800">৳{cartTotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link to="/cart" className="btn btn-outline flex-1 border-teal-600 rounded-lg text-teal-600 hover:bg-teal-600 hover:text-white text-sm md:text-base">
                                                            View Cart
                                                        </Link>
                                                        <Link to="/checkout" className="btn btn-primary flex-1 bg-teal-600 rounded-lg text-white border-teal-600 hover:bg-teal-700 hover:border-teal-700 text-sm md:text-base">
                                                            Checkout
                                                        </Link>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Avatar */}
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle border-2 border-teal-600 avatar">
                                        <div className="w-10 rounded-full ring ring-teal-500 ring-offset-base-100 ring-offset-2">
                                            <img
                                                alt="User Avatar"
                                                src={user.photoURL || "https://i.ibb.co/gZXtW6vz/610-6104451-image-placeholder-png-user-profile-placeholder-image-png.jpg"}
                                            />
                                        </div>
                                    </div>
                                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-50 w-52 bg-white rounded-xl p-2 shadow-lg">
                                        {userRole && (
                                            <li>
                                                <Link to={`/${userRole}/dashboard`} className="rounded-lg hover:bg-teal-100 transition text-black font-medium text-lg" onClick={() => setMenuOpen(false)}>
                                                    Dashboard
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <Link to={'/profile-update'} className="rounded-lg hover:bg-teal-100 transition text-black font-medium text-lg" onClick={() => setMenuOpen(false)}>
                                                Update Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={handleLogout} className="rounded-lg hover:bg-red-100 transition text-red-600 font-medium text-lg">
                                                Logout
                                            </button>
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

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="lg:hidden bg-[#31718f] rounded-b-lg shadow-inner mt-0 p-4">
                        <ul className="flex flex-col gap-3">
                            {navLinks}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
