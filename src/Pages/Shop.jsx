import { useState, useEffect, useMemo } from "react";
import { FaEye, FaPlus, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { useCart } from "../Provider/CartProvider";

const ShopPage = () => {
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    // Sorting state
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });
    const { addToCart } = useCart();

    useEffect(() => {
        fetch("/category-medicine-data.json")
            .then(res => res.json())
            .then(data => setMedicines(data));
    }, []);

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Get sorting icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort className="inline ml-1" />;
        }
        return sortConfig.direction === 'ascending'
            ? <FaSortUp className="inline ml-1" />
            : <FaSortDown className="inline ml-1" />;
    };

    // Sorted and paginated data
    const sortedMedicines = useMemo(() => {
        let sortableItems = [...medicines];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                // Special case for price since it's nested in formulations
                if (sortConfig.key === 'price') {
                    const aPrice = a.formulations?.tablet || 0;
                    const bPrice = b.formulations?.tablet || 0;
                    if (aPrice < bPrice) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aPrice > bPrice) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                } else {
                    // Normal sorting for other fields
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
    }, [medicines, sortConfig]);

    // Pagination logic
    const pageCount = Math.ceil(sortedMedicines.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = sortedMedicines.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

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

    const handleSelectFormulation = (type, price) => {
        const quantity = selectedQuantity[type] || 1;

        // Add to cart
        addToCart(selectedMedicine, type, quantity);

        Swal.fire({
            icon: "success",
            title: "Added to Cart",
            html: `
            <b>${selectedMedicine.name}</b><br />
            Formulation: ${type}<br />
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
            <h2 className="text-3xl font-bold my-2 text-center text-teal-900">🛒 Shop Medicines</h2>
            <p className="text-sm text-center mb-4 ml-8">
                <i>(More than {medicines.length}+ Medicine Found)</i>
            </p>
            <div className="overflow-auto rounded-lg shadow-md">
                <table className="table w-full border-x-2 border-b-2 border-teal-800">
                    <thead className="bg-[#31718f] font-semibold text-white sticky top-0 z-10">
                        <tr>
                            <th className="w-24">Image</th>
                            <th
                                className="w-48 cursor-pointer"
                                onClick={() => requestSort('name')}
                            >
                                Name {getSortIcon('name')}
                            </th>
                            <th
                                className="w-40 cursor-pointer"
                                onClick={() => requestSort('brand')}
                            >
                                Brand {getSortIcon('brand')}
                            </th>
                            <th
                                className="w-40 cursor-pointer"
                                onClick={() => requestSort('category')}
                            >
                                Category {getSortIcon('category')}
                            </th>
                            <th
                                className="w-24 cursor-pointer"
                                onClick={() => requestSort('price')}
                            >
                                Price {getSortIcon('price')}
                            </th>
                            <th className="w-24">Stock</th>
                            <th className="w-40">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((medicine) => (
                            <tr key={medicine._id || medicine.name} className="border border-teal-800 hover:bg-gray-100">
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
                                <td>৳{medicine.formulations?.tablet || 'N/A'}</td>
                                <td>{medicine.stock}</td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => handleView(medicine)}
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

            {/* Pagination */}
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
                <div className="modal-box bg-white rounded-lg shadow-lg max-w-md mx-auto p-6 relative">
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
                                                <p className="font-semibold capitalize text-teal-700">
                                                    {type}
                                                </p>
                                                <span className="text-gray-500">৳{price}</span>

                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    defaultValue={1}
                                                    className="border px-2 py-1 w-20 rounded text-sm"
                                                    onChange={(e) => handleQuantityChange(type, e.target.value)}
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
        </div>
    );
};

export default ShopPage;