import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../Provider/CartProvider';
import { ReTitle } from 're-title';

const Cart = () => {
    const { cartItems, cartTotal, cartItemCount, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    return (
        <div className="container bg-none w-11/12 mx-auto py-8 min-h-screen">
            <ReTitle title='Medi Hurt | Cart'></ReTitle>
            <h1 className="text-3xl text-teal-900 font-bold mb-8 text-center">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
                    <Link to="/shop" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 bg-none lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-none">
                        <div className="rounded-lg shadow-md">
                            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={`${item._id}-${item.formulationType}`} className="p-4 flex  gap-4 border-2 mt-2 rounded-2xl border-teal-600 ">
                                        <img
                                            src={item.image || '/default-medicine.png'}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.src = '/default-medicine.png';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <p className="text-gray-600">{item.formulationType}</p>
                                            <p className="text-teal-600 font-medium">৳{item.selectedPrice?.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center rounded-lg border-2 border-teal-600">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.formulationType, item.quantity - 1)}
                                                    className="px-3 py-1 text-lg"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 py-1">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.formulationType, item.quantity + 1)}
                                                    className="px-3 py-1 text-lg"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id, item.formulationType)}
                                                className="bg-white text-red-600 px-3 py-1 rounded-lg hover:bg-red-700 hover:text-white border-2 border-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-2 border-teal-600 rounded-xl">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal ({cartItemCount} items)</span>
                                    <span className="font-medium">৳{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-medium">৳0.00</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>৳{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <Link to={'/checkout'}
                                className="btn btn-primary text-teal-600 hover:bg-teal-600 hover:text-white w-full mt-6 rounded-xl border-teal-600"
                            >
                                Proceed to Checkout
                            </Link>
                            <Link to="/shop" className="btn btn-outline w-full rounded-xl border-teal-600 bg-teal-600 text-white hover:bg-teal-700 mt-4">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;