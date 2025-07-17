import { useState, useEffect } from 'react';
import {
    Dashboard,
    ShoppingCart,
    Payment,
    History,
    Menu,
    Close
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Swal from 'sweetalert2';
import useAuth from '../Hooks/UseAuth';
import RouteChangeSpinner from '../Loading/RouteChangeSpinner';

const UserDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(() => {
        const savedTab = localStorage.getItem('userActiveTab');
        return savedTab || 'dashboard';
    });
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!user?.email) return; // wait for user to load

        fetch('http://localhost:3000/orders')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // filter orders where either:
                    // 1. The order email matches user email, OR
                    // 2. Any item in the order has email matching user email
                    const userPayments = data.orders.filter(
                        order => order.email === user.email
                    );
                    setPaymentHistory(userPayments);
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, [user?.email]);

    if (!user) {
        return <RouteChangeSpinner />
    }

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        localStorage.setItem('userActiveTab', tabId);
        if (isSmallScreen) setMobileMenuOpen(false);
    };

    const filteredPayments = paymentHistory.filter(payment => {
        if (!dateRange[0] || !dateRange[1]) return true;
        const paymentDate = new Date(payment.date);
        return paymentDate >= dateRange[0] && paymentDate <= dateRange[1];
    });



    const menuItems = [
        { id: 'dashboard', text: 'Dashboard', icon: <Dashboard className="mr-3" /> },
        { id: 'payments', text: 'Payment History', icon: <Payment className="mr-3" /> },
        { id: 'orders', text: 'My Orders', icon: <ShoppingCart className="mr-3" /> },
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
                    w-64 bg-teal-900 border-r px-3 border-border-teal-700`}
            >
                <div className="p-4 text-center">
                    <h1 className="text-xl text-white mt-2 font-bold">User Panel</h1>
                    <p className='text-white text-sm'>{user?.email}</p>
                </div>
                <div className="border-t border-gray-200"></div>
                <nav>
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleTabChange(item.id)}
                                    className={`rounded-2xl my-2 w-full border text-white flex items-center px-4 py-2 text-left ${activeTab === item.id ? 'bg-teal-800' : 'bg-teal-600 hover:bg-teal-700'}`}
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
                    className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-50 z-30"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={`flex-1 overflow-auto ${isSmallScreen && mobileMenuOpen ? 'ml-64' : ''}`}>
                <div className="p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold ml-15 mt-2 md:ml-0 md:mt-0 mb-4 sm:mb-6">
                        {menuItems.find(item => item.id === activeTab)?.text || 'User Dashboard'}
                    </h1>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && (
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Overview</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                            <h3 className="text-gray-500 text-sm uppercase font-medium mb-2">Total Orders</h3>
                                            <p className="text-2xl sm:text-3xl font-bold">{paymentHistory.length}</p>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                            <h3 className="text-gray-500 text-sm uppercase font-medium mb-2">Completed Orders</h3>
                                            <p className="text-2xl sm:text-3xl font-bold text-green-600">
                                                {paymentHistory.filter(p => p.status === 'paid').length}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                                            <h3 className="text-gray-500 text-sm uppercase font-medium mb-2">Pending Orders</h3>
                                            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                                                {paymentHistory.filter(p => p.status === 'pending').length}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                                        {paymentHistory.slice(0, 3).map(order => (
                                            <div key={order._id} className="mb-4 pb-4 border-b last:border-b-0">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">Order #{order.transactionId}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(order.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm">৳{order.amountPaid.toFixed(2)} • {order.items.length} items</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'payments' && (
                                <div>
                                    <div className="flex flex-col gap-4 mb-4">
                                        <h2 className="text-xl sm:text-2xl font-semibold">Payment History</h2>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <DatePicker
                                                    label="Start Date"
                                                    value={dateRange[0]}
                                                    onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                                                    className="w-full"
                                                />
                                                <DatePicker
                                                    label="End Date"
                                                    value={dateRange[1]}
                                                    onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                                                    className="w-full"
                                                />
                                            </div>
                                        </LocalizationProvider>
                                    </div>
                                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredPayments.length > 0 ? (
                                                    filteredPayments.map(payment => (
                                                        <tr key={payment._id}>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {payment.transactionId}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {new Date(payment.date).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                                                                {payment.items.map(m => m.name).join(', ')}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                ৳{payment.amountPaid.toFixed(2)}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {payment.paymentType}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.status === 'paid'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : payment.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                    {payment.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                                                            No payments found for the selected date range
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">My Orders</h2>
                                    <div className="space-y-4">
                                        {paymentHistory.length > 0 ? (
                                            paymentHistory.map(order => (
                                                <div key={order._id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                                                        <div>
                                                            <h3 className="font-semibold">Order #{order.transactionId}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(order.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 sm:mt-0 ${order.status === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <div className="border-t border-gray-200 my-3"></div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-500">Items</h4>
                                                            <ul className="mt-1 space-y-1">
                                                                {order.items.map((item, index) => (
                                                                    <li key={index} className="text-sm">
                                                                        {item.name} × {item.quantity}
                                                                        (৳{item.selectedPrice ? item.selectedPrice.toFixed(2) : 'N/A'})
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-500">Payment</h4>
                                                            <p className="mt-1 text-sm">৳{order.amountPaid.toFixed(2)}</p>
                                                            <p className="text-xs text-gray-500">{order.paymentType}</p>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-500">Delivery</h4>
                                                            <p className="mt-1 text-sm">
                                                                {order.address}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {order.status === 'paid' ? 'Delivery successful' : 'Your medicine will be delivered into 2-3 days'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-gray-200 my-3"></div>

                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                                <h3 className="text-lg font-medium text-gray-700 mb-2">No orders found</h3>
                                                <p className="text-gray-500 mb-4">
                                                    You haven't placed any orders yet
                                                </p>
                                                <button
                                                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                                    onClick={() => Swal.fire('Info', 'Redirect to shop page would happen here', 'info')}
                                                >
                                                    Shop Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;