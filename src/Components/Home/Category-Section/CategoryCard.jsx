import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const CategoryCard = ({ category }) => {
    const { image, name, description } = category;
    const [medicineCount, setMedicineCount] = useState(0);

    useEffect(() => {
        axios.get("https://medi-hurt-server.vercel.app/medicines-data")
            .then(res => {
                const filtered = res.data.filter(med => med.category === name);
                setMedicineCount(filtered.length);
            })
            .catch(err => {
                console.error("Failed to fetch medicines data", err);
            });
    }, [name]);

    return (
        <Link to={`/category/${name}`} className="block">
            <div className="h-105 bg-white border-teal-700 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform cursor-pointer overflow-hidden border-2">
                <figure className="w-full h-48 overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-center object-cover"
                    />
                </figure>
                <div className="flex flex-col gap-4 items-center py-6 px-4 text-center">
                    <h2 className="text-lg font-bold text-[#31718f]">{name}</h2>
                    <div className="bg-teal-600 text-white text-sm px-4 py-1 rounded-full shadow-sm">
                        Total Medicines: {medicineCount}
                    </div>
                    <p className="text-black text-sm">
                        {description.length > 40 ? `${description.slice(0, 40)}...` : description}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
