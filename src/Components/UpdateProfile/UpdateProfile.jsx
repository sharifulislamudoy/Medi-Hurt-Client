import { useEffect, useState } from 'react';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCheck,
    FaExclamationTriangle,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAuth from '../Hooks/UseAuth';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateProfile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        age: '',
        gender: '',
        bloodGroup: '',
        allergies: '',
        emergencyContact: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const calculateCompletion = () => {
        const requiredFields = ['name', 'email', 'phone', 'address', 'age', 'gender'];
        const filledCount = requiredFields.filter(field => formData[field] && formData[field].toString().trim() !== '').length;
        return Math.round((filledCount / requiredFields.length) * 100);
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('https://medi-hurt-server.vercel.app/users');
                const matchedUser = res.data.find((u) => u.email === user.email);
                if (matchedUser) {
                    setFormData((prev) => ({
                        ...prev,
                        name: matchedUser.username || '',
                        email: matchedUser.email,
                        phone: matchedUser.phone || '',
                        address: matchedUser.address || '',
                        age: matchedUser.age || '',
                        gender: matchedUser.gender || '',
                        bloodGroup: matchedUser.bloodGroup || '',
                        allergies: matchedUser.allergies || '',
                        emergencyContact: matchedUser.emergencyContact || '',
                    }));
                    setUserId(matchedUser._id);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (user?.email) fetchUser();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        const requiredFields = ['name', 'email', 'phone', 'address', 'age', 'gender'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                setErrorMessage('Please fill out all required fields.');
                return;
            }
        }

        setErrorMessage('');

        // Password validation
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setErrorMessage('New password and confirmation do not match!');
            return;
        }

        setIsLoading(true);

        if (!userId) {
            setErrorMessage('User ID not found');
            return;
        }

        const updatedData = {
            username: formData.name,
            phone: formData.phone,
            address: formData.address,
            age: formData.age,
            gender: formData.gender,
            bloodGroup: formData.bloodGroup,
            allergies: formData.allergies,
            emergencyContact: formData.emergencyContact,
        };

        try {
            await axios.patch(`https://medi-hurt-server.vercel.app/users/${userId}`, updatedData);

            // Show success SweetAlert
            Swal.fire({
                title: 'Success!',
                text: 'Your profile has been updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#0d9488',
                timer: 3000,
                timerProgressBar: true,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            // Show error SweetAlert
            Swal.fire({
                title: 'Error!',
                text: 'There was a problem updating your profile. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#0d9488',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-12 mx-auto w-11/12 bg-gradient-to-br from-white to-teal-50">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-teal-900 mb-4">
                        Update <span className="text-teal-600">Your Profile</span>
                    </h2>
                    <p className="text-teal-700 font-semibold mb-4">
                        Profile Completion: {calculateCompletion()}%
                    </p>
                    <div className="w-20 h-1 bg-teal-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-700">
                        Keep your information up to date for better service experience
                    </p>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
                >
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-red-100 border border-red-200 text-red-800 p-4 rounded-lg flex items-center"
                        >
                            <FaExclamationTriangle className="text-red-600 mr-2" />
                            {errorMessage}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-teal-900 mb-4 flex items-center">
                                    <FaUser className="mr-2 text-teal-600" />
                                    Personal Information
                                </h3>

                                <div>
                                    <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            required
                                        />
                                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            readOnly
                                        />
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            required
                                        />
                                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="emergencyContact" className="block text-gray-700 mb-2">Emergency Contact Number</label>
                                    <input
                                        type="tel"
                                        id="emergencyContact"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-gray-700 mb-2">Delivery Address</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            required
                                        />
                                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Medical Information */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-teal-900 mb-4 flex items-center">
                                    <FaUser className="mr-2 text-teal-600" />
                                    Medical Information
                                </h3>

                                <div>
                                    <label htmlFor="age" className="block text-gray-700 mb-2">Age</label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="gender" className="block text-gray-700 mb-2">Gender</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="bloodGroup" className="block text-gray-700 mb-2">Blood Group</label>
                                    <select
                                        id="bloodGroup"
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="allergies" className="block text-gray-700 mb-2">Allergies (if any)</label>
                                    <textarea
                                        id="allergies"
                                        name="allergies"
                                        value={formData.allergies}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="e.g., Penicillin, Aspirin"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                className={`px-8 py-3 rounded-lg font-semibold text-white ${isLoading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} transition-all flex items-center`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Profile'
                                )}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default UpdateProfile;