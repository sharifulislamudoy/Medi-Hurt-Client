import React, { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetch('/categorymedicines.json')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Failed to load categories:', err));
    }, []);

    if (!categories || categories.length === 0) {
        return <p className="text-center my-10">Loading categories...</p>;
    }

    const categoriesToShow = showAll ? categories : categories.slice(0, 8);

    return (
        <section className="w-11/12 mx-auto my-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Category Section</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {categoriesToShow.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
            <div className="text-center mt-6">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAll(prev => !prev)}
                >
                    {showAll ? "Show Less" : "See All Categories"}
                </button>
            </div>
        </section>
    );
};

export default CategorySection;
