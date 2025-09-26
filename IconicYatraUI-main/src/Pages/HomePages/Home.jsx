import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import PackageCard from '../../Components/PackageCard';


import {
  Typography,
  Box,
  Paper,
} from '@mui/material';

import FeaturedPackages from '../../Components/FeaturedPackages';
import WhyChooseUs from '../../Components/WhyChooseUs';
import DomesticPackage from '../../Components/DomesticPackage';
import PopularDestinations from '../../Components/PopularDestinations';
import InternationalPackage from '../../Components/InternationalPackage';
import TrustedCompany from '../../Components/TrustedCompany';
import Achievements from '../../Components/Achievements';
import SpecialPackages from '../../Components/SpecialPackages';
import HolidaysPackages from '../../Components/HolidaysPackages';
import Testimonial from './Testimonial';
import Gallery from '../../Components/Gallery';

import img1 from '../../assets/Banner/banner1.jpg'
import img2 from '../../assets/Banner/banner2.jpg'
import img3 from '../../assets/Banner/banner3.jpg'
//import img4 from '../../assets/Banner/banner4.jpg'

const Home = () => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Bootstrap Carousel */}
      <div
        id="carouselExampleIndicators"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="3000"   // 3 sec auto slide
        data-bs-pause="false"     // hover par bhi rukega nahi
        style={{ position: 'relative', width: '100%' }}
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
        </div>

        {/* Carousel Inner */}
        <Box className="carousel-inner" sx={{ width: '100%' }}>
          {/* Slide 1 */}
          <div className="carousel-item active position-relative">
            <img
              src={img1}
              className="d-block w-100"
              alt="Slide 1"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                width: '100%',
                height: '70vh',
                filter: 'brightness(70%)',
              }}
            />
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
              <Paper elevation={24} sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>Summer Special</Typography>
                <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>4 Nights / 5 Days</Typography>
                <a className="btn btn-warning btn-lg" target="_blank" rel="noopener noreferrer">
                  Book Now
                </a>
              </Paper>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item position-relative">
            <img
              src={img2}
              className="d-block w-100"
              alt="Slide 2"
              style={{ objectFit: 'cover', objectPosition: 'center', height: '70vh', filter: 'brightness(70%)' }}
            />
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
              <Paper elevation={24} sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>Honeymoon Special</Typography>
                <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>3 Nights / 4 Days</Typography>
                <a href="https://example.com/honeymoon" className="btn btn-warning btn-lg" target="_blank" rel="noopener noreferrer">
                  Book Now
                </a>
              </Paper>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item position-relative">
            <img
              src={img3}
              className="d-block w-100"
              alt="Slide 3"
              style={{ objectFit: 'cover', objectPosition: 'center', height: '70vh', filter: 'brightness(70%)' }}
            />
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
              <Paper elevation={24} sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>Jungle Safari</Typography>
                <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>2 Nights / 3 Days</Typography>
                <a href="https://example.com/safari" className="btn btn-warning btn-lg" target="_blank" rel="noopener noreferrer">
                  Book Now
                </a>
              </Paper>
            </div>
          </div>
        </Box>
      </div>

      {/* Other Sections */}
      <WhyChooseUs />
      <TrustedCompany />
      <SpecialPackages />
      {/* <PopularDestinations /> */}
      <DomesticPackage />
      <InternationalPackage />
      <FeaturedPackages />
      <HolidaysPackages />
      <Testimonial />
      <Gallery />
      <Achievements />
    </Box>
  );
};

export default Home;
