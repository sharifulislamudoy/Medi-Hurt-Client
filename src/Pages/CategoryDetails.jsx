import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaShoppingCart, FaEye } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useCart } from "../Provider/CartProvider";
import { ReTitle } from "re-title";
import useScrollToTop from "../Components/Hooks/useScrollToTop";
import useAuth from "../Components/Hooks/UseAuth";

const CategoryDetails = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    useScrollToTop();
    const { categoryName } = useParams();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const { addToCart } = useCart();
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`https://medi-hurt-server.vercel.app/medicines-data/${categoryName}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch medicines: ${response.status}`);
                }

                const data = await response.json();
                setMedicines(data);
            } catch (err) {
                console.error("Error fetching medicines:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, [categoryName]);

    const filteredMedicines = useMemo(() => {
        if (!searchTerm) return medicines;

        const term = searchTerm.toLowerCase();
        return medicines.filter(medicine =>
            medicine.name.toLowerCase().includes(term) ||
            medicine.brand.toLowerCase().includes(term)
        );
    }, [medicines, searchTerm]);

    const sortedMedicines = useMemo(() => {
        const sortableItems = [...filteredMedicines];
        if (!sortConfig.key) return sortableItems;

        sortableItems.sort((a, b) => {
            // Handle formulation prices
            if (['tablet', 'syrup', 'capsule', 'injection'].includes(sortConfig.key)) {
                const aPrice = a.formulations?.[sortConfig.key] || 0;
                const bPrice = b.formulations?.[sortConfig.key] || 0;
                return sortConfig.direction === 'ascending' ? aPrice - bPrice : bPrice - aPrice;
            }

            // Handle other fields
            const aValue = a[sortConfig.key] || '';
            const bValue = b[sortConfig.key] || '';

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        return sortableItems;
    }, [filteredMedicines, sortConfig]);

    const pageCount = Math.ceil(sortedMedicines.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = sortedMedicines.slice(offset, offset + itemsPerPage);

    const requestSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending'
                ? 'descending'
                : 'ascending'
        }));
        setCurrentPage(0);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="inline ml-1 opacity-50" />;
        return sortConfig.direction === 'ascending'
            ? <FaSortUp className="inline ml-1" />
            : <FaSortDown className="inline ml-1" />;
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewDetails = (medicine) => {
        setSelectedMedicine(medicine);
        setQuantities({});
        document.getElementById("medicine_modal").showModal();
    };

    const handleSelectFormulation = (type, price) => {
        // Check if user is logged in
        if (!user) {
            document.getElementById("medicine_modal").close();
            Swal.fire({
                icon: "error",
                title: "Login Required",
                text: "You need to log in to add items to your cart.",
                showConfirmButton: true,
                confirmButtonText: "Login",
                showCancelButton: true,
                cancelButtonText: "Cancel",
                customClass: {
                    container: 'z-[10000]' // Ensure it appears above modal
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/auth/login');
                }
            });
            return;
        }

        const quantity = quantities[type] || 1;
        const totalPrice = price * quantity;

        addToCart({
            ...selectedMedicine,
            type,
            quantity,
            price,
            totalPrice
        });

        Swal.fire({
            icon: "success",
            title: "Added to Cart",
            html: `
            <div class="text-left">
                <p class="font-bold text-lg mb-2">${selectedMedicine.name}</p>
                <p><span class="font-medium">Formulation:</span> ${type}</p>
                <p><span class="font-medium">Quantity:</span> ${quantity}</p>
                <p><span class="font-medium">Unit Price:</span> ৳${price.toFixed(2)}</p>
                <p class="font-bold mt-2">Total: ৳${totalPrice.toFixed(2)}</p>
            </div>
        `,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: "Continue Shopping",
            timer: 3000,
            timerProgressBar: true,
        });

        document.getElementById("medicine_modal").close();
    };

    const handleQuantityChange = (type, value) => {
        const val = Math.max(1, Math.min(100, parseInt(value || "1")));
        setQuantities(prev => ({ ...prev, [type]: val }));
    };

    const getStockStatus = (stock) => {
        if (stock > 20) return <span className="text-green-600 font-medium">In Stock</span>;
        if (stock > 0) return <span className="text-yellow-600 font-medium">Low Stock</span>;
        return <span className="text-red-600 font-medium">Out of Stock</span>;
    };

    const getPriceDisplay = (price) => {
        return price !== undefined
            ? <span className="font-bold text-teal-700">৳{price.toFixed(2)}</span>
            : <span className="text-red-500 text-sm">N/A</span>;
    };

    if (error) {
        return (
            <div className="text-center my-20">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Medicines</h2>
                <p className="text-gray-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (medicines.length === 0) {
        return (
            <div className="text-center my-20">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">No Medicines Found</h2>
                <p className="text-gray-600">
                    No medicines available in the {categoryName} category
                </p>
            </div>
        );
    }

    return (
        <section className="w-11/12 mx-auto my-8">
            <ReTitle title={`Medi Hurt | ${categoryName}`} />
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-teal-900">
                        {categoryName} Medicines
                    </h1>
                    <p className="text-sm text-gray-600">
                        {medicines.length} medicines available
                    </p>
                </div>

                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${categoryName}...`}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0);
                        }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-teal-700 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Image
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-teal-600 transition"
                                    onClick={() => requestSort('name')}
                                >
                                    <div className="flex items-center">
                                        Name
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-teal-600 transition"
                                    onClick={() => requestSort('brand')}
                                >
                                    <div className="flex items-center">
                                        Brand
                                        {getSortIcon('brand')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Stock
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-teal-600 transition"
                                    onClick={() => requestSort('tablet')}
                                >
                                    <div className="flex items-center">
                                        Tablet
                                        {getSortIcon('tablet')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-teal-600 transition"
                                    onClick={() => requestSort('syrup')}
                                >
                                    <div className="flex items-center">
                                        Syrup
                                        {getSortIcon('syrup')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-teal-600 transition"
                                    onClick={() => requestSort('capsule')}
                                >
                                    <div className="flex items-center">
                                        Capsule
                                        {getSortIcon('capsule')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-teal-600 transition"
                                    onClick={() => requestSort('injection')}
                                >
                                    <div className="flex items-center">
                                        Injection
                                        {getSortIcon('injection')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((medicine) => (
                                <tr key={`${medicine._id || medicine.name}-${medicine.brand}`} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img
                                                src={medicine.image || '/default-medicine.png'}
                                                alt={medicine.name}
                                                className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                                onError={(e) => {
                                                    e.target.src = '/default-medicine.png';
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{medicine.brand}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            {getStockStatus(medicine.stock)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            {getPriceDisplay(medicine.formulations?.tablet)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            {getPriceDisplay(medicine.formulations?.syrup)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            {getPriceDisplay(medicine.formulations?.capsule)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            {getPriceDisplay(medicine.formulations?.injection)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(medicine)}
                                            className="text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-md flex items-center gap-1 transition"
                                        >
                                            <FaEye className="text-sm" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {pageCount > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">{offset + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(offset + itemsPerPage, sortedMedicines.length)}
                        </span>{' '}
                        of <span className="font-medium">{sortedMedicines.length}</span> results
                    </div>
                    <ReactPaginate
                        previousLabel={'← Previous'}
                        nextLabel={'Next →'}
                        breakLabel={'...'}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={'flex items-center gap-1'}
                        pageClassName={'px-3 py-1 border rounded hover:bg-teal-100 transition'}
                        pageLinkClassName={'text-teal-800'}
                        activeClassName={'bg-teal-600 text-white border-teal-600'}
                        activeLinkClassName={'text-white'}
                        previousClassName={'px-3 py-1 border rounded hover:bg-teal-100'}
                        nextClassName={'px-3 py-1 border rounded hover:bg-teal-100'}
                        disabledClassName={'opacity-50 cursor-not-allowed hover:bg-transparent'}
                        breakClassName={'px-3 py-1'}
                    />
                </div>
            )}

            <dialog id="medicine_modal" className="modal backdrop-blur-sm">
                <div className="modal-box bg-white rounded-lg shadow-xl max-w-md mx-auto p-6 relative max-h-[90vh] overflow-y-auto">
                    <form method="dialog">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-100"
                            title="Close"
                        >
                            ✕
                        </button>
                    </form>

                    {selectedMedicine && (
                        <>
                            <div className="flex flex-col items-center mb-6">
                                <img
                                    src={selectedMedicine.image || '/default-medicine.png'}
                                    alt={selectedMedicine.name}
                                    className="w-40 h-40 rounded-xl object-contain border border-gray-200 shadow-sm mb-4"
                                    onError={(e) => {
                                        e.target.src = '/default-medicine.png';
                                    }}
                                />
                                <h3 className="font-bold text-xl text-center text-gray-900">
                                    {selectedMedicine.name}
                                </h3>
                                <p className="text-sm text-gray-600 text-center">
                                    {selectedMedicine.brand} • {selectedMedicine.category}
                                </p>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                                <p className="text-gray-600 text-sm">
                                    {selectedMedicine.description || "No description available for this medicine."}
                                </p>
                            </div>

                            <div className="mb-2">
                                <h4 className="font-semibold text-gray-800 mb-3">Available Formulations</h4>
                                <div className="space-y-3">
                                    {selectedMedicine.formulations ? (
                                        Object.entries(selectedMedicine.formulations).map(([type, price]) => (
                                            <div
                                                key={type}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-gray-200 p-3 rounded-lg hover:shadow-sm transition"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium capitalize text-gray-800">
                                                        {type}
                                                    </p>
                                                    <p className="text-teal-700 font-bold">৳{price.toFixed(2)}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {getStockStatus(selectedMedicine.stock)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        value={quantities[type] || 1}
                                                        onChange={(e) => handleQuantityChange(type, e.target.value)}
                                                        className="border px-3 py-2 w-20 rounded text-sm focus:ring-teal-500 focus:border-teal-500"
                                                    />
                                                    <button
                                                        onClick={() => handleSelectFormulation(type, price)}
                                                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2 transition flex-1 sm:flex-none justify-center"
                                                    >
                                                        <FaShoppingCart className="text-xs" />
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No formulations available</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </section>
    );
};

export default CategoryDetails;