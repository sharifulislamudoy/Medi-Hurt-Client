import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router';
import { useCart } from '../../Provider/CartProvider';
import visa from '../../assets/visa.png';
import amex from '../../assets/amex.png';
import mastercard from '../../assets/mastercard.png';
import discover from '../../assets/discover.png';
import useAuth from '../Hooks/UseAuth';
import Swal from 'sweetalert2';

const CheckoutForm = () => {
    const { user } = useAuth();
    const [cardName, setCardName] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethodType, setPaymentMethodType] = useState('card');
    const [processing, setProcessing] = useState(false);
    const { cartTotal, clearCart, cartItems } = useCart();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Validate form
        if (paymentMethodType === 'card' && !cardName) {
            Swal.fire('Error', 'Please enter the name on your card', 'error');
            setProcessing(false);
            return;
        }

        if (!address) {
            Swal.fire('Error', 'Please enter your billing address', 'error');
            setProcessing(false);
            return;
        }

        const result = await Swal.fire({
            title: 'Confirm Order',
            text: `You are about to pay ৳${cartTotal.toFixed(2)} via ${paymentMethodType === 'card' ? 'Card' : 'Cash on Delivery'}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#14b8a6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm Order',
        });

        if (!result.isConfirmed) {
            setProcessing(false);
            return;
        }

        // Handle Cash on Delivery
        if (paymentMethodType === 'cod') {
            try {
                const orderData = {
                    userId: user?.uid,
                    email: user?.email,
                    name: cardName || user?.displayName,
                    address,
                    amountPaid: cartTotal,
                    paymentType: 'Cash on Delivery',
                    status: 'pending',
                    transactionId: 'COD-' + new Date().getTime(),
                    date: new Date().toISOString(),
                    items: cartItems,
                };

                const response = await fetch('https://medi-hurt-server.vercel.app/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) throw new Error('Failed to save order');

                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed!',
                    text: 'You selected Cash on Delivery.',
                    confirmButtonColor: '#14b8a6',
                }).then(() => {
                    clearCart();
                    navigate('/invoice', {
                        state: orderData,
                    });
                });
            } catch (error) {
                console.error('Order error:', error);
                Swal.fire('Error', 'Failed to place order. Please try again.', 'error');
            } finally {
                setProcessing(false);
            }
            return;
        }

        // Handle Card Payment
        if (!stripe || !elements) {
            setProcessing(false);
            return;
        }

        try {
            // Create payment method
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
                billing_details: {
                    name: cardName,
                    email: user?.email,
                    address: {
                        line1: address,
                    },
                },
            });

            if (stripeError) {
                throw stripeError;
            }

            // Create order data
            const orderData = {
                userId: user?.uid,
                email: user?.email,
                name: cardName,
                address,
                amountPaid: cartTotal,
                paymentType: 'Card',
                status: 'paid',
                transactionId: paymentMethod.id,
                date: new Date().toISOString(),
                items: cartItems,
                paymentMethod: {
                    brand: paymentMethod.card.brand,
                    last4: paymentMethod.card.last4,
                },
            };

            // Save order to database
            const response = await fetch('https://medi-hurt-server.vercel.app/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) throw new Error('Failed to save order');

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Payment Successful!',
                text: `Transaction ID: ${paymentMethod.id}`,
                confirmButtonColor: '#14b8a6',
            }).then(() => {
                clearCart();
                navigate('/invoice', {
                    state: orderData,
                });
            });
        } catch (error) {
            console.error('Payment error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: error.message || 'Something went wrong. Please try again.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="w-11/12 mx-auto p-6 bg-white shadow-lg rounded-lg border-2 border-teal-700">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Billing Address */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Billing Address</h3>

                    <label className="block mb-2 font-medium">👤 Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full border-teal-600 p-2 mb-4 border rounded focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        required
                    />

                    <label className="block mb-2 font-medium">✉ Email</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="w-full border-teal-600 p-2 mb-4 border rounded bg-gray-100 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />

                    <label className="block mb-2 font-medium">🏠 Address</label>
                    <input
                        type="text"
                        placeholder="123 Main Street"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border-teal-600 p-2 mb-4 border rounded focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        required
                    />

                    <label className="block mb-2 font-medium">💰 Payment Method</label>
                    <div className="flex gap-4 mb-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="card"
                                checked={paymentMethodType === 'card'}
                                onChange={() => setPaymentMethodType('card')}
                                className="text-teal-600"
                            />
                            Credit/Debit Card
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="cod"
                                checked={paymentMethodType === 'cod'}
                                onChange={() => setPaymentMethodType('cod')}
                                className="text-teal-600"
                            />
                            Cash on Delivery
                        </label>
                    </div>
                </div>

                {/* Payment Section */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Payment</h3>

                    {paymentMethodType === 'card' && (
                        <>
                            <p className="mb-2">Accepted Cards</p>
                            <div className="flex items-center gap-2 my-5">
                                <img src={visa} alt="Visa" className="w-10" />
                                <img src={amex} alt="Amex" className="w-10" />
                                <img src={mastercard} alt="MasterCard" className="w-10" />
                                <img src={discover} alt="Discover" className="w-10" />
                            </div>

                            <label className="block mb-2 font-medium">Name on Card</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="w-full border-teal-600 p-2 mb-4 border rounded focus:ring-2 focus:ring-teal-600 focus:outline-none"
                                required
                            />

                            <label className="block mb-2 font-medium">Card Details</label>
                            <CardElement
                                className="p-3 border border-teal-600 rounded bg-white"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />
                        </>
                    )}

                    {paymentMethodType === 'cod' && (
                        <div className="p-4 border rounded border-yellow-500 bg-yellow-50 text-yellow-800">
                            <p><strong>Note:</strong> You will pay in cash when your order is delivered.</p>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 mt-4">
                    <button
                        type="submit"
                        disabled={processing || (paymentMethodType === 'card' && !stripe)}
                        className={`bg-teal-600 text-white py-3 px-6 rounded font-semibold hover:bg-teal-700 transition ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {processing ? 'Processing...' : paymentMethodType === 'card' ? `Pay ৳${cartTotal.toFixed(2)}` : `Place Order for ৳${cartTotal.toFixed(2)}`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;