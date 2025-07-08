import React from 'react';
import Banner from '../Components/Home/Hero-Section/Banner';
import CategorySection from '../Components/Home/Category-Section/CategorySection';
import DiscountSlider from '../Components/Home/DiscountSlider-Section/DiscountSection';

const Home = () => {
    return (
        <div>
            <Banner />
            <CategorySection />
            <DiscountSlider />
        </div>
    );
};

export default Home;