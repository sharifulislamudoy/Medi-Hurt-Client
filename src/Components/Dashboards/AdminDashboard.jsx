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

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [salesData, setSalesData] = useState({
        totalRevenue: 12500,
        paidTotal: 9800,
        pendingTotal: 2700
    });
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [payments, setPayments] = useState([]);
    const [sales, setSales] = useState([]);
    const [advertisements, setAdvertisements] = useState([]);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        categoryName: '',
        categoryImage: '',
        imageFile: null
    });
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Check screen size and update state
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
    },[])

    // Mock data initialization
    useEffect(() => {
        // Simulate API calls
        setLoading(true);
        setTimeout(() => {

            setPayments([
                { id: 1, orderId: 'ORD-1001', amount: 1200, status: 'paid', date: '2023-05-15' },
                { id: 2, orderId: 'ORD-1002', amount: 800, status: 'pending', date: '2023-05-16' },
                { id: 3, orderId: 'ORD-1003', amount: 1500, status: 'pending', date: '2023-05-17' }
            ]);

            setSales([
                { id: 1, medicine: 'Paracetamol', seller: 'seller1@example.com', buyer: 'customer1@example.com', price: 120, date: '2023-05-10' },
                { id: 2, medicine: 'Amoxicillin', seller: 'seller2@example.com', buyer: 'customer2@example.com', price: 350, date: '2023-05-11' },
                { id: 3, medicine: 'Vitamin C', seller: 'seller1@example.com', buyer: 'customer3@example.com', price: 200, date: '2023-05-12' }
            ]);

            setAdvertisements([
                { id: 1, medicine: 'Paracetamol', description: 'Effective pain reliever', seller: 'seller1@example.com', imageUrl: 'https://example.com/paracetamol.jpg', inSlider: true },
                { id: 2, medicine: 'Vitamin D', description: 'Boosts immunity', seller: 'seller2@example.com', imageUrl: 'https://example.com/vitamind.jpg', inSlider: false }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            // Check if userId is valid
            if (!userId) {
                throw new Error('Invalid user ID');
            }

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
            console.log('Role updated successfully');

        } catch (error) {
            console.error('Error updating role:', error);
            // Show error message to user
            alert(error.message || 'Failed to update role');
        }
    };

    const handleOpenCategoryModal = (category = null) => {
        if (category) {
            setCategoryForm({
                categoryName: category.name,
                categoryImage: category.imageUrl,
                imageFile: null
            });
            setEditCategoryId(category.id);
        } else {
            setCategoryForm({
                categoryName: '',
                categoryImage: '',
                imageFile: null
            });
            setEditCategoryId(null);
        }
        setOpenCategoryModal(true);
    };

    const handleCloseCategoryModal = () => {
        setOpenCategoryModal(false);
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

    const handleSaveCategory = () => {
        if (editCategoryId) {
            // Update existing category
            setCategories(categories.map(cat =>
                cat.id === editCategoryId
                    ? { ...cat, name: categoryForm.categoryName, imageUrl: categoryForm.categoryImage }
                    : cat
            ));
        } else {
            // Add new category
            const newCategory = {
                id: categories.length + 1,
                name: categoryForm.categoryName,
                imageUrl: categoryForm.categoryImage
            };
            setCategories([...categories, newCategory]);
        }
        setOpenCategoryModal(false);
    };

    const handleDeleteCategory = (categoryId) => {
        setCategories(categories.filter(cat => cat.id !== categoryId));
    };

    const handlePaymentStatusChange = (paymentId) => {
        setPayments(payments.map(payment =>
            payment.id === paymentId ? { ...payment, status: 'paid' } : payment
        ));
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

    const filteredSales = sales.filter(sale => {
        if (!dateRange[0] || !dateRange[1]) return true;
        const saleDate = new Date(sale.date);
        return saleDate >= dateRange[0] && saleDate <= dateRange[1];
    });

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
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        if (isSmallScreen) setMobileMenuOpen(false);
                                    }}
                                    className={`rounded-2xl my-2 bg-teal-600 w-full  border text-white flex items-center px-4 py-2 text-left ${activeTab === item.id ? 'bg-teal-800 ' : 'text-gray-700 hover:bg-teal-800'}`}
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
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {payments.map(payment => (
                                                    <tr key={payment.id}>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.orderId}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">${payment.amount}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`font-bold ${payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                                {payment.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {payment.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handlePaymentStatusChange(payment.id)}
                                                                    className="flex items-center px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm"
                                                                >
                                                                    <CheckCircle className="mr-1" fontSize="small" />
                                                                    Accept
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

                    {/* Category Modal */}
                    {openCategoryModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                <div className="p-4 border-b">
                                    <h2 className="text-xl font-semibold">{editCategoryId ? 'Edit Category' : 'Add New Category'}</h2>
                                </div>
                                <div className="p-4 sm:p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                        <input
                                            type="text"
                                            name="categoryName"
                                            value={categoryForm.categoryName}
                                            onChange={handleCategoryFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                            required
                                        />
                                    </div>
                                    {categoryForm.categoryImage && (
                                        <div className="flex justify-center">
                                            <img
                                                src={categoryForm.categoryImage}
                                                alt="Preview"
                                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                                        <label className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm sm:text-base">
                                            <span>Choose File</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                    <div className="text-center text-gray-500 text-sm">OR</div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter image URL</label>
                                        <input
                                            type="text"
                                            name="categoryImage"
                                            value={categoryForm.categoryImage}
                                            onChange={handleCategoryFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 border-t flex justify-end space-x-3">
                                    <button
                                        onClick={handleCloseCategoryModal}
                                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm sm:text-base"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveCategory}
                                        disabled={!categoryForm.categoryName || !categoryForm.categoryImage}
                                        className={`px-3 py-2 rounded-md ${(!categoryForm.categoryName || !categoryForm.categoryImage) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm sm:text-base`}
                                    >
                                        {editCategoryId ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;