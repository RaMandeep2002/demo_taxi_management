"use client";
import AboutUs from "./LandingPage/AboutUs";
import Footer from "./LandingPage/Footer";
// import AppDownloadSection from "./LandingPage/AppDownloadSection";
// import GallerySection from "./LandingPage/GallerySection";
import HeroSection from "./LandingPage/HeroSection";
import Navbar from "./LandingPage/Navbar";
import WelcomeSection from "./LandingPage/WelcomeSection";
import * as motion from "motion/react-client";
import { useScroll } from "motion/react";
import BookingSection from "./LandingPage/BookingSections";

export default function Home() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="flex flex-col min-h-screen scroll-smooth overscroll-y-contain">
      <motion.div style={{ scaleX: scrollYProgress }} />
      {/* Navbar */}
      {/* <Navbar /> */}
      {/* HeroSection */}
      <main className="flex-1">
        <Navbar />

        <HeroSection />

        <WelcomeSection />

        {/* <GallerySection /> */}
        {/* <AppDownloadSection /> */}

        <AboutUs />

        <BookingSection />
        
        <Footer />
      </main>
    </div>
    // </motion.div>
    // <div className="flex items-center justify-center h-screen bg-cover bg-center px-4"
    // style={{
    //   backgroundImage: "url('https://i.postimg.cc/JnTcbvg9/bg-1.png')",
    // }}>
    //   <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-800 animate-pulse text-center">
    //     🚧 Under Construction 🚧
    //   </h1>
    // </div>
  );
}
