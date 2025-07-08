import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// 🔒 Assume this comes from auth context or props
const currentUser = {
    name: "Admin User",
    role: "admin", // change to "user" to test regular user view
};

// ✅ Image data - ideally from backend
const initialBannerImages = [
    {
        id: 1,
        url: 'https://i.ibb.co/WWMrLBpd/www-medi-mart-web-app-1.png',
        alt: 'Knee Support 1',
    },
    {
        id: 2,
        url: 'https://i.ibb.co/WWMrLBpd/www-medi-mart-web-app-1.png',
        alt: 'Knee Support 2',
    },
    {
        id: 3,
        url: 'https://i.ibb.co/WWMrLBpd/www-medi-mart-web-app-1.png',
        alt: 'Knee Support 3',
    },
];

const Banner = () => {
    const [bannerImages, setBannerImages] = useState(initialBannerImages);

    // 🗑 Delete handler
    const handleDelete = (id) => {
        const confirm = window.confirm("Are you sure you want to delete this banner?");
        if (confirm) {
            setBannerImages(bannerImages.filter(image => image.id !== id));
        }
    };

    // ✏️ Edit handler placeholder
    const handleEdit = (id) => {
        alert(`Editing banner with ID: ${id}`);
        // You can open a modal for editing or redirect to an edit page
    };

    return (
        <div className="w-11/12 mx-auto my-3 min-h-screen rounded-2xl overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                spaceBetween={10}
                slidesPerView={1}
                className="h-full"
            >
                {bannerImages.map((image) => (
                    <SwiperSlide key={image.id}>
                        <div className="relative group w-full h-full">
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover rounded-2xl border-b-2"
                            />

                            {currentUser.role === 'admin' && (
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => handleEdit(image.id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;
