import { useState, useEffect } from 'react';
import {
    Dashboard,
    LocalPharmacy,
    Payment,
    Campaign,
    AddCircleOutline,
    Menu,
    Close
} from '@mui/icons-material';

import RouteChangeSpinner from '../Loading/RouteChangeSpinner';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import moment from "moment";
import { IoClose } from 'react-icons/io5';
import { ReTitle } from 're-title';
import { Link } from 'react-router';
import HomeIcon from '@mui/icons-material/Home';
import useAuth from '../Hooks/useAuth';

const SellerDashboard = () => {
    const { user } = useAuth()

    const [activeTab, setActiveTab] = useState(() => {
        const savedTab = localStorage.getItem('sellerDashboardActiveTab');
        return savedTab || 'dashboard';
    });

    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // Save the active tab to localStorage
        localStorage.setItem('sellerDashboardActiveTab', tabId);
        if (isSmallScreen) setMobileMenuOpen(false);
    };

    const menuItems = [
        { id: 'dashboard', text: 'Dashboard', icon: <Dashboard className="mr-3" /> },
        { id: 'medicines', text: 'Manage Medicines', icon: <LocalPharmacy className="mr-3" /> },
        { id: 'payments', text: 'Payment History', icon: <Payment className="mr-3" /> },
        { id: 'advertisements', text: 'Ask For Advertisement', icon: <Campaign className="mr-3" /> },
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);




    // {Sales Data Related Functions}
    const [salesData, setSalesData] = useState({
        totalRevenue: 0,
        paidTotal: 0,
        pendingTotal: 0,
    });

    const [lineChartData, setLineChartData] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("http://localhost:3000/orders");
                const orders = res.data.orders;

                const userOrders = orders.filter(order =>
                    order.items.some(item => item.email === user.email)
                );

                let totalRevenue = 0;
                let paidTotal = 0;
                let pendingTotal = 0;

                const dateMap = {};

                userOrders.forEach(order => {
                    totalRevenue += order.amountPaid;
                    if (order.status === "paid") paidTotal += order.amountPaid;
                    if (order.status === "pending") pendingTotal += order.amountPaid;

                    const date = moment(order.date).format("YYYY-MM-DD");
                    if (!dateMap[date]) {
                        dateMap[date] = { date, paid: 0, pending: 0 };
                    }

                    if (order.status === "paid") {
                        dateMap[date].paid += order.amountPaid;
                    } else if (order.status === "pending") {
                        dateMap[date].pending += order.amountPaid;
                    }
                });

                const chartData = Object.values(dateMap).sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                );

                setSalesData({
                    totalRevenue,
                    paidTotal,
                    pendingTotal,
                });

                setLineChartData(chartData);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            }
        };

        fetchOrders();
    }, [user?.email]);





    // {Add Medicines Related Functions}
    const [medicines, setMedicines] = useState([]);

    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const [medicineForm, setMedicineForm] = useState({
        name: '',
        genericName: '',
        category: '',
        brand: '',
        stock: '',
        formulations: {
            tablet: '',
            syrup: '',
            capsule: '',
            injection: '',
        },
        image: '',
        description: '',
    });

    const handleSaveMedicine = async () => {
        const newMedicine = {
            name: medicineForm.name,
            genericName: medicineForm.genericName,
            category: medicineForm.category,
            brand: medicineForm.brand,
            stock: parseInt(medicineForm.stock),
            formulations: {
                tablet: parseFloat(medicineForm.formulations.tablet) || 0,
                syrup: parseFloat(medicineForm.formulations.syrup) || 0,
                capsule: parseFloat(medicineForm.formulations.capsule) || 0,
                injection: parseFloat(medicineForm.formulations.injection) || 0,
            },
            image: medicineForm.image,
            description: medicineForm.description,
            email: user?.email,
        };

        try {
            const res = await fetch('http://localhost:3000/medicines-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMedicine),
            });

            if (!res.ok) {
                throw new Error('Failed to add medicine');
            }

            const data = await res.json();

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Medicine added successfully!',
                timer: 2000,
                showConfirmButton: false,
            });

            // Close modal
            document.getElementById('medicine_modal').close();

            // Reset form
            setMedicineForm({
                name: '',
                genericName: '',
                category: '',
                brand: '',
                stock: '',
                formulations: {
                    tablet: '',
                    syrup: '',
                    capsule: '',
                    injection: '',
                },
                image: '',
                description: '',
            });

            setMedicines(prev => [...prev, { ...newMedicine, _id: data.insertedId }]);

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error adding medicine. Please try again.',
            });
        }
    };

    const handleDelete = async (_id) => {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: "This action can't be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmed.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:3000/medicines-data/${_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Medicine has been deleted.',
                        timer: 2000,
                        showConfirmButton: false,
                    });

                    // ⬇️ Update UI: remove deleted item from local state
                    setMedicines(prev => prev.filter(med => med._id !== _id));

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed!',
                        text: 'Could not delete the medicine.',
                    });
                }
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong while deleting.',
                });
            }
        }
    };

    const handleOpenMedicineModal = () => {
        document.getElementById('medicine_modal').showModal();
    };

    const handleMedicineFormChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('formulations.')) {
            const key = name.split('.')[1];
            setMedicineForm((prev) => ({
                ...prev,
                formulations: {
                    ...prev.formulations,
                    [key]: value,
                },
            }));
        } else {
            setMedicineForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        fetch('http://localhost:3000/medicines')
            .then(res => res.json())
            .then(data => setCategoryOptions(data))
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/medicines-data')
            .then(res => res.json())
            .then(data => setCompaniesOptions(data))
    }, [])

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const res = await axios.get('http://localhost:3000/medicines-data');
                const filtered = res.data.filter(med => med.email === user.email);
                setMedicines(filtered);
            } catch (error) {
                console.error("Error fetching medicines:", error);
            }
        };

        if (user?.email) {
            fetchMedicines();
        }
    }, [user?.email]);





    // {Payment Related Function}

    const [payments, setPayments] = useState([]);

    useEffect(() => {
        if (!user?.email) return;

        fetch('http://localhost:3000/orders')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const userPayments = data.orders.filter(
                        order => order.items.some(item => item.email === user.email)
                    );
                    setPayments(userPayments);
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, [user?.email]);



    const [companiesOptions, setCompaniesOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [medicine, setMedicine] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [advertisements, setAdvertisements] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const advertisementData = {
            sellerEmail: user.email,
            medicine,
            imageUrl,
            description,
            status: "pending",
            inSlider: false,
        };

        try {
            const res = await fetch("http://localhost:3000/advertisements", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(advertisementData),
            });

            const data = await res.json();
            if (res.ok) {
                Swal.fire({
                    title: "Success!",
                    text: "Advertisement submitted successfully!",
                    icon: "success",
                    confirmButtonColor: "#14b8a6",
                });

                setMedicine("");
                setImageUrl("");
                setDescription("");
                document.getElementById("advertise_modal").close();
            } else {
                Swal.fire({
                    title: "Failed!",
                    text: data.message || "Failed to submit advertisement.",
                    icon: "error",
                    confirmButtonColor: "#ef4444", //
                });
            }
        } catch (error) {
            console.error("Error submitting ad:", error);
            Swal.fire({
                title: "Error!",
                text: "Something went wrong while submitting.",
                icon: "error",
                confirmButtonColor: "#ef4444", // 
            });
        }
    };


    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                const res = await fetch("http://localhost:3000/advertisements");
                const data = await res.json();

                // If you only want to show ads submitted by the current seller:
                const userAds = data.filter(ad => ad.sellerEmail === user.email);

                setAdvertisements(userAds); // Or setAdvertisements(data) for all ads
            } catch (error) {
                console.error("Failed to fetch ads:", error);
            }
        };

        fetchAdvertisements();
    }, [user?.email]);



    if (!user) {
        return <RouteChangeSpinner />;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <ReTitle title='Medi Hurt | Seller'></ReTitle>
            {/* Mobile menu button */}
            {isSmallScreen && (
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="fixed top-4 left-4 z-50 p-2 rounded-md bg-teal-600 text-white"
                >
                    {mobileMenuOpen ? <Close /> : <Menu />}
                </button>
            )}

            {/* Sidebar Navigation */}
            <div
                className={`${isSmallScreen ?
                    `fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                    transition-transform duration-300 ease-in-out z-40` :
                    'flex-shrink-0'} 
                    bg-teal-900 border-r px-3 border-border-teal-700`}
            >
                <div className="p-4 flex justify-center items-center flex-col">
                    <h1 className="text-xl text-white mt-2 font-bold">Seller Panel</h1>
                    <p className='text-sm text-white'>{user.email}</p>
                    <Link to={'/'}
                        className="mt-2 flex items-center justify-center text-white hover:text-teal-200"
                    >
                        <HomeIcon className="mr-1" />
                        <span className="text-sm mt-1">Go to Home</span>
                    </Link>
                </div>
                <div className="border-t border-gray-200"></div>
                <nav>
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleTabChange(item.id)}
                                    className={`rounded-2xl my-2 bg-teal-600 w-full border text-white flex items-center px-4 py-2 text-left ${activeTab === item.id ? 'bg-teal-800' : 'text-gray-700 hover:bg-teal-800'}`}
                                >
                                    {item.icon}
                                    {item.text}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Overlay for mobile menu */}
            {isSmallScreen && mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-transparent backdrop-blur-md z-30"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={`flex-1 overflow-auto ${isSmallScreen && mobileMenuOpen ? 'ml-64' : ''}`}>
                <div className="p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold ml-15 mt-2 md:ml-0 md:mt-0 mb-4 sm:mb-6">
                        {menuItems.find(item => item.id === activeTab)?.text || 'Seller Dashboard'}
                    </h1>

                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Sales Overview</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                    <h3 className="text-gray-500 text-sm uppercase font-medium mb-2">Total Revenue</h3>
                                    <p className="text-2xl sm:text-3xl font-bold">৳{salesData.totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                    <h3 className="text-gray-500 text-sm uppercase font-medium mb-2">Paid Total</h3>
                                    <p className="text-2xl sm:text-3xl font-bold text-green-600">৳{salesData.paidTotal.toLocaleString()}</p>
                                </div>
                                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                    <h3 className="text-gray-500 text-sm uppercase font-medium mb-2">Pending Total</h3>
                                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">৳{salesData.pendingTotal.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Line Chart */}
                            <div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full max-w-4xl mx-auto">
                                <h3 className="text-gray-500 text-sm uppercase font-medium mb-4 text-center">
                                    Revenue Trend
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={lineChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={value => `৳${value.toLocaleString()}`}
                                            labelFormatter={label => `Date: ${label}`}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="paid" stroke="#16A34A" name="Paid" />
                                        <Line
                                            type="monotone"
                                            dataKey="pending"
                                            stroke="#F59E0B"
                                            name="Pending"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'medicines' && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                <h2 className="text-xl sm:text-2xl font-semibold">Manage Medicines</h2>
                                <button
                                    onClick={handleOpenMedicineModal}
                                    className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm sm:text-base"
                                >
                                    <AddCircleOutline className="mr-1 sm:mr-2" />
                                    Add Medicine
                                </button>
                            </div>
                            <div className="bg-white rounded-lg shadow overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {medicines.map(medicine => (
                                            <tr key={medicine._id}>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medicine.name}</td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medicine.brand || '-'}</td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <img
                                                        src={medicine.image || 'https://via.placeholder.com/150'}
                                                        alt={medicine.name}
                                                        className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medicine.stock}</td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        className="text-teal-600 px-2 rounded-md border-2 hover:text-white hover:bg-teal-600 mr-3 sm:mr-4"
                                                        onClick={() => {
                                                            setSelectedMedicine(medicine);
                                                            document.getElementById('edit_modal').showModal();
                                                        }}
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="text-red-600 px-2 rounded-md border-2 hover:text-white hover:bg-red-600"
                                                        onClick={() => handleDelete(medicine._id)}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}
                                        {medicines.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                                                    No medicines found. Add your first medicine.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Payment History</h2>
                            <div className="bg-white rounded-lg shadow overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map(payment => (
                                            <tr key={payment._id}>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.transactionId}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.items.map(item => item.name).join(', ')}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.email}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ৳{payment.amountPaid.toFixed(2)}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(payment.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.status === 'paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'advertisements' && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                <h2 className="text-xl sm:text-2xl font-semibold">Advertisement Requests</h2>
                                <button
                                    className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm sm:text-base"
                                    onClick={() => document.getElementById('advertise_modal').showModal()}
                                >
                                    <AddCircleOutline className="mr-1 sm:mr-2" />
                                    Request Advertisement
                                </button>
                            </div>
                            <div className="bg-white rounded-lg shadow overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Slider</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {advertisements.map(ad => (
                                            <tr key={ad._id}>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ad.medicine}</td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <img
                                                        src={ad.imageUrl}
                                                        alt={ad.medicine}
                                                        className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{ad.description}</td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ad.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        ad.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {ad.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {ad.inSlider ? 'Yes' : 'No'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Medicine Modal */}
                    <dialog id="medicine_modal" className="modal">
                        <div className="modal-box bg-white max-w-2xl">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-red-600">✕</button>
                            </form>
                            <h3 className="font-bold text-2xl">
                                Add New Medicine
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Medicine Name*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter medicine name"
                                            className="input input-bordered w-full border"
                                            name="name"
                                            value={medicineForm.name}
                                            onChange={handleMedicineFormChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Generic Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter generic name"
                                            className="input input-bordered w-full border"
                                            name="genericName"
                                            value={medicineForm.genericName}
                                            onChange={handleMedicineFormChange}
                                        />
                                    </div>

                                    {/* Category Select Field */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Category*</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            name="category"
                                            value={medicineForm.category}
                                            onChange={handleMedicineFormChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categoryOptions.map(categoryOption => (
                                                <option key={categoryOption.id} value={categoryOption.name}>
                                                    {categoryOption.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Brand*</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            name="brand"
                                            value={medicineForm.brand}
                                            onChange={handleMedicineFormChange}
                                            required
                                        >
                                            <option value="">Select Brand</option>
                                            {companiesOptions.map(company => (
                                                <option key={company._id} value={company.brand}>
                                                    {company.brand}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Stock*</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter stock quantity"
                                            className="input input-bordered w-full border"
                                            name="stock"
                                            value={medicineForm.stock}
                                            onChange={handleMedicineFormChange}
                                            min="0"
                                            required
                                        />
                                    </div>



                                    {/* Formulations */}
                                    <div className="form-control md:col-span-2 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">
                                                <span className="label-text">Tablet Price (৳)</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Tablet price"
                                                className="input input-bordered w-full border"
                                                name="formulations.tablet"
                                                value={medicineForm.formulations.tablet}
                                                onChange={handleMedicineFormChange}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">
                                                <span className="label-text">Syrup Price (৳)</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Syrup price"
                                                className="input input-bordered w-full border"
                                                name="formulations.syrup"
                                                value={medicineForm.formulations.syrup}
                                                onChange={handleMedicineFormChange}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">
                                                <span className="label-text">Capsule Price (৳)</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Capsule price"
                                                className="input input-bordered w-full border"
                                                name="formulations.capsule"
                                                value={medicineForm.formulations.capsule}
                                                onChange={handleMedicineFormChange}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">
                                                <span className="label-text">Injection Price (৳)</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Injection price"
                                                className="input input-bordered w-full border"
                                                name="formulations.injection"
                                                value={medicineForm.formulations.injection}
                                                onChange={handleMedicineFormChange}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    {/* Image URL Field */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Image URL*</span>
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="Enter image URL"
                                            className="input input-bordered w-full"
                                            name="image"
                                            value={medicineForm.image}
                                            onChange={handleMedicineFormChange}
                                            required
                                        />
                                    </div>

                                    {/* Image Preview */}
                                    {medicineForm.image && (
                                        <div className="flex justify-center">
                                            <img
                                                src={medicineForm.image}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/150';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Full width description field */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Description</span>
                                    </label>
                                    <textarea
                                        placeholder="Enter medicine description"
                                        className="textarea textarea-bordered w-full border"
                                        name="description"
                                        value={medicineForm.description}
                                        onChange={handleMedicineFormChange}
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="modal-action">
                                <button
                                    className={`btn btn-primary rounded-lg text-teal-600 border-2 border-teal-800 ${(
                                        !medicineForm.name ||
                                        !medicineForm.genericName ||
                                        !medicineForm.category ||
                                        !medicineForm.brand ||
                                        !medicineForm.stock
                                    ) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={handleSaveMedicine}
                                    disabled={
                                        !medicineForm.name ||
                                        !medicineForm.genericName ||
                                        !medicineForm.category ||
                                        !medicineForm.brand ||
                                        !medicineForm.stock
                                    }
                                >
                                    Save
                                </button>

                            </div>
                        </div>
                    </dialog>

                    {/* Medicine Edit Modal */}
                    <dialog id="edit_modal" className="modal">
                        <div className="modal-box w-full max-w-md bg-white">
                            <h3 className="font-bold text-lg mb-4">Edit Medicine</h3>

                            {selectedMedicine && (
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.target;
                                        const updatedMedicine = {
                                            name: form.name.value,
                                            brand: form.brand.value,
                                            stock: Number(form.stock.value),
                                            image: form.image.value,
                                        };

                                        try {
                                            const res = await fetch(`http://localhost:3000/medicines-data/${selectedMedicine._id}`, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(updatedMedicine),
                                            });

                                            if (res.ok) {
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Updated!',
                                                    text: 'Medicine updated successfully',
                                                    timer: 2000,
                                                    showConfirmButton: false,
                                                });
                                                document.getElementById('edit_modal').close();
                                                // optionally refetch data here
                                            } else {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Oops...',
                                                    text: 'Failed to update the medicine.',
                                                });
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Error',
                                                text: 'Something went wrong while updating.',
                                            });
                                        }
                                    }}
                                    className="space-y-3"
                                >

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={selectedMedicine.name}
                                            className="input input-bordered w-full border"
                                            placeholder="Name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            defaultValue={selectedMedicine.brand}
                                            className="input input-bordered w-full border"
                                            placeholder="Brand"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            defaultValue={selectedMedicine.stock}
                                            className="input input-bordered w-full border"
                                            placeholder="Stock"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            name="image"
                                            defaultValue={selectedMedicine.image}
                                            className="input input-bordered w-full border"
                                            placeholder="Image URL"
                                        />
                                    </div>
                                    <div className="modal-action">
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-lg text-teal-600 border-2 border-teal-600 hover:text-white hover:bg-teal-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            className="btn text-red-600 border-2 border-red-600 rounded-lg hover:text-white hover:bg-red-600"
                                            onClick={() => document.getElementById('edit_modal').close()}
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                </form>
                            )}
                        </div>
                    </dialog>


                    {/* Advertisement Modal */}
                    <dialog id="advertise_modal" className="modal">
                        <div className="modal-box relative bg-white">
                            <form method="dialog" className="absolute right-2 top-2">
                                <button className="text-gray-500 hover:text-red-500 text-xl">
                                    <IoClose />
                                </button>
                            </form>

                            <h3 className="font-bold text-lg mb-2">Request Advertisement</h3>

                            <form className="space-y-3" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Medicine Name"
                                    className="input input-bordered w-full border"
                                    value={medicine}
                                    onChange={(e) => setMedicine(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    className="input input-bordered w-full border"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    className="textarea textarea-bordered w-full border"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>

                                <button
                                    type="submit"
                                    className="btn btn-primary text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white border-2 border-teal-600 w-full"
                                >
                                    Submit Advertisement
                                </button>
                            </form>
                        </div>

                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>



                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;