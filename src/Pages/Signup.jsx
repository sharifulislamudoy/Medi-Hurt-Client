import React from 'react';
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../Components/Hooks/UseAuth';
import Swal from 'sweetalert2';
import { ReTitle } from 're-title';

const Signup = () => {
    const { loginWithGoogle, registerWithEmail } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { email, password, username, role, photo } = data;

        try {
            // Step 1: Create user in Firebase
            const userCredential = await registerWithEmail(email, password);
            const user = userCredential.user;

            // Step 2: Create user object for backend
            const newUser = {
                email,
                username,
                role,
                photoURL: photo[0]?.name || '', // Optional: store photo name (better to use uploaded URL)
                createdAt: new Date()
            };

            // Step 3: Send user data to backend
            const res = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            const result = await res.json();

            // Step 4: Show success alert
            if (result.insertedId) {
                Swal.fire({
                    title: 'Success!',
                    text: `Welcome, ${username}! Your account has been created.`,
                    icon: 'success',
                    confirmButtonColor: '#1db184',
                    confirmButtonText: 'Continue'
                });
            }

        } catch (error) {
            console.error("Signup error:", error.message);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };



    // Placeholder handlers (replace with actual Firebase logic)
    const handleGoogleSignup = async () => {
        try {
            const result = await loginWithGoogle();
            const user = result.user;

            // Construct new user object with default role = 'user'
            const newUser = {
                email: user.email,
                username: user.displayName || 'Unknown',
                role: 'user',
                photoURL: user.photoURL || '',
                createdAt: new Date()
            };

            // Send new user to backend
            const res = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            const resultData = await res.json();

            if (resultData.insertedId) {
                Swal.fire({
                    title: 'Success!',
                    text: `Welcome, ${user.displayName || 'User'}!`,
                    icon: 'success',
                    confirmButtonColor: '#1db184',
                    confirmButtonText: 'Continue'
                });
            }

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


    const handleGithubSignup = () => {
        console.log("GitHub signup clicked");
        // implement GitHub sign-in logic here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-600 ">
            <ReTitle title='Medi Hurt | Sign Up' />
            <div className="w-full max-w-md  p-8">
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
                                className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-teal-800 file:text-white hover:file:bg-teal-900 bg-white rounded-md"
                            />

                            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>}
                        </fieldset>
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-teal-800 text-white font-semibold py-2 rounded-md hover:bg-teal-900 transition duration-200 shadow-sm"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="text-center text-white mt-4">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-teal-800 font-extrabold hover:underline">
                        Login
                    </a>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-teal-600 px-3 text-white">or continue with email</span>
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
