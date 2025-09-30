// src/pages/HolidaysPackages.jsx
import React from 'react';
import {
  Typography,
  Grid,
  Box,
  Divider,
  Button,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PackageCard from '../Components/PackageCard';
import allInternationalPackageData from '../Data/International/packageData';

const HolidaysPackages = () => {
  const navigate = useNavigate();

  const handleCardClick = (packageId) => {
    navigate(`/internationalpackage/${packageId}`); // Navigate to detail page
  };

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 6, width: '100%', background: '#fafafa' }}>
      {/* Title */}
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(90deg, #ff5722, #e91e63)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          HOLIDAY PACKAGES
        </Typography>
        <Divider
          sx={{
            borderColor: 'transparent',
            height: '5px',
            width: '200px',
            mx: 'auto',
            mt: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #ff9800, #f44336)',
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{ mt: 1, color: '#555', fontStyle: 'italic' }}
        >
          Explore our exclusive holiday trips
        </Typography>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={4} justifyContent="center">
        {allInternationalPackageData.slice(0, 8).map((pkg) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            key={pkg.id}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Box
              sx={{
                maxWidth: 300,
                width: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0px 6px 16px rgba(0,0,0,0.12)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-10px) scale(1.05)',
                  boxShadow: '0px 12px 24px rgba(0,0,0,0.2)',
                },
              }}
              onClick={() => handleCardClick(pkg.id)}
            >
              <PackageCard
                id={pkg.id}
                title={pkg.title}
                image={pkg.headerImage}
                nights={pkg.nights}
                sightseeing={pkg.sightseeing}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* "Click More" Button */}
      <Box textAlign="center" mt={6}>
        <Button
          component={RouterLink}
          to="/all-packages"
          variant="contained"
          sx={{
            px: 5,
            py: 1.7,
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '40px',
            background: 'linear-gradient(90deg, #43a047, #66bb6a)',
            boxShadow: '0px 6px 18px rgba(0,0,0,0.25)',
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(90deg, #2e7d32, #43a047)',
              boxShadow: '0px 10px 22px rgba(0,0,0,0.35)',
              transform: 'translateY(-3px)',
            },
          }}
        >
          Click More
        </Button>
      </Box>
    </Box>
  );
};

export default HolidaysPackages;