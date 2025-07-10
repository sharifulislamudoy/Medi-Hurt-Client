import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const CategoryDetails = () => {
    const { categoryName } = useParams();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/category-medicine-data.json") // Make sure this path is correct
            .then((res) => res.json())
            .then((data) => {
                const filtered = data.filter(
                    (medicine) => medicine.category === categoryName
                );
                setMedicines(filtered);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching medicines:", err);
                setLoading(false);
            });
    }, [categoryName]);

    if (loading) {
        return <p className="text-center my-10">Loading medicines...</p>;
    }

    if (medicines.length === 0) {
        return <p className="text-center my-10">No medicines found for "{categoryName}"</p>;
    }

    return (
        <section className="w-11/12 mx-auto my-10 overflow-x-auto">
            <h1 className="text-3xl font-bold text-center text-black mb-6">
                {categoryName} Medicines
            </h1>
            <p className="text-sm text-center mb-4"><i>(More than {categoryName.length}+ Medicine Found)</i></p>
            <div className="overflow-auto max-h-[500px] rounded-lg shadow-md">
                <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#31718f] text-white">
                            <th className="border border-gray-300 px-4 py-2">Image</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Brand</th>
                            <th className="border border-gray-300 px-4 py-2">Stock</th>
                            <th className="border border-gray-300 px-4 py-2">Tablet</th>
                            <th className="border border-gray-300 px-4 py-2">Syrup</th>
                            <th className="border border-gray-300 px-4 py-2">Capsule</th>
                            <th className="border border-gray-300 px-4 py-2">Injection</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((med, index) => (
                            <tr key={index} className="hover:bg-gray-100 text-center">
                                <td className="border border-gray-300 px-4 py-2">
                                    <img
                                        src={med.image}
                                        alt={med.name}
                                        className="w-16 h-16 object-contain mx-auto"
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2 font-semibold text-[#31718f]">{med.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{med.brand}</td>
                                <td className="border border-gray-300 px-4 py-2">{med.stock}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {med.formulations.tablet !== undefined
                                        ? `৳${med.formulations.tablet.toFixed(2)}`
                                        : "Format Unavailable"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {med.formulations.syrup !== undefined
                                        ? `৳${med.formulations.syrup.toFixed(2)}`
                                        : "Format Unavailable"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {med.formulations.capsule !== undefined
                                        ? `৳${med.formulations.capsule.toFixed(2)}`
                                        : "Format Unavailable"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {med.formulations.injection !== undefined
                                        ? `৳${med.formulations.injection.toFixed(2)}`
                                        : "Format Unavailable"}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </section>
    );
};

export default CategoryDetails;
