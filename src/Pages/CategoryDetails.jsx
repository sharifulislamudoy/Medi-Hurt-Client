import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";

const CategoryDetails = () => {
    const { categoryName } = useParams();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        fetch("/category-medicine-data.json")
            .then((res) => res.json())
            .then((data) => {
                const filtered = data.filter((medicine) => medicine.category === categoryName);
                setMedicines(filtered);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching medicines:", err);
                setLoading(false);
            });
    }, [categoryName]);

    const handleViewDetails = (medicine) => {
        setSelectedMedicine(medicine);
        setQuantities({});
        const modal = document.getElementById("medicine_modal");
        if (modal?.showModal) modal.showModal();
    };

    const handleSelectFormulation = (type, price) => {
        const quantity = quantities[type] || 1;

        Swal.fire({
            icon: "success",
            title: "Added to Cart",
            html: `
            <b>${selectedMedicine.name}</b><br/>
            Formulation: <b>${type}</b><br/>
            Quantity: <b>${quantity}</b><br/>
            Total Price: <b>৳${(price * quantity).toFixed(2)}</b>
        `,
            timer: 2500,
            showConfirmButton: false,
        });

        // Close modal after showing Swal
        const modal = document.getElementById("medicine_modal");
        if (modal?.close) modal.close();
    };



    const handleQuantityChange = (type, value) => {
        const val = Math.max(1, parseInt(value || "1"));
        setQuantities((prev) => ({ ...prev, [type]: val }));
    };

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
            <p className="text-sm text-center mb-4">
                <i>(More than {medicines.length}+ Medicine Found)</i>
            </p>

            <div className="overflow-auto max-h-[500px] rounded-lg shadow-md">
                <table className="table-auto w-full border-collapse border-2 border-teal-900 text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#31718f] text-white">
                            <th className="border px-4 py-2">Image</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Brand</th>
                            <th className="border px-4 py-2">Stock</th>
                            <th className="border px-4 py-2">Tablet</th>
                            <th className="border px-4 py-2">Syrup</th>
                            <th className="border px-4 py-2">Capsule</th>
                            <th className="border px-4 py-2">Injection</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((med, index) => (
                            <tr key={index} className="hover:bg-gray-100 text-center">
                                <td className="border px-4 py-2">
                                    <img
                                        src={med.image}
                                        alt={med.name}
                                        className="w-16 h-16 object-contain mx-auto"
                                    />
                                </td>
                                <td className="border px-4 py-2 font-semibold text-teal-600">
                                    {med.name}
                                </td>
                                <td className="border px-4 py-2">{med.brand}</td>
                                <td className="border px-4 py-2">{med.stock}</td>
                                <td className="border px-4 py-2">
                                    {med.formulations.tablet !== undefined
                                        ? `৳${med.formulations.tablet.toFixed(2)}`
                                        : <p className="text-red-500">N/A</p>}
                                </td>
                                <td className="border px-4 py-2">
                                    {med.formulations.syrup !== undefined
                                        ? `৳${med.formulations.syrup.toFixed(2)}`
                                        : <p className="text-red-500">N/A</p>}
                                </td>
                                <td className="border px-4 py-2">
                                    {med.formulations.capsule !== undefined
                                        ? `৳${med.formulations.capsule.toFixed(2)}`
                                        : <p className="text-red-500">N/A</p>}
                                </td>
                                <td className="border px-4 py-2">
                                    {med.formulations.injection !== undefined
                                        ? `৳${med.formulations.injection.toFixed(2)}`
                                        : <p className="text-red-500">N/A</p>}
                                </td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleViewDetails(med)}
                                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-2 py-1 rounded"
                                    >
                                        + View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Custom Modal using <dialog> */}
            <dialog id="medicine_modal" className="modal">
                <div className="modal-box bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
                    <form method="dialog">
                        <button
                            className="absolute top-3 right-3 text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center transition"
                            title="Close"
                        >
                            ✕
                        </button>
                    </form>
                    {selectedMedicine && (
                        <>
                            <h3 className="font-extrabold text-2xl text-center mb-3 text-teal-700 tracking-wide">
                                {selectedMedicine.name}
                            </h3>
                            <p className="text-center text-gray-600 mb-4 italic text-sm">
                                Brand: <span className="font-semibold">{selectedMedicine.brand}</span> | Category:{" "}
                                <span className="font-semibold">{selectedMedicine.category}</span>
                            </p>

                            <div className="flex justify-center mb-6">
                                <img
                                    src={selectedMedicine.image}
                                    alt={selectedMedicine.name}
                                    className="w-32 h-32 rounded-xl object-cover border border-gray-200 shadow-md"
                                />
                            </div>

                            {/* Formulations Section */}
                            <div className="space-y-4">
                                {selectedMedicine.formulations &&
                                    Object.entries(selectedMedicine.formulations).map(([type, price]) => (
                                        <div
                                            key={type}
                                            className="flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div>
                                                <p className="font-semibold capitalize text-lg text-gray-800">
                                                    {type} – <span className="text-teal-600">৳{price}</span>
                                                </p>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    defaultValue={1}
                                                    className="border-2 input input-sm input-bordered w-20 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded"
                                                    onChange={(e) => handleQuantityChange(type, e.target.value)}
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleSelectFormulation(type, price)}
                                                className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white rounded flex items-center gap-1 shadow-md transition-colors duration-200"
                                            >
                                                <FaPlus /> Select
                                            </button>
                                        </div>
                                    ))}
                            </div>
                            {/* 
                            <div className="modal-action mt-8 flex justify-center">
                                <form method="dialog">
                                    <button className="btn btn-outline btn-wide border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 rounded">
                                        Close
                                    </button>
                                </form>
                            </div> */}
                        </>
                    )}
                </div>
            </dialog>
        </section>
    );
};

export default CategoryDetails;
