import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from '../FireBase/FireBase__Config';

export const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    // Email sign-up
    const registerWithEmail = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Email login
    const loginWithEmail = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };


    // Google login
    const loginWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // Logout
    const logout = () => {
        setLoading(true);
        return signOut(auth);
    };

    // Track user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            // Fetch additional user data (including role) from your backend
            try {
                const response = await fetch(`http://localhost:3000/users/${currentUser.email}`);
                const userData = await response.json();
                // Merge Firebase auth data with your backend user data
                setUser({
                    ...currentUser,
                    role: userData.role,
                    username: userData.username,
                    photoURL: userData.photoURL,
                    // other user fields...
                });
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                // Handle error - maybe set user to null or show error
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    });
    return () => unsubscribe();
}, []);

    const authInfo = {
        user,
        loading,
        userRole,
        setUserRole,
        loginWithGoogle,
        logout,
        loginWithEmail,
        registerWithEmail,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;