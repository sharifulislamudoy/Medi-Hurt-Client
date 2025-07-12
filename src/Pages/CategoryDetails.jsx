import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import { FaPlus, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useCart } from "../Provider/CartProvider";

const CategoryDetails = () => {
    const { categoryName } = useParams();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [quantities, setQuantities] = useState({});
    const { addToCart } = useCart();

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });

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

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort className="inline ml-1" />;
        }
        return sortConfig.direction === 'ascending'
            ? <FaSortUp className="inline ml-1" />
            : <FaSortDown className="inline ml-1" />;
    };

    const sortedMedicines = useMemo(() => {
        let sortableItems = [...medicines];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (['tablet', 'syrup', 'capsule', 'injection'].includes(sortConfig.key)) {
                    const aPrice = a.formulations[sortConfig.key] || 0;
                    const bPrice = b.formulations[sortConfig.key] || 0;
                    if (aPrice < bPrice) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aPrice > bPrice) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                } else {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        return sortableItems;
    }, [medicines, sortConfig.key, sortConfig.direction]);

    const pageCount = Math.ceil(sortedMedicines.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = sortedMedicines.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleViewDetails = (medicine) => {
        setSelectedMedicine(medicine);
        setQuantities({});
        const modal = document.getElementById("medicine_modal");
        if (modal?.showModal) modal.showModal();
    };

    const handleSelectFormulation = (type, price) => {
        const quantity = quantities[type] || 1;
        addToCart(selectedMedicine, type, quantity);

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
            <h1 className="text-3xl font-bold text-center text-teal-900 mb-6">
                {categoryName} Medicines
            </h1>
            <p className="text-sm text-center mb-4">
                <i>(More than {medicines.length}+ Medicine Found)</i>
            </p>

            <div className="overflow-auto rounded-lg shadow-md">
                <table className="table-auto w-full border-collapse border-2 border-teal-900 text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#31718f] text-white">
                            <th className="px-4 py-2">Image</th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('name')}>
                                Name {getSortIcon('name')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('brand')}>
                                Brand {getSortIcon('brand')}
                            </th>
                            <th className="px-4 py-2">Stock</th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('tablet')}>
                                Tablet {getSortIcon('tablet')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('syrup')}>
                                Syrup {getSortIcon('syrup')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('capsule')}>
                                Capsule {getSortIcon('capsule')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('injection')}>
                                Injection {getSortIcon('injection')}
                            </th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((med) => (
                            <tr key={`${med._id}-${med.name}`} className="hover:bg-gray-100 text-center border">
                                <td className="px-4 py-2">
                                    <img
                                        src={med.image || '/default-medicine.png'}
                                        alt={med.name}
                                        className="w-16 h-16 object-contain mx-auto"
                                        onError={(e) => {
                                            e.target.src = '/default-medicine.png';
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-2 font-semibold text-teal-600">{med.name}</td>
                                <td className="px-4 py-2">{med.brand}</td>
                                <td className="px-4 py-2">{med.stock}</td>
                                <td className="px-4 py-2">
                                    {med.formulations.tablet !== undefined
                                        ? `৳${med.formulations.tablet.toFixed(2)}`
                                        : <p className="text-red-500">N/A</p>}
                                </td>
                                <td className="px-4 py-2">
                                    {med.formulations.syrup !== undefined
                                        ? `৳${med.formulations.syrup.toFixed(2)}`
                                        : <p className="text-red-500">N/A</p>}
                                </td>
                                <td className="px-4 py-2">
                                    {med.formulations.capsule !== undefined
                                        ? `৳${med.formulations.capsule.toFixed(2)}`
                                        : <p className="text-red-500">N/A</p>}
                                </td>
                                <td className="px-4 py-2">
                                    {med.formulations.injection !== undefined
                                        ? `৳${med.formulations.injection.toFixed(2)}`
                                        : <p className="text-red-500">N/A</p>}
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleViewDetails(med)}
                                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-2 py-1 rounded"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'flex items-center gap-1'}
                    pageClassName={'px-3 py-1 border rounded hover:bg-teal-100'}
                    pageLinkClassName={'text-teal-800'}
                    activeClassName={'bg-teal-600 text-white'}
                    activeLinkClassName={'text-white'}
                    previousClassName={'px-3 py-1 border rounded hover:bg-teal-100 mr-2'}
                    nextClassName={'px-3 py-1 border rounded hover:bg-teal-100 ml-2'}
                    disabledClassName={'opacity-50 cursor-not-allowed'}
                />
            </div>

            <dialog id="medicine_modal" className="modal">
                <div className="modal-box bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
                    <form method="dialog">
                        <button className="absolute top-3 right-3 text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center transition" title="Close">
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
                                    src={selectedMedicine.image || '/default-medicine.png'}
                                    alt={selectedMedicine.name}
                                    className="w-32 h-32 rounded-xl object-cover border border-gray-200 shadow-md"
                                    onError={(e) => {
                                        e.target.src = '/default-medicine.png';
                                    }}
                                />
                            </div>

                            <div className="space-y-4">
                                {selectedMedicine.formulations &&
                                    Object.entries(selectedMedicine.formulations).map(([type, price]) => (
                                        <div key={type} className="flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                            <div>
                                                <p className="font-semibold capitalize text-teal-700">{type}</p>
                                                <p className="text-gray-500">৳{price.toFixed(2)} per unit</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={quantities[type] || 1}
                                                    onChange={(e) => handleQuantityChange(type, e.target.value)}
                                                    className="border px-2 py-1 w-20 rounded text-sm"
                                                />
                                                <button
                                                    onClick={() => handleSelectFormulation(type, price)}
                                                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            </dialog>
        </section>
    );
};

export default CategoryDetails;