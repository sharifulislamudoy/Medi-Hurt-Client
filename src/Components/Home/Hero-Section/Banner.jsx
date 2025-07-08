import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const bannerImages = [
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
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;
