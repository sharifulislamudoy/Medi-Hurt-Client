import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const discountProducts = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        price: 80,
        discount: 20,
        image: "/images/paracetamol.jpg",
    },
    {
        id: 2,
        name: "Vitamin C Tablets",
        price: 120,
        discount: 30,
        image: "/images/vitamin-c.jpg",
    },
    {
        id: 3,
        name: "Antacid Suspension",
        price: 150,
        discount: 40,
        image: "/images/antacid.jpg",
    },
    {
        id: 4,
        name: "Cough Syrup 100ml",
        price: 200,
        discount: 50,
        image: "/images/cough-syrup.jpg",
    },
    {
        id: 5,
        name: "Loratadine Allergy Tablets",
        price: 100,
        discount: 15,
        image: "/images/loratadine.jpg",
    },
    {
        id: 6,
        name: "Multivitamin Capsules",
        price: 250,
        discount: 60,
        image: "/images/multivitamin.jpg",
    },
    {
        id: 7,
        name: "Oral Saline Sachets",
        price: 60,
        discount: 10,
        image: "/images/oral-saline.jpg",
    },
    {
        id: 8,
        name: "Pain Relief Gel 30g",
        price: 180,
        discount: 45,
        image: "/images/pain-gel.jpg",
    },
    {
        id: 9,
        name: "Hand Sanitizer 100ml",
        price: 90,
        discount: 25,
        image: "/images/sanitizer.jpg",
    },
    {
        id: 10,
        name: "Thermometer (Digital)",
        price: 500,
        discount: 100,
        image: "/images/thermometer.jpg",
    },
];

const DiscountSlider =() => {
    return (
        <section className="my-8 px-4">
            <h2 className="text-2xl font-semibold mb-4">Discount Products</h2>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={2}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                className="w-full"
            >
                {discountProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
                            <img src={product.image} alt={product.name} className="h-32 w-full object-cover mb-3" />
                            <h3 className="text-lg font-bold">{product.name}</h3>
                            <p className="text-sm text-gray-500 line-through">৳{product.price}</p>
                            <p className="text-lg font-semibold text-red-500">৳{product.price - product.discount}</p>
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full mt-2 inline-block">
                                Save ৳{product.discount}
                            </span>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
export default DiscountSlider
