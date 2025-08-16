import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaGithub, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../Components/Hooks/UseAuth';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router';
import { ReTitle } from 're-title';

const Login = () => {
    const navigate = useNavigate();
    const { loginWithGoogle, loginWithEmail } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        const { email, password } = data;

        try {
            await loginWithEmail(email, password);

            // 🔍 Fetch the user by email to get their role
            const res = await fetch(`http://localhost:3000/users/${email}`);
            const userData = await res.json();

            Swal.fire({
                title: 'Welcome Back!',
                text: 'You have successfully logged in.',
                icon: 'success',
                confirmButtonColor: '#1db184',
                confirmButtonText: 'Continue'
            }).then(() => {
                // 🔀 Navigate based on role
                if (userData.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (userData.role === 'seller') {
                    navigate('/seller/dashboard');
                } else {
                    navigate('/shop');
                }
            });

        } catch (error) {
            console.error("Login error:", error.message);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await loginWithGoogle();
            const email = result.user.email;

            // 🔍 Fetch user data after Google login
            const res = await fetch(`http://localhost:3000/users/${email}`);
            const userData = await res.json();

            Swal.fire({
                title: 'Success!',
                text: `Welcome back, ${result.user.displayName || 'User'}!`,
                icon: 'success',
                confirmButtonColor: '#1db184',
                confirmButtonText: 'Continue'
            }).then(() => {
                if (userData.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (userData.role === 'seller') {
                    navigate('/seller/dashboard');
                } else {
                    navigate('/shop');
                }
            });

        } catch (err) {
            console.error("Google sign-in error:", err.message);
            Swal.fire({
                title: 'Error!',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-600">
            <ReTitle title='Medi Hurt | Login' />
            <div className="w-full max-w-md p-8">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-white">Welcome Back</h2>

                {/* Main Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-white">Email</label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                })}
                                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                placeholder="••••••••"
                            />
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-bold text-teal-800 hover:text-teal-900">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-teal-800 text-white font-semibold py-2 rounded-md hover:bg-teal-900 transition duration-200 shadow-sm"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="text-center text-white mt-4">
                    Don't have an account?{" "}
                    <Link to="/auth/signup" className="text-teal-400 hover:underline">
                        Sign Up
                    </Link>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-teal-600 px-3 text-white">or continue with</span>
                    </div>
                </div>

                {/* Social Logins */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-blue-50 transition"
                    >
                        <FcGoogle className="text-lg" />
                        Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;