import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from '../FireBase/FireBase__Config';

export const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Admin credentials (in a real app, store these more securely)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'MedAdmin@123',
  email: 'admin@medihurt.com' // Add an email for Firebase auth
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

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

    // Admin login
    const loginAsAdmin = async (username, password) => {
      setLoading(true);
      try {
        // First validate against hardcoded admin credentials
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          // Then authenticate with Firebase using the admin email
          const userCredential = await signInWithEmailAndPassword(
            auth, 
            ADMIN_CREDENTIALS.email, 
            ADMIN_CREDENTIALS.password
          );
          
          // Set admin flag and store in localStorage
          localStorage.setItem('isAdmin', 'true');
          setAdmin(userCredential.user);
          return userCredential;
        } else {
          throw new Error('Invalid admin credentials');
        }
      } catch (error) {
        setLoading(false);
        throw error;
      }
    };

    // Google login
    const loginWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // GitHub login
    const loginWithGithub = () => {
        setLoading(true);
        return signInWithPopup(auth, githubProvider);
    };

    // Logout
    const logout = () => {
        setLoading(true);
        localStorage.removeItem('isAdmin');
        setAdmin(null);
        return signOut(auth);
    };

    // Track user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            
            // Check if the current user is the admin
            if (currentUser && currentUser.email === ADMIN_CREDENTIALS.email) {
              setAdmin(currentUser);
              localStorage.setItem('isAdmin', 'true');
            } else {
              setAdmin(null);
              localStorage.removeItem('isAdmin');
            }
            
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        admin,
        loading,
        loginWithGoogle,
        logout,
        loginWithGithub,
        loginWithEmail,
        registerWithEmail,
        loginAsAdmin
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;