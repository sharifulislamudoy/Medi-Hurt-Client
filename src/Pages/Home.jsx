import React from 'react';
import Banner from '../Components/Home/Hero-Section/Banner';
import CategorySection from '../Components/Home/Category-Section/CategorySection';
import DiscountSlider from '../Components/Home/DiscountSlider-Section/DiscountSection';
import { ReTitle } from 're-title';

const Home = () => {
    return (
        <div>
            <ReTitle title='Medi Hurt | Home'></ReTitle>
            <Banner />
            <CategorySection />
            <DiscountSlider />
        </div>
    );
};

export default Home;