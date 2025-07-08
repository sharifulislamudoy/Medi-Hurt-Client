import React from "react";

const CategoryCard =({ category }) => {
    const {image, name, totalMedicines, description} = category
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform cursor-pointer overflow-hidden border border-blue-100">
            <figure className="w-full h-48 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-center"
                />
            </figure>
            <div className="flex flex-col gap-4 items-center py-6 px-4 text-center">
                <h2 className="text-lg font-bold text-[#59ccf2]">{name}</h2>
                <div className="bg-blue-100 text-[#5f8d9c] text-sm px-4 py-1 rounded-full shadow-sm">
                    Total Medicines: {totalMedicines}
                </div>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </div>
    );
}

export default CategoryCard
