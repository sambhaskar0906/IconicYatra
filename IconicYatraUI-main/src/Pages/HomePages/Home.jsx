import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Typography, Box, Paper, Button } from '@mui/material';

import InquiryFormDialog from '../../Components/InquiryFormDialog';
import FeaturedPackages from '../../Components/FeaturedPackages';
import WhyChooseUs from '../../Components/WhyChooseUs';
import DomesticPackage from '../../Components/DomesticPackage';
import InternationalPackage from '../../Components/InternationalPackage';
import TrustedCompany from '../../Components/TrustedCompany';
import Achievements from '../../Components/Achievements';
import SpecialPackages from '../../Components/SpecialPackages';
import HolidaysPackages from '../../Components/HolidaysPackages';
import Testimonial from './Testimonial';
import Gallery from '../../Components/Gallery';

import img1 from '../../assets/Banner/banner1.jpg';
import img2 from '../../assets/Banner/banner2.jpg';
import img3 from '../../assets/Banner/banner3.jpg';

const Home = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInquirySubmit = (formData) => {
    console.log('Inquiry Submitted:', formData);
    // 🔥 Send formData to backend API here
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Carousel */}
      <div id="carouselExampleIndicators" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000" data-bs-pause="false">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
        </div>

        <Box className="carousel-inner" sx={{ width: '100%' }}>
          {[{ img: img1, title: "Summer Special", subtitle: "4 Nights / 5 Days" }, { img: img2, title: "Honeymoon Special", subtitle: "3 Nights / 4 Days" }, { img: img3, title: "Jungle Safari", subtitle: "2 Nights / 3 Days" }].map((slide, index) => (
            <div className={`carousel-item ${index === 0 ? "active" : ""} position-relative`} key={index}>
              <img src={slide.img} className="d-block w-100" alt={`Slide ${index + 1}`} style={{ objectFit: 'cover', objectPosition: 'center', height: '70vh', filter: 'brightness(70%)' }} />
              <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                <Paper elevation={24} sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>{slide.title}</Typography>
                  <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>{slide.subtitle}</Typography>
                  <Button onClick={handleClickOpen} variant="contained" size="large" color="warning">
                    Book Now
                  </Button>
                </Paper>
              </div>
            </div>
          ))}
        </Box>
      </div>

      {/* Inquiry Dialog */}
      <InquiryFormDialog open={open} handleClose={handleClose} onSubmit={handleInquirySubmit} title="Travel Inquiry" />

      {/* Sections */}
      <WhyChooseUs />
      <TrustedCompany />
      <SpecialPackages />
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
