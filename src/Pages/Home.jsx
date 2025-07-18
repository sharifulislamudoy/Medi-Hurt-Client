import React from 'react';
import Banner from '../Components/Home/Hero-Section/Banner';
import CategorySection from '../Components/Home/Category-Section/CategorySection';
import DiscountSlider from '../Components/Home/DiscountSlider-Section/DiscountSection';
import { ReTitle } from 're-title';
import FeedbackSection from '../Components/Home/Feedback-Section/FeedbackSection';
import WhyChooseUs from '../Components/Home/WhyChooseUs/WhyChooseUs';

const Home = () => {
    return (
        <div>
            <ReTitle title='Medi Hurt | Home'></ReTitle>
            <Banner />
            <CategorySection />
            <DiscountSlider />
            <WhyChooseUs />
            <FeedbackSection />
        </div>
    );
};

export default Home;