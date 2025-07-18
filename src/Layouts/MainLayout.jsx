import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import { Outlet, useNavigation } from 'react-router'; 
import RouteChangeSpinner from '../Components/Loading/RouteChangeSpinner';


const MainLayout = () => {
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    return (
        <div>
            {isLoading && <RouteChangeSpinner />}
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;
