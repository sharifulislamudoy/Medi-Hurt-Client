// App.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import RouteChangeSpinner from '../Loading/RouteChangeSpinner';

const AppWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loading spinner on route change
    setIsLoading(true);
    
    // Hide after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Clean up timer if component unmounts
    return () => clearTimeout(timer);
  }, [location]); // Trigger effect when location changes

  return (
    <>
      {isLoading && <RouteChangeSpinner />}
      {children}
    </>
  );
};

export default AppWrapper;