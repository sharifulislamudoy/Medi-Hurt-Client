import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaGithub, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import { ReTitle } from 're-title';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router';
import useAuth from '../Components/Hooks/useAuth';

const Signup = () => {
    const navigate = useNavigate();
    const { loginWithGoogle, registerWithEmail } = useAuth();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password', '');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // cloudinary config
    const cloudName = "dohhfubsa";
    const uploadPreset = "react_unsigned";

    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: data,
        });

        const result = await res.json();
        return result.secure_url;
    };

    const onSubmit = async (data) => {
        const { email, password, username, address, phone } = data;

        try {
            setLoading(true);

            // file upload to cloudinary
            let photoURL = "";
            if (imageFile) {
                photoURL = await uploadToCloudinary(imageFile);
            }

            // firebase signup
            const userCredential = await registerWithEmail(email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: username,
                photoURL: photoURL
            });

            const newUser = {
                email,
                username,
                role: "user",
                photoURL,
                address,
                phone,
                createdAt: new Date()
            };

            const res = await fetch('https://medi-hurt-server.vercel.app/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            const result = await res.json();

            if (res.ok && result.insertedId) {
                const resUser = await fetch(`https://medi-hurt-server.vercel.app/users/${email}`);
                const userData = await resUser.json();

                Swal.fire({
                    title: 'Success!',
                    text: `Welcome, ${username}! Your account has been created.`,
                    icon: 'success',
                    confirmButtonColor: '#1db184',
                    confirmButtonText: 'Continue'
                }).then(() => {
                    if (userData.role === 'seller') {
                        window.location.href = '/seller/dashboard';
                    } else {
                        window.location.href = '/shop';
                    }
                });

            } else {
                Swal.fire({
                    title: 'Signup Failed',
                    text: result.message || 'Something went wrong while saving your data.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
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
        } finally {
            setLoading(false); // ✅ সব শেষে লোডিং বন্ধ
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const result = await loginWithGoogle();
            const user = result.user;

            const newUser = {
                email: user.email,
                username: user.displayName || 'Unknown',
                role: 'user',
                photoURL: user.photoURL || '',
                createdAt: new Date()
            };

            const res = await fetch('https://medi-hurt-server.vercel.app/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            const resultData = await res.json();

            if (res.ok && resultData.insertedId) {
                const resUser = await fetch(`https://medi-hurt-server.vercel.app/users/${user.email}`);
                const userData = await resUser.json();

                Swal.fire({
                    title: 'Success!',
                    text: `Welcome, ${user.displayName || 'User'}! Your account has been created.`,
                    icon: 'success',
                    confirmButtonColor: '#1db184',
                    confirmButtonText: 'Continue'
                }).then(() => {
                    if (userData.role === 'seller') {
                        navigate('/seller/dashboard');
                    } else {
                        navigate('/shop');
                    }
                });
            }
            else {
                Swal.fire({
                    title: 'Signup Failed',
                    text: resultData.message || 'This email is already registered. Please use a different one.',
                    icon: 'error',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Try Again'
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-600">
            <ReTitle title='Medi Hurt | Sign Up' />
            <div className="w-full max-w-md p-8">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-white">Create Your Account</h2>

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
                        <label className="block text-sm font-medium text-white mb-1">Email</label>
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
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: value =>
                                        value === password || "Passwords do not match"
                                })}
                                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                placeholder="••••••••"
                            />
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
                        <input
                            type="tel"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9]{10,15}$/,
                                    message: "Enter a valid phone number"
                                }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                            placeholder="e.g. 01234567890"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Address</label>
                        <input
                            type="text"
                            {...register("address", { required: "Address is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                            placeholder="Your address"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Profile Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                        />
                        {/* {!imageFile && <p className="text-red-500 text-sm mt-1">Profile photo is required</p>} */}
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 
      bg-teal-800 text-white font-semibold py-2 rounded-md 
      transition duration-200 shadow-sm
      ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-900"}`}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                "Sign Up"
                            )}
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

                <div className="space-y-3 mb-6">
                    <button
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-blue-50 transition"
                    >
                        <FcGoogle className="text-lg" />
                        Sign Up with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
