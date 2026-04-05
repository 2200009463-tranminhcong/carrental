import React from "react";
import { useState } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import FeaturedCars from "./FeaturedCars";
import VideoSection from "./VideoSection";
import Features from "./Features";
import CarBrand from "./CarBrand";
import Gallery from "./Gallery";

const Home = () => {
    return (
       <>
       <CarBrand />
      <Hero />
      <Gallery />
      <FeaturedCars />
        <VideoSection />
        <Features />
    </>
    )
}
export default Home;