import React, { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';
import ReactPaginate from 'react-paginate';
import './CategoryPagination.css'; // for custom pagination styles (you can style it)

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        fetch('/categorymedicines.json')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Failed to load categories:', err));
    }, []);

    if (!categories || categories.length === 0) {
        return <p className="text-center my-10">Loading categories...</p>;
    }

    const pageCount = Math.ceil(categories.length / itemsPerPage);
    const startOffset = currentPage * itemsPerPage;
    const currentCategories = categories.slice(startOffset, startOffset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <section className="w-11/12 mx-auto my-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Category Section</h1>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {currentCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center">
                <ReactPaginate
                    previousLabel="«"
                    nextLabel="»"
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    containerClassName="join"
                    pageClassName="join-item btn"
                    pageLinkClassName="px-3"
                    previousClassName="join-item btn"
                    nextClassName="join-item btn"
                    activeClassName="btn-primary"
                    disabledClassName="opacity-50 cursor-not-allowed"
                    forcePage={currentPage}
                />
            </div>
        </section>
    );
};

export default CategorySection;
