import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="bg-[#31718f] text-white pt-12 pb-6 px-4 md:px-8 relative">
            {/* Scroll to Top Button */}
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#1db184] hover:bg-teal-700 text-white flex items-center justify-center shadow-lg transition-all duration-300 animate-bounce"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp size={20} />
                </button>
            )}

            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img src="https://i.ibb.co/Gfv2MGCw/Logo.png" className='h-8' alt="Logo" />
                            <h2 className='font-bold text-2xl'>
                                <span className='text-white'>MediHurt</span>
                                <span className='text-[#1db184]'>.</span>
                            </h2>
                        </div>
                        <p className="text-gray-300">
                            Your trusted online pharmacy providing quality medicines and healthcare products at affordable prices.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://facebook.com" className="text-gray-300 hover:text-white transition">
                                <FaFacebook size={20} />
                            </a>
                            <a href="https://twitter.com" className="text-gray-300 hover:text-white transition">
                                <FaTwitter size={20} />
                            </a>
                            <a href="https://instagram.com" className="text-gray-300 hover:text-white transition">
                                <FaInstagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold border-b-2 border-[#1db184] pb-2 inline-block">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white transition hover:pl-2 block">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop" className="text-gray-300 hover:text-white transition hover:pl-2 block">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-white transition hover:pl-2 block">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-white transition hover:pl-2 block">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-300 hover:text-white transition hover:pl-2 block">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold border-b-2 border-[#1db184] pb-2 inline-block">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <FaPhoneAlt className="mt-1 text-[#1db184]" />
                                <div>
                                    <p className="font-medium">Phone</p>
                                    <p className="text-gray-300">+1 234 567 890</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaEnvelope className="mt-1 text-[#1db184]" />
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-gray-300">info@medihurt.com</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-1 text-[#1db184]" />
                                <div>
                                    <p className="font-medium">Address</p>
                                    <p className="text-gray-300">123 Medical St, Health City, HC 12345</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold border-b-2 border-[#1db184] pb-2 inline-block">Newsletter</h3>
                        <p className="text-gray-300">
                            Subscribe to our newsletter for the latest updates and offers.
                        </p>
                        <form className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-grow px-4 border border-white text-white py-2 rounded-lg focus:outline-none focus:ring-teal-600"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-[#1db184] hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Subscribe
                            </button>
                        </form>
                        <p className="text-sm text-gray-400 mt-2">
                            We'll never share your email with anyone else.
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} MediHurt. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition">
                            Privacy Policy
                        </Link>
                        <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition">
                            Terms of Service
                        </Link>
                        <Link to="/refund-policy" className="text-gray-400 hover:text-white text-sm transition">
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;