import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Initialize state from localStorage directly
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (e) {
            console.error("Failed to parse cart data", e);
            return [];
        }
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, formulationType, quantity = 1) => {
        setCartItems((prevItems) => {
            const exists = prevItems.find(item =>
                item._id === product._id && item.formulationType === formulationType
            );

            if (exists) {
                return prevItems.map(item =>
                    item._id === product._id && item.formulationType === formulationType
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, {
                    ...product,
                    quantity,
                    formulationType,
                    selectedPrice: product.formulations[formulationType]
                }];
            }
        });
    };

    const removeFromCart = (id, formulationType) => {
        setCartItems((prevItems) =>
            prevItems.filter(item =>
                !(item._id === id && item.formulationType === formulationType)
            )
        );
    };

    const updateQuantity = (id, formulationType, newQuantity) => {
        const validatedQuantity = Math.max(1, Math.min(100, Number(newQuantity) || 1));
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item._id === id && item.formulationType === formulationType
                    ? { ...item, quantity: validatedQuantity }
                    : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = parseFloat(cartItems.reduce(
        (total, item) => total + (item.selectedPrice || item.price) * item.quantity,
        0
    ).toFixed(2));

    const cartItemCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartItemCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};