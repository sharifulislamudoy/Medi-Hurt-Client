import { useState, useEffect } from "react";
import { FaEye, FaPlus } from "react-icons/fa";
// import MedicineModal from "./MedicineModal";
import Swal from "sweetalert2";

const ShopPage = () => {
    const [medicines, setMedicines] = useState([]);
    // const [selectedMedicine, setSelectedMedicine] = useState(null); // used for modal
    // const [showModal, setShowModal] = useState(false); // used for modal visibility

    useEffect(() => {
        // Replace with your API call
        fetch("/category-medicine-data.json")
            .then(res => res.json())
            .then(data => setMedicines(data));
    }, []);

    const handleView = (medicine) => {
        setSelectedMedicine(medicine);
        setShowModal(true);
    };

    const handleSelect = (medicine) => {
        // Add to cart logic here
        // Example: updateCart(medicine);
        Swal.fire({
            icon: "success",
            title: "Added to Cart",
            text: `${medicine.name} has been added!`,
            timer: 2000,
            showConfirmButton: false,
        });
    };

    return (
        <div className="py-6 w-11/12 mx-auto">
            <h2 className="text-3xl font-bold my-2 text-center">🛒 Shop Medicines</h2>
            <p className="text-sm text-center mb-4"><i>(More than {medicines.length}+ Medicine Found)</i></p>
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
                                <td>${medicine.formulations?.tablet}</td>
                                <td>{medicine.stock}</td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => handleView(medicine)}
                                        className="btn btn-sm btn-outline btn-info"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleSelect(medicine)}
                                        className="btn btn-sm btn-success text-white bg-teal-500"
                                    >
                                        <FaPlus className="mr-1" /> Select
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 
            {showModal && selectedMedicine && (
                <MedicineModal
                    medicine={selectedMedicine}
                    closeModal={() => setShowModal(false)}
                />
            )} 
            */}
        </div>
    );
};

export default ShopPage;
