import { useState } from "react";
import HeroSection from "../../components/heroSection/HeroSection";
import Layout from "../../components/layout/Layout";
import Category from "../../components/category/Category";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Track from "../../components/track/Track";
import Testimonial from "../../components/testimonial/Testimonial";
// import { useContext } from "react";
// import MyContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  return (
    <Layout>
        <HeroSection/>
        <Category 
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        <HomePageProductCard selectedCategory={selectedCategory}/>
        <Track/>
        <Testimonial/>
        {/* <Loader/> */}
        {/* <h1>Hello {name}</h1> */}
    </Layout>
  )
}

export default HomePage