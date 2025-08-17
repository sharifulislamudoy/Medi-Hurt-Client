import { useState, useEffect, useMemo } from "react";
import { FaEye, FaSort, FaSortUp, FaSortDown, FaShoppingCart, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { useCart } from "../Provider/CartProvider";
import { useLocation, useNavigate } from "react-router";
import { ReTitle } from "re-title";
import useScrollToTop from "../Components/Hooks/useScrollToTop";
import useAuth from "../Components/Hooks/useAuth";

const ShopPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth();
    useScrollToTop()
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    // Get search term from URL
    const searchParams = new URLSearchParams(location.search);
    const urlSearchTerm = searchParams.get('search') || "";

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 12;

    // Sorting state
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });
    const { addToCart } = useCart();

    useEffect(() => {
        fetch("http://localhost:3000/medicines-data")
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

    // Get sorting button
    const getSortButton = (key, label) => {
        return (
            <button
                onClick={() => requestSort(key)}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition"
            >
                {label}
                {sortConfig.key === key ? (
                    sortConfig.direction === 'ascending' ? (
                        <FaSortUp />
                    ) : (
                        <FaSortDown />
                    )
                ) : (
                    <FaSort className="opacity-50" />
                )}
            </button>
        );
    };

    // Filter and sort medicines
    const filteredAndSortedMedicines = useMemo(() => {
        let filteredItems = [...medicines];

        // Apply search filter from URL or local state
        const term = urlSearchTerm || searchTerm;
        if (term) {
            filteredItems = filteredItems.filter(medicine =>
                medicine.name.toLowerCase().includes(term.toLowerCase()) ||
                medicine.brand.toLowerCase().includes(term.toLowerCase()) ||
                medicine.category.toLowerCase().includes(term.toLowerCase())
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            filteredItems.sort((a, b) => {
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

        // Move exact matches to the top
        const termToUse = urlSearchTerm || searchTerm;
        if (termToUse) {
            filteredItems.sort((a, b) => {
                const aNameMatch = a.name.toLowerCase() === termToUse.toLowerCase();
                const bNameMatch = b.name.toLowerCase() === termToUse.toLowerCase();

                if (aNameMatch && !bNameMatch) return -1;
                if (!aNameMatch && bNameMatch) return 1;

                const aStartsWith = a.name.toLowerCase().startsWith(termToUse.toLowerCase());
                const bStartsWith = b.name.toLowerCase().startsWith(termToUse.toLowerCase());

                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;

                return 0;
            });
        }

        return filteredItems;
    }, [medicines, sortConfig, urlSearchTerm, searchTerm]);

    // Pagination logic
    const pageCount = Math.ceil(filteredAndSortedMedicines.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = filteredAndSortedMedicines.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleView = (medicine) => {
        setSelectedMedicine(medicine);
        setSelectedQuantity({});
        document.getElementById('medicine_modal').showModal();
    };

    const handleQuantityChange = (formulation, quantity) => {
        const qty = Math.max(1, Math.min(100, Number(quantity)) || 1);
        setSelectedQuantity((prev) => ({
            ...prev,
            [formulation]: qty,
        }));
    };

    const handleSelectFormulation = (type, price) => {
        // Check if user is logged in
        if (!user) {
            document.getElementById('medicine_modal').close();
            Swal.fire({
                icon: "error",
                title: "Login Required",
                text: "You need to log in to add items to your cart.",
                showConfirmButton: true,
                confirmButtonText: "Login",
                showCancelButton: true,
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/auth/login');
                }
            });
            return;
        }

        const quantity = selectedQuantity[type] || 1;
        const totalPrice = price * quantity;

        addToCart(selectedMedicine, type, quantity, price);

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

        document.getElementById('medicine_modal').close();
    };

    const getStockStatus = (stock) => {
        if (stock > 20) return <span className="text-green-600 font-medium">In Stock</span>;
        if (stock > 0) return <span className="text-yellow-600 font-medium">Low Stock</span>;
        return <span className="text-red-600 font-medium">Out of Stock</span>;
    };

    return (
        <div className="py-6 w-11/12 mx-auto">
            <ReTitle title="Medi Hurt | Shop" />
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-teal-900 flex items-center gap-2">
                        <FaShoppingCart className="text-teal-700" />
                        Medicine Shop
                    </h2>
                    <p className="text-sm text-gray-600">
                        {medicines.length}+ medicines available
                        {urlSearchTerm && (
                            <span className="ml-2">
                                • Searching for: <span className="font-semibold">"{urlSearchTerm}"</span>
                            </span>
                        )}
                    </p>
                </div>
            
            </div>

            {/* Sorting controls */}
            <div className="flex flex-wrap gap-2 mb-6">
                {getSortButton('name', 'Name')}
                {getSortButton('brand', 'Brand')}
                {getSortButton('category', 'Category')}
                {getSortButton('price', 'Price')}
            </div>

            {/* Medicine Cards Grid */}
            {currentItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentItems.map((medicine) => (
                        <div key={medicine._id || medicine.name} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                            <div className="p-4 flex flex-col h-full">
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={medicine.image}
                                        alt={medicine.name}
                                        className="h-40 w-40 object-contain"
                                    />
                                </div>
                                
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                                        {medicine.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">{medicine.brand}</p>
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
                                            {medicine.category}
                                        </span>
                                        <div className="text-sm">
                                            {getStockStatus(medicine.stock)}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <p className="text-teal-700 font-bold text-lg">
                                            ৳{medicine.formulations?.tablet || 'N/A'}
                                        </p>
                                        <button
                                            onClick={() => handleView(medicine)}
                                            className="text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-md flex items-center gap-1 transition text-sm"
                                        >
                                            <FaEye className="text-sm" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <FaSearch className="text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">No medicines found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter</p>
                </div>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">{offset + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(offset + itemsPerPage, filteredAndSortedMedicines.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredAndSortedMedicines.length}</span> results
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

            {/* Medicine Details Modal */}
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
                                    src={selectedMedicine.image}
                                    alt={selectedMedicine.name}
                                    className="w-40 h-40 rounded-xl object-contain border border-gray-200 shadow-sm mb-4"
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
                                                        defaultValue="1"
                                                        className="border px-3 py-2 w-20 rounded text-sm focus:ring-teal-500 focus:border-teal-500"
                                                        onChange={(e) => handleQuantityChange(type, e.target.value)}
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
        </div>
    );
};

export default ShopPage;