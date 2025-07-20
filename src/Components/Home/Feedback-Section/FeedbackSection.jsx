import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import useAuth from '../../Hooks/UseAuth';
import { FaStar, FaRegStar, FaStarHalfAlt, FaQuoteLeft, FaPills, FaHeartbeat } from 'react-icons/fa';

const FeedbackSection = () => {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [form, setForm] = useState({
        rating: 5,
        comment: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch feedbacks from backend
    useEffect(() => {
        fetch('https://medi-hurt-server.vercel.app/feedbacks')
            .then(res => res.json())
            .then(data => setFeedbacks(data))
            .catch(err => console.error('Failed to fetch feedbacks:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (rating) => {
        setForm(prev => ({ ...prev, rating }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage({ type: 'error', text: 'You must be logged in to submit feedback.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            return;
        }

        const newFeedback = {
            name: user.displayName || 'Anonymous',
            email: user.email || '',
            photo: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName?.replace(' ', '+')}&background=4CAF50&color=fff`,
            rating: form.rating,
            comment: form.comment,
            date: new Date().toISOString().split('T')[0],
        };

        try {
            setLoading(true);
            const res = await fetch('https://medi-hurt-server.vercel.app/feedbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFeedback)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Submission failed');

            setFeedbacks(prev => [data.feedback, ...prev]);
            setForm({ rating: 5, comment: '' });
            setMessage({ type: 'success', text: 'Thank you for your valuable feedback!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    // if (!user) return null;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-400" />);
            }
        }

        return stars;
    };

    return (
        <div className="w-11/12 mx-auto py-12 px-4 md:px-8 bg-gradient-to-b from-white to-teal-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <FaPills className="text-3xl text-teal-600 mr-2" />
                        <FaHeartbeat className="text-3xl text-red-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800  mb-2">Customer <span className='text-teal-800'>Experiences</span></h2>
                    <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full mb-8"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Share your experience with our pharmacy services and help us serve you better
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-16 border border-blue-100">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <FaQuoteLeft className="text-teal-500 mr-2" />
                        Share Your Feedback
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block font-semibold text-gray-700 mb-2">How would you rate your experience?</label>
                            <div className="flex gap-2 text-2xl">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => handleRatingChange(star)}
                                        className={`focus:outline-none transition-transform hover:scale-110 ${star <= form.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        {star <= form.rating ? <FaStar /> : <FaRegStar />}
                                    </button>
                                ))}
                                <span className="ml-2 text-gray-600 text-sm self-end">
                                    ({form.rating} {form.rating === 1 ? 'star' : 'stars'})
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block font-semibold text-gray-700 mb-2">Your Feedback</label>
                            <textarea
                                name="comment"
                                value={form.comment}
                                onChange={handleChange}
                                rows="4"
                                required
                                disabled={!user}
                                placeholder={user ? "Tell us about your experience..." : "Please log in to leave feedback."}
                                className="w-full border-teal-600 border-2 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            />

                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading || !user}
                                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : user ? 'Submit Feedback' : 'Login to Submit'}
                            </button>

                        </div>

                        {message.text && (
                            <div className={`mt-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                    {!user && (
                        <div className="my-4 p-3 bg-yellow-100 text-yellow-700 rounded">
                            Please log in to submit your feedback. You can still read what others have shared!
                        </div>
                    )}

                </div>

                {/* Testimonials */}
                <div className="mb-8">
                    <h3 className="text-3xl font-bold text-teal-800 mb-6 text-center">What Our Customers Say</h3>

                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{
                            clickable: true,
                            bulletClass: 'swiper-pagination-bullet bg-teal-400',
                            bulletActiveClass: 'swiper-pagination-bullet-active bg-teal-600'
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-12 px-2"
                    >
                        {feedbacks.map(feedback => (
                            <SwiperSlide key={feedback._id}>
                                <div className="bg-white border-2 border-teal-600 rounded-xl p-6 h-full shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex gap-4 items-start mb-4">
                                        <img
                                            src={feedback.photo}
                                            alt={feedback.name}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-teal-200"
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${feedback.name.replace(' ', '+')}&background=4CAF50&color=fff`;
                                            }}
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{feedback.name}</h4>
                                            <div className="flex items-center mt-1">
                                                <div className="flex text-yellow-400 mr-2">
                                                    {renderStars(feedback.rating)}
                                                </div>
                                                <span className="text-sm text-gray-500">{feedback.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <FaQuoteLeft className="text-teal-200 text-3xl absolute -top-2 -left-1" />
                                        <p className="text-gray-700 pl-6 italic relative z-10">"{feedback.comment}"</p>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-xs text-gray-400">{feedback.date}</span>
                                        {feedback.email.includes('@') && (
                                            <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                                                Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default FeedbackSection;