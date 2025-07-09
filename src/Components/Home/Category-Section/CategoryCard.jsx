import React from "react";

const CategoryCard =({ category }) => {
    const {image, name, totalMedicines, description} = category
    return (
        <div className="bg-white border-teal-700 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform cursor-pointer overflow-hidden border-2">
            <figure className="w-full h-48 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-center"
                />
            </figure>
            <div className="flex flex-col gap-4 items-center py-6 px-4 text-center">
                <h2 className="text-lg font-bold text-[#31718f]">{name}</h2>
                <div className="bg-teal-600 text-white text-sm px-4 py-1 rounded-full shadow-sm">
                    Total Medicines: {totalMedicines}
                </div>
                <p className="text-black text-sm">{description}</p>
            </div>
        </div>
    );
}

export default CategoryCard
