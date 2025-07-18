import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const discountProducts = [
     {
        id: 1,
        name: "Paracetamol 500mg",
        price: 80,
        discount: 20,
        image: "/images/paracetamol.jpg",
        category: "Pain Relief",
        rating: 4.5,
        stock: 10
    },
    {
        id: 2,
        name: "Vitamin C Tablets",
        price: 120,
        discount: 30,
        image: "/images/vitamin-c.jpg",
        category: "Vitamins",
        rating: 4.7,
        stock: 15
    },
    {
        id: 3,
        name: "Antacid Suspension",
        price: 150,
        discount: 40,
        image: "/images/antacid.jpg",
        category: "Digestive Health",
        rating: 4.2,
        stock: 8
    },
    {
        id: 4,
        name: "Cough Syrup 100ml",
        price: 200,
        discount: 50,
        image: "/images/cough-syrup.jpg",
        category: "Cold & Cough",
        rating: 4.3,
        stock: 12
    },
    {
        id: 5,
        name: "Loratadine Allergy Tablets",
        price: 100,
        discount: 15,
        image: "/images/loratadine.jpg",
        category: "Allergy",
        rating: 4.1,
        stock: 20
    },
    {
        id: 6,
        name: "Multivitamin Capsules",
        price: 250,
        discount: 60,
        image: "/images/multivitamin.jpg",
        category: "Vitamins",
        rating: 4.6,
        stock: 5
    },
    {
        id: 7,
        name: "Oral Saline Sachets",
        price: 60,
        discount: 10,
        image: "/images/oral-saline.jpg",
        category: "Hydration",
        rating: 4.0,
        stock: 30
    },
    {
        id: 8,
        name: "Pain Relief Gel 30g",
        price: 180,
        discount: 45,
        image: "/images/pain-gel.jpg",
        category: "Pain Relief",
        rating: 4.4,
        stock: 7
    },
    {
        id: 9,
        name: "Hand Sanitizer 100ml",
        price: 90,
        discount: 25,
        image: "/images/sanitizer.jpg",
        category: "Hygiene",
        rating: 4.8,
        stock: 25
    },
    {
        id: 10,
        name: "Thermometer (Digital)",
        price: 500,
        discount: 100,
        image: "/images/thermometer.jpg",
        category: "Health Devices",
        rating: 4.9,
        stock: 3
    },
];

const DiscountSlider = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const toggleFavorite = (productId) => {
        if (favorites.includes(productId)) {
            setFavorites(favorites.filter(id => id !== productId));
        } else {
            setFavorites([...favorites, productId]);
        }
    };

    const calculateDiscountPercentage = (price, discount) => {
        return Math.round((discount / price) * 100);
    };

    return (
        <section className="my-12 w-11/12 mx-auto" data-aos="fade-up">
            <h2 className="text-3xl lg:text-5xl md:text-4xl font-bold text-teal-900 mb-4 text-center">
                Best Deals <span className="text-teal-600">MediHurt</span>
            </h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full mb-8"></div>

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                }}
                className="w-full pb-10"
            >
                {discountProducts.map((product, index) => (
                    <SwiperSlide key={product.id}>
                        <div
                            className="bg-white border-2 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border-teal-600 relative group h-120"
                            data-aos="zoom-in"
                            data-aos-delay={index * 100}
                        >
                            {/* Discount Badge */}
                            <div className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                                {calculateDiscountPercentage(product.price, product.discount)}% OFF
                            </div>

                            {/* Product Image */}
                            <div className="h-48 bg-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                                {product.stock < 5 && (
                                    <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                        Only {product.stock} left!
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <span className="text-xs text-teal-600 font-medium">{product.category}</span>
                                <h3
                                    className="text-lg font-semibold text-gray-800 mt-1 mb-2 line-clamp-2"
                                    title={product.name}
                                >
                                    {product.name}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center mb-3">
                                    <div className="flex text-yellow-400 mr-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                    ? 'fill-current'
                                                    : 'stroke-current fill-none'
                                                    }`}
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">{product.rating}</span>
                                </div>

                                {/* Pricing */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 line-through">৳{product.price.toFixed(2)}</p>
                                        <p className="text-xl font-bold text-red-600">
                                            ৳{(product.price - product.discount).toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full transition-colors"
                                        aria-label="Add to cart"
                                    >
                                        <FaShoppingCart />
                                    </button>
                                </div>

                                {/* Save Badge */}
                                <div className="mt-3 text-center">
                                    <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                                        Save ৳{product.discount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default DiscountSlider;
