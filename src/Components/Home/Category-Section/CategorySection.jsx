import React, { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const itemsPerPage = 8;

    useEffect(() => {
        fetch('http://localhost:3000/medicines')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Failed to load categories:', err));
    }, []);

    if (!categories || categories.length === 0) {
        return <p className="text-center my-10">Loading categories...</p>;
    }

    // If showAll is false, slice to show only first 8 categories
    const displayedCategories = showAll ? categories : categories.slice(0, itemsPerPage);

    const handleSeeAllClick = () => {
        setShowAll(true);
    };

    return (
        <section className="w-11/12 mx-auto my-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#31718f]">Category Section</h1>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {displayedCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* See All Button */}
            {!showAll && categories.length > itemsPerPage && (
                <div className="mt-10 flex justify-center">
                    <button
                        onClick={handleSeeAllClick}
                        className="btn border-teal-700 text-white bg-teal-600 rounded-2xl px-5 py-0 hover:bg-teal-700 "
                    >
                        See All Categories
                    </button>
                </div>
            )}
        </section>
    );
};

export default CategorySection;
