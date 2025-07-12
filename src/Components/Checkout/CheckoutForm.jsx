import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router';
import { useCart } from '../../Provider/CartProvider';
import visa from '../../assets/visa.png';
import amex from '../../assets/amex.png';
import mastercard from '../../assets/mastercard.png';
import discover from '../../assets/discover.png';
import useAuth from '../Hooks/UseAuth';

const CheckoutForm = () => {
    const { user } = useAuth();
    const { cartTotal, clearCart } = useCart();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (error) {
            console.error(error);
            alert('Payment failed. Try again.');
            return;
        }

        clearCart();
        navigate('/invoice', {
            state: {
                amountPaid: cartTotal,
                transactionId: paymentMethod.id,
                date: new Date().toLocaleString(),
            },
        });
    };

    return (
        <div className="w-11/12 mx-auto p-6 bg-white shadow-lg rounded-lg border-2 border-teal-700">

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Billing Address */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Billing Address</h3>

                    <label className="block mb-2 font-medium">👤 Full Name</label>
                    <input type="text" placeholder="Ravi Raushan" value={user?.displayName} className="w-full  border-teal-600 p-2 mb-4 border rounded focus:ring-2 focus:ring-teal-600 focus:outline-none" required />

                    <label className="block mb-2 font-medium">✉ Email</label>
                    <input type="email" placeholder="ravi@raushan.com" value={user?.email} className="w-full  border-teal-600 p-2 mb-4 border rounded focus:ring-2 focus:ring-teal-600 focus:outline-none" required />

                    <label className="block mb-2 font-medium">💳 Address</label>
                    <input type="text" placeholder="Officers Colony" className="w-full  border-teal-600 p-2 mb-4 border rounded focus:ring-2 focus:ring-teal-600 focus:outline-none" required />
                </div>

                {/* Payment Section */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Payment</h3>

                    <p className="mb-2">Accepted Cards</p>
                    <div className="flex items-center gap-2 my-5">
                        <img src={visa} alt="Visa" className="w-10" />
                        <img src={amex} alt="Amex" className="w-10" />
                        <img src={mastercard} alt="MasterCard" className="w-10" />
                        <img src={discover} alt="Discover" className="w-10" />
                    </div>

                    <label className="block mb-2 font-medium">Name on Card</label>
                    <input type="text" placeholder="Ravi Raushan" className="w-full  border-teal-600 p-2 mb-4 border rounded focus:ring-2 focus:ring-teal-600 focus:outline-none" required />

                    <label className="block mb-2 font-medium">Card Details</label>
                    <CardElement className="p-3  border border-teal-600 rounded bg-white" />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 mt-4">
                    <button
                        type="submit"
                        disabled={!stripe}
                        className=" bg-teal-600 text-white py-3 px-6 rounded font-semibold hover:bg-teal-700 transition"
                    >
                        Pay ৳{cartTotal.toFixed(2)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;
