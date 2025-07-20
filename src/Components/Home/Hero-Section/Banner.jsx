import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Banner = () => {
    const [sliderImages, setSliderImages] = useState([]);

    useEffect(() => {
        const fetchSliderImages = async () => {
            try {
                const response = await fetch('https://medi-hurt-server.vercel.app/advertisements');
                const data = await response.json();
                const filteredImages = data.filter(item => item.inSlider === true);
                setSliderImages(filteredImages);
            } catch (error) {
                console.error('Failed to fetch slider images:', error);
            }
        };

        fetchSliderImages();
    }, []);

    return (
        <div className="w-11/12 mx-auto my-3 h-[65vh] rounded-2xl  overflow-hidden">
            {sliderImages.length > 0 ? (
                <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={1}
                    className="h-full"
                >
                    {sliderImages.map((item) => (
                        <SwiperSlide key={item._id || item.id}>
                            <div className="relative group w-full h-full">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title || 'Slider Image'}
                                    className="w-full h-full object-cover rounded-2xl border-b-2"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="text-center py-10 text-gray-500">Loading slider...</div>
            )}
        </div>
    );
};

export default Banner;
