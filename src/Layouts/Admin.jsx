import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Logo from '../assets/Logo.png';
import useAuth from '../Components/Hooks/UseAuth';

const Admin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm();

    const navigate = useNavigate();
    const { loginAsAdmin } = useAuth();

    const onSubmit = async (data) => {
        try {
            await loginAsAdmin(data.username, data.password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('root', {
                type: 'manual',
                message: err.message || 'Invalid credentials'
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-500 to-teal-700 p-5">
            <div className="w-full max-w-lg bg-teal-50 rounded-xl shadow-lg p-10">
                <div className="text-center mb-8">
                    <img
                        src={Logo}
                        alt="Pharmacy Logo"
                        className="w-20 h-20 mx-auto mb-4"
                    />
                    <h2 className="text-3xl font-bold text-gray-800">MediHurt Admin Portal</h2>
                    <p className="text-gray-600 mt-2">Please enter your credentials to access the dashboard</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {errors.root && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {errors.root.message}
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            {...register('username', {
                                required: 'Username is required',
                                minLength: {
                                    value: 4,
                                    message: 'Username must be at least 4 characters'
                                }
                            })}
                            placeholder="Enter admin username"
                            className={`w-full px-4 py-3 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.username ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.username && (
                            <span className="text-red-500 text-xs mt-1 block">
                                {errors.username.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters'
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: 'Password must contain uppercase, lowercase, number, and special character'
                                }
                            })}
                            placeholder="Enter password"
                            className={`w-full px-4 bg-white py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-xs mt-1 block">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Login'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Medihurt . All rights reserved.</p>
                    <p className="mt-1">
                        For support, contact: <a href="mailto:support@medihurt.com" className="text-blue-600 hover:underline">support@medihurt.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Admin;