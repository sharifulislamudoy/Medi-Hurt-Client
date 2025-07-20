import React, { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const itemsPerPage = 8;

    useEffect(() => {
        // Fetch category data
        fetch('https://medi-hurt-server.vercel.app/medicines')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Failed to load categories:', err));
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    if (!categories || categories.length === 0) {
        return <p className="text-center my-10">Loading categories...</p>;
    }

    const displayedCategories = showAll ? categories : categories.slice(0, itemsPerPage);

    const handleSeeAllClick = () => {
        setShowAll(true);
    };

    return (
        <section className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl lg:text-5xl md:text-4xl font-bold text-teal-900 mb-4 text-center">
                Categories <span className="text-teal-600">MediHurt</span>
            </h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full mb-8"></div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {displayedCategories.map((category, index) => (
                    <div
                        key={category.id}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <CategoryCard category={category} />
                    </div>
                ))}
            </div>

            {/* See All Button */}
            {!showAll && categories.length > itemsPerPage && (
                <div className="mt-10 flex justify-center">
                    <button
                        onClick={handleSeeAllClick}
                        className="btn border-teal-700 text-white bg-teal-600 rounded-2xl px-5 py-0 hover:bg-teal-700"
                        data-aos="fade-up"
                        data-aos-delay="500"
                    >
                        See All Categories
                    </button>
                </div>
            )}
        </section>
    );
};

export default CategorySection;
