import React from 'react';
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../Components/Hooks/UseAuth';
import Swal from 'sweetalert2';

const Signup = () => {
    const { loginWithGoogle } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    // Placeholder handlers (replace with actual Firebase logic)
    const handleGoogleSignup = async () => {
        try {
            const result = await loginWithGoogle();
            // console.log("Google user:", result.user);

            // Show SweetAlert success popup
            Swal.fire({
                title: 'Success!',
                text: `Welcome, ${result.user.displayName || 'User'}!`,
                icon: 'success',
                confirmButtonText: 'Continue'
            });

            // Optional: redirect after sign-in
            // navigate('/dashboard');

        } catch (err) {
            console.error("Google sign-in error:", err.message);

            // Optional: show error alert
            Swal.fire({
                title: 'Error!',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    const handleGithubSignup = () => {
        console.log("GitHub signup clicked");
        // implement GitHub sign-in logic here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#31718f] ">
            <div className="w-full shadow-md p-8">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-white">Create Your Account</h2>


                {/* Main Signup Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Username</label>
                        <input
                            {...register("username", { required: "Username is required" })}
                            className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                            placeholder="Your name"
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium  mb-1 text-white">Email</label>
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
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Select Role</label>
                        <select
                            {...register("role", { required: "Role is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                        >
                            <option value="">-- Select Role --</option>
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-white ">Upload Your Photo</label>
                        <fieldset className="border  border-teal-700">
                            <input
                                type="file"
                                accept="image/*"
                                {...register("photo", { required: "Photo is required" })}
                                className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 bg-white rounded-md"
                            />

                            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>}
                        </fieldset>
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white font-semibold py-2 rounded-md hover:bg-teal-700 transition duration-200 shadow-sm"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="text-center text-white mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-teal-400 hover:underline">
                        Login
                    </a>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-[#31718f] px-3 text-white">or continue with email</span>
                    </div>
                </div>

                {/* Social Sign ups */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-blue-50 transition"
                    >
                        <FcGoogle className="text-lg" />
                        Sign Up with Google
                    </button>
                    <button
                        onClick={handleGithubSignup}
                        className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition"
                    >
                        <FaGithub className="text-lg" />
                        Sign Up with GitHub
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Signup;
