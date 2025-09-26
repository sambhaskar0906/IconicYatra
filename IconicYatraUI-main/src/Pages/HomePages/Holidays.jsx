import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PackageCard from '../../Components/PackageCard';
import bannerImg from '../../assets/Banner/banner1.jpg';
import img1 from "../../assets/packageimg/internationalPackage1.png"
import img2 from "../../assets/packageimg/internationalPackage2.jpg"
import img3 from "../../assets/packageimg/internationalPackage3.png"
import img4 from "../../assets/packageimg/internationalPackage4.png"
import img5 from "../../assets/packageimg/internationalPackage5.png"
import img6 from "../../assets/packageimg/internationalPackage6.png"


const packages = [
  { id: '1', dpkg: '101', title: 'Europe', image: img1 },
  { id: '2', dpkg: '102', title: 'Thailand', image: img2}, 
  { id: '3', dpkg: '103', title: 'Singapore', image: img3},
  { id: '4', dpkg: '104', title: 'Singapore', image: img4},
  { id: '5', dpkg: '105', title: 'Baku', image: img5},
  { id: '6', dpkg: '106', title: 'Baku', image: img6},
  { id: '7', dpkg: '107', title: 'LADAKH', image: img1},
  { id: '8', dpkg: '108', title: 'LADAKH', image: img2},
  { id: '9', dpkg: '109', title: 'Malaysia', image: img3},
  { id: '10', dpkg: '110', title: 'Malaysia', image: img4},
  { id: '11', dpkg: '111', title: 'Sri Lanka', image: img5},
  { id: '12', dpkg: '201', title: 'Maharashtra', image: img6},
  { id: '13', dpkg: '202', title: 'Nepal', image: img2},
  { id: '14', dpkg: '203', title: 'Uttarakhand', image: img2},
  { id: '15', dpkg: '204', title: 'Rajasthan', image: img3},
  { id: '16', dpkg: '205', title: 'Madhya Pradesh', image: img4},
];


const Holidays = () => {
  const navigate = useNavigate();
  const [selectedFixed, setSelectedFixed] = useState('');
  const [selectedSafari, setSelectedSafari] = useState('');
  const [visibleCount, setVisibleCount] = useState(8); // initially show 8 packages

  const handleFixedChange = (event) => setSelectedFixed(event.target.value);
  const handleSafariChange = (event) => setSelectedSafari(event.target.value);

  const resetFilters = () => {
    setSelectedFixed('');
    setSelectedSafari('');
    setVisibleCount(8); // reset visible count
  };

  const filteredPackages = packages.filter((pkg) => {
    const fixedMatch = selectedFixed ? pkg.title === selectedFixed : false;
    const safariMatch = selectedSafari ? pkg.title === selectedSafari : false;
    if (!selectedFixed && !selectedSafari) return true;
    return fixedMatch || safariMatch;
  });

  const loadMore = () => setVisibleCount((prev) => prev + 8);

  return (
    <>
      {/* Hero Banner */}
      <Box
        sx={{
          height: { xs: 220, md: 300 },
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.5)',
          }}
        />
        {/* Banner Text */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight="bold" sx={{
            fontSize: { xs: '1.8rem', md: '2rem' },
          }}>
            HOLIDAY PACKAGES
          </Typography>
          <Typography variant="subtitle1" sx={{
            fontSize: { xs: '1rem', md: '1rem' },
          }}>
            Choose Your Dream Destination
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2, md: 5 }, background: '#f8f8f8', minHeight: '100vh' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            HOLIDAYS <span style={{ color: 'red' }}>PACKAGES</span>
          </Typography>
          <Divider sx={{ mt: 1, borderColor: '#ccc', borderBottomWidth: 5 }} />
        </Box>

        {/* Package Cards */}
        <Grid container spacing={3} sx={{ justifyContent: 'center', textAlign: 'center' }}>
          {filteredPackages.slice(0, visibleCount).map((pkg, idx) => (
            <Grid size={{ xs: 12, md: 3, sm: 6 }} key={idx} sx={{ display: 'flex', justifyContent: 'center' }}>
              <PackageCard
                title={pkg.title}
                image={pkg.image}
                id={pkg.id}
                dpkg={pkg.dpkg}
                sx={{
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Load More Button */}
        {visibleCount < filteredPackages.length && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={loadMore}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 'bold',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              Load More
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Holidays;
