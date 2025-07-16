import { useState, useEffect } from 'react';
import {
    Dashboard,
    People,
    Category,
    Payment,
    Assessment,
    Campaign,
    AddCircleOutline,
    Edit,
    Delete,
    CheckCircle,
    FileDownload,
    Menu,
    Close
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AdminDashboard = () => {

    const [activeTab, setActiveTab] = useState(() => {
        // Try to get the saved tab from localStorage
        const savedTab = localStorage.getItem('adminActiveTab');
        return savedTab || 'dashboard';
    });
    const [salesData, setSalesData] = useState({
        totalRevenue: 0,
        paidTotal: 0,
        pendingTotal: 0,
    });
    const [chartData, setChartData] = useState([]);


    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [payments, setPayments] = useState([]);
    const [advertisements, setAdvertisements] = useState([]);
    const [categoryForm, setCategoryForm] = useState({
        categoryName: '',
        categoryId: '',
        categoryDescription: '',
        categoryImage: '',
        imageFile: null
    });
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // md breakpoint
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/users')
            .then(res => res.json())
            .then(data => setUsers(data))
    }, [])

    useEffect(() => {
        fetch('http://localhost:3000/medicines')
            .then(res => res.json())
            .then(data => setCategories(data))
    }, [])

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/orders');
                if (!response.ok) throw new Error('Failed to fetch payments');
                const data = await response.json();
                setPayments(data.orders || []);
            } catch (error) {
                console.error('Error fetching payments:', error);
                Swal.fire('Error', 'Failed to load payment data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const [filteredSales, setFilteredSales] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        fetch('http://localhost:3000/orders')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const allOrders = data.orders;

                    // Flatten order items into individual sale records
                    const flattenedSales = allOrders.flatMap(order => {
                        return order.items.map(item => ({
                            id: `${order._id}-${item._id}`, // unique key
                            medicine: item.name,
                            seller: item.email,
                            buyer: order.email,
                            price: item.selectedPrice,
                            date: new Date(order.date).toLocaleDateString(),
                        }));
                    });


                    setFilteredSales(flattenedSales); // default view without filters
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:3000/orders");
                const orders = response.data.orders;

                let totalRevenue = 0;
                let paidTotal = 0;
                let pendingTotal = 0;

                orders.forEach(order => {
                    const amount = parseFloat(order.amountPaid || 0);
                    totalRevenue += amount;

                    if (order.status === "paid") {
                        paidTotal += amount;
                    } else if (order.status === "pending") {
                        pendingTotal += amount;
                    }
                });

                setSalesData({ totalRevenue, paidTotal, pendingTotal });

                // For chart
                setChartData([
                    { name: "Total", amount: totalRevenue },
                    { name: "Paid", amount: paidTotal },
                    { name: "Pending", amount: pendingTotal },
                ]);
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };

        fetchOrders();
    }, []);;


    // Mock data initialization
    useEffect(() => {
        // Simulate API calls
        setLoading(true);
        setTimeout(() => {


            // setSales([
            //     { id: 1, medicine: 'Paracetamol', seller: 'seller1@example.com', buyer: 'customer1@example.com', price: 120, date: '2023-05-10' },
            //     { id: 2, medicine: 'Amoxicillin', seller: 'seller2@example.com', buyer: 'customer2@example.com', price: 350, date: '2023-05-11' },
            //     { id: 3, medicine: 'Vitamin C', seller: 'seller1@example.com', buyer: 'customer3@example.com', price: 200, date: '2023-05-12' }
            // ]);

            setAdvertisements([
                { id: 1, medicine: 'Paracetamol', description: 'Effective pain reliever', seller: 'seller1@example.com', imageUrl: 'https://example.com/paracetamol.jpg', inSlider: true },
                { id: 2, medicine: 'Vitamin D', description: 'Boosts immunity', seller: 'seller2@example.com', imageUrl: 'https://example.com/vitamind.jpg', inSlider: false }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        localStorage.setItem('adminActiveTab', tabId);
        if (isSmallScreen) setMobileMenuOpen(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            // Check if userId is valid
            if (!userId) {
                throw new Error('Invalid user ID');
            }

            const result = await Swal.fire({
                title: 'Confirm Role Change',
                text: `Are you sure you want to change this user's role to ${newRole}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, change it!'
            });

            if (!result.isConfirmed) return;

            const response = await fetch(`http://localhost:3000/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update role');
            }

            // Update local state
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));

            // Show success message
            await Swal.fire(
                'Updated!',
                `User role has been changed to ${newRole}`,
                'success'
            );

        } catch (error) {
            console.error('Error updating role:', error);
            await Swal.fire(
                'Error!',
                error.message || 'Failed to update role',
                'error'
            );
        }
    };

    const handleOpenCategoryModal = (category = null) => {
        if (category) {
            setCategoryForm({
                categoryId: category.id || category._id, // Handle both cases
                categoryName: category.name,
                categoryDescription: category.description || '',
                categoryImage: category.image,
                imageFile: null
            });
            setEditCategoryId(category.id || category._id);
        } else {
            setCategoryForm({
                categoryId: '',
                categoryName: '',
                categoryDescription: '',
                categoryImage: '',
                imageFile: null
            });
            setEditCategoryId(null);
        }
        document.getElementById('category_modal').showModal();
    };


    const handleCategoryFormChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCategoryForm(prev => ({ ...prev, imageFile: file, categoryImage: imageUrl }));
        }
    };

    const handleSaveCategory = async () => {
        try {
            // Validate form data
            if (!categoryForm.categoryName || !categoryForm.categoryImage) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Category name and image are required',
                });
                return;
            }

            setLoading(true);

            const categoryData = {
                name: categoryForm.categoryName,
                description: categoryForm.categoryDescription || '',
                image: categoryForm.categoryImage
            };

            let response;

            if (editCategoryId) {
                // Update existing category
                response = await fetch(`http://localhost:3000/categories/${categoryForm.categoryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(categoryData),
                });
            } else {
                // Create new category
                categoryData.id = categoryForm.categoryId || generateUniqueId(); // Add ID generation if needed
                response = await fetch('http://localhost:3000/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(categoryData),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save category');
            }

            const data = await response.json();

            // Update local state
            if (editCategoryId) {
                setCategories(categories.map(cat =>
                    cat.id === categoryForm.categoryId ? data.category : cat
                ));
            } else {
                setCategories([...categories, data.category]);
            }

            document.getElementById('category_modal').close();
            await Swal.fire({
                icon: 'success',
                title: editCategoryId ? 'Updated!' : 'Created!',
                text: editCategoryId
                    ? 'Category has been updated successfully'
                    : 'New category has been created successfully',
            });

            // Reset form
            setCategoryForm({
                categoryId: '',
                categoryName: '',
                categoryDescription: '',
                categoryImage: '',
                imageFile: null
            });
            setEditCategoryId(null);
        } catch (error) {
            console.error('Error saving category:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to save category',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/categories/${categoryId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete category');
                }

                // Update local state
                setCategories(categories.filter(cat => cat.id !== categoryId));

                // Show success message
                Swal.fire(
                    'Deleted!',
                    'The category has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting category:', error);
                Swal.fire(
                    'Error!',
                    error.message || 'Failed to delete category',
                    'error'
                );
            }
        }
    };

    const handlePaymentStatusChange = async (paymentId) => {
        try {
            const result = await Swal.fire({
                title: 'Confirm Payment',
                text: 'Are you sure you want to mark this payment as paid?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, mark as paid'
            });

            if (!result.isConfirmed) return;

            setLoading(true);

            // Update payment status in backend
            const response = await fetch(`http://localhost:3000/orders/${paymentId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'paid' }),
            });

            if (!response.ok) {
                throw new Error('Failed to update payment status');
            }

            // Update local state
            setPayments(payments.map(payment =>
                payment._id === paymentId ? { ...payment, status: 'paid' } : payment
            ));

            Swal.fire(
                'Updated!',
                'Payment status has been updated to paid.',
                'success'
            );
        } catch (error) {
            console.error('Error updating payment status:', error);
            Swal.fire(
                'Error!',
                error.message || 'Failed to update payment status',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAdvertiseToggle = (adId) => {
        setAdvertisements(advertisements.map(ad =>
            ad.id === adId ? { ...ad, inSlider: !ad.inSlider } : ad
        ));
    };

    const handleDownloadReport = (format) => {
        // In a real app, this would generate and download the report
        console.log(`Downloading report in ${format} format`);
    };



    const menuItems = [
        { id: 'dashboard', text: 'Dashboard', icon: <Dashboard className="mr-3" /> },
        { id: 'users', text: 'Manage Users', icon: <People className="mr-3" /> },
        { id: 'categories', text: 'Manage Categories', icon: <Category className="mr-3" /> },
        { id: 'payments', text: 'Payment Management', icon: <Payment className="mr-3" /> },
        { id: 'sales', text: 'Sales Report', icon: <Assessment className="mr-3" /> },
        { id: 'advertisements', text: 'Manage Banner Ads', icon: <Campaign className="mr-3" /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
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
                <div className="p-4 text-center">
                    <h1 className="text-xl text-white mt-2 font-bold">Admin Panel</h1>
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
                    className="fixed inset-0 bg-transparent backdrop-blur-md  z-30"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={`flex-1 overflow-auto ${isSmallScreen && mobileMenuOpen ? 'ml-64' : ''}`}>
                <div className="p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold ml-15 mt-2 md:ml-0 md:mt-0 mb-4 sm:mb-6">
                        {menuItems.find(item => item.id === activeTab)?.text || 'Admin Dashboard'}
                    </h1>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && (
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Sales Overview</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                            <h3 className="text-gray-500 text-sm uppercase font-medium mb-2">Total Revenue</h3>
                                            <p className="text-2xl sm:text-3xl font-bold">${salesData.totalRevenue.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                            <h3 className="text-gray-500 text-sm uppercase font-medium mb-2">Paid Total</h3>
                                            <p className="text-2xl sm:text-3xl font-bold text-green-600">${salesData.paidTotal.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                            <h3 className="text-gray-500 text-sm uppercase font-medium mb-2">Pending Total</h3>
                                            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">${salesData.pendingTotal.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Chart */}
                                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                        <h3 className="text-gray-500 text-sm uppercase font-medium mb-4">Sales Chart</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis tickFormatter={(value) => `$${value}`} />
                                                <Tooltip formatter={(value) => `$${value}`} />
                                                <Legend />
                                                <Bar dataKey="amount" fill="#6366f1" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}


                            {activeTab === 'users' && (
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Manage Users</h2>
                                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Role</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users.map(user => (
                                                    <tr key={user._id}>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._id}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                                className="block w-full pl-3 pr-8 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="seller">Seller</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'categories' && (
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                        <h2 className="text-xl sm:text-2xl font-semibold">Manage Categories</h2>
                                        <button
                                            onClick={() => handleOpenCategoryModal()}
                                            className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm sm:text-base"
                                        >
                                            <AddCircleOutline className="mr-1 sm:mr-2" />
                                            Add Category
                                        </button>
                                    </div>
                                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {categories.map(category => (
                                                    <tr key={category._id}>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.name}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                            <img
                                                                src={category.image}
                                                                alt={category.name}
                                                                className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded"
                                                            />
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleOpenCategoryModal(category)}
                                                                className="text-blue-600 hover:text-blue-900 mr-3 sm:mr-4"
                                                            >
                                                                <Edit fontSize="small" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCategory(category.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Delete fontSize="small" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'payments' && (
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Payment Management</h2>
                                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {payments.map(payment => (
                                                    <tr key={payment._id}>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {payment.transactionId}
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ৳{payment.amountPaid.toFixed(2)}
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(payment.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {payment.paymentType}
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.status === 'paid'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {payment.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {payment.status === 'pending' && payment.paymentType === 'Cash on Delivery' && (
                                                                <button
                                                                    onClick={() => handlePaymentStatusChange(payment._id)}
                                                                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm"
                                                                >
                                                                    <CheckCircle className="mr-1" fontSize="small" />
                                                                    Accept Payment
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sales' && (
                                <div>
                                    <div className="flex flex-col gap-4 mb-4">
                                        <h2 className="text-xl sm:text-2xl font-semibold">Sales Report</h2>
                                        <div className="flex flex-col gap-4">
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <DatePicker
                                                        label="Start Date"
                                                        value={dateRange[0]}
                                                        onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                                                        renderInput={({ inputRef, inputProps, InputProps }) => (
                                                            <div className="flex items-center">
                                                                <input
                                                                    ref={inputRef}
                                                                    {...inputProps}
                                                                    className="border rounded-md px-3 py-2 w-full text-sm"
                                                                />
                                                                {InputProps?.endAdornment}
                                                            </div>
                                                        )}
                                                    />
                                                    <DatePicker
                                                        label="End Date"
                                                        value={dateRange[1]}
                                                        onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                                                        renderInput={({ inputRef, inputProps, InputProps }) => (
                                                            <div className="flex items-center">
                                                                <input
                                                                    ref={inputRef}
                                                                    {...inputProps}
                                                                    className="border rounded-md px-3 py-2 w-full text-sm"
                                                                />
                                                                {InputProps?.endAdornment}
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                            </LocalizationProvider>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleDownloadReport('csv')}
                                                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
                                                >
                                                    <FileDownload className="mr-1" fontSize="small" />
                                                    CSV
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadReport('pdf')}
                                                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
                                                >
                                                    <FileDownload className="mr-1" fontSize="small" />
                                                    PDF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredSales.map(sale => (
                                                    <tr key={sale.id}>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.medicine}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.seller}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.buyer}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sale.price}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'advertisements' && (
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Manage Banner Advertisements</h2>
                                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Slider</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {advertisements.map(ad => (
                                                    <tr key={ad.id}>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ad.medicine}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                            <img
                                                                src={ad.imageUrl}
                                                                alt={ad.medicine}
                                                                className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded"
                                                            />
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{ad.description}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <label className="inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={ad.inSlider}
                                                                    onChange={() => handleAdvertiseToggle(ad.id)}
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                            </label>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Add this modal component near the end of your return statement, before the closing </div> */}
                    <dialog id="category_modal" className="modal">
                        <div className="modal-box bg-white">
                            <form method="dialog">
                                {/* Close button */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-red-600">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">
                                {editCategoryId ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <div className="space-y-4 mt-4">
                                {/* Category ID Field */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Category ID</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter category ID (e.g., CAT001)"
                                        className="input input-bordered w-full border"
                                        name="categoryId"
                                        value={categoryForm.categoryId || ''}
                                        onChange={handleCategoryFormChange}
                                        pattern="[A-Za-z0-9]+"  // Example pattern
                                        title="Alphanumeric characters only"
                                        required
                                    />
                                </div>

                                {/* Category Name Field */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Category Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter category name"
                                        className="input input-bordered w-full border"
                                        name="categoryName"
                                        value={categoryForm.categoryName}
                                        onChange={handleCategoryFormChange}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Description</span>
                                    </label>
                                    <textarea
                                        placeholder="Enter category description"
                                        className="textarea textarea-bordered w-full border"
                                        name="categoryDescription"
                                        value={categoryForm.categoryDescription}
                                        onChange={handleCategoryFormChange}
                                        rows={3}
                                    />
                                </div>

                                {/* Image Preview */}
                                {categoryForm.categoryImage && (
                                    <div className="flex justify-center">
                                        <img
                                            src={categoryForm.categoryImage}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    </div>
                                )}

                                {/* Image Upload */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Upload Image</span>
                                    </label>
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>

                                <div className="text-center text-gray-500 text-sm">OR</div>

                                {/* Image URL Field */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Image URL</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter image URL"
                                        className="input input-bordered w-full border"
                                        name="categoryImage"
                                        value={categoryForm.categoryImage}
                                        onChange={handleCategoryFormChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-action">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSaveCategory}
                                    disabled={!categoryForm.categoryName || !categoryForm.categoryImage || !categoryForm.categoryId}
                                >
                                    {editCategoryId ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;