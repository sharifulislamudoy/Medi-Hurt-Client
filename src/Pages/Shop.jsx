import { useState, useEffect } from "react";
import { FaEye, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const ShopPage = () => {
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState({});

    useEffect(() => {
        fetch("/category-medicine-data.json")
            .then(res => res.json())
            .then(data => setMedicines(data));
    }, []);

    const handleView = (medicine) => {
        setSelectedMedicine(medicine);
        setSelectedQuantity({});
        document.getElementById('medicine_modal').showModal();
    };

    const handleQuantityChange = (formulation, quantity) => {
        setSelectedQuantity((prev) => ({
            ...prev,
            [formulation]: Number(quantity),
        }));
    };

    const handleSelectFormulation = (formulationType, price) => {
        const quantity = selectedQuantity[formulationType] || 1;

        Swal.fire({
            icon: "success",
            title: "Added to Cart",
            html: `
                <b>${selectedMedicine.name}</b><br />
                Formulation: ${formulationType}<br />
                Quantity: ${quantity}<br />
                Total Price: ৳${price * quantity}
            `,
            timer: 2500,
            showConfirmButton: false,
        });

        document.getElementById('medicine_modal').close();
    };

    return (
        <div className="py-6 w-11/12 mx-auto">
            <h2 className="text-3xl font-bold my-2 text-center">🛒 Shop Medicines</h2>
            <p className="text-sm text-center mb-4">
                <i>(More than {medicines.length}+ Medicine Found)</i>
            </p>
            <div className="overflow-auto max-h-[500px] rounded-lg shadow-md">
                <table className="table w-full border-x-2 border-b-2 border-teal-800">
                    <thead className="bg-[#31718f] font-semibold text-white sticky top-0 z-10">
                        <tr>
                            <th className="w-24">Image</th>
                            <th className="w-48">Name</th>
                            <th className="w-40">Brand</th>
                            <th className="w-40">Category</th>
                            <th className="w-24">Price</th>
                            <th className="w-24">Stock</th>
                            <th className="w-40">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((medicine) => (
                            <tr key={medicine._id || medicine.name} className="border border-teal-800">
                                <td>
                                    <img
                                        src={medicine.image}
                                        alt={medicine.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                </td>
                                <td>{medicine.name}</td>
                                <td>{medicine.brand}</td>
                                <td>{medicine.category}</td>
                                <td>৳-{medicine.formulations?.tablet}</td>
                                <td>{medicine.stock}</td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => handleView(medicine)}
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

            <dialog id="medicine_modal" className="modal">
                <div className="modal-box bg-white rounded-lg shadow-lg max-w-md mx-auto p-6 relative">
                    {/* Top-right Close Icon */}
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
                                Brand: <span className="font-semibold">{selectedMedicine.brand}</span> | Category: <span className="font-semibold">{selectedMedicine.category}</span>
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
                                                    className="border-2 input input-sm input-bordered w-20 mt-1 focus:outline-none focus:ring-2  focus:ring-teal-500 focus:border-transparent rounded"
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

                            {/* <div className="modal-action mt-8 flex justify-center">
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


        </div>
    );
};

export default ShopPage;
