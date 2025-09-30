import React from 'react';
import { Typography, Grid, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PackageCard from '../Components/PackageCard';
import allDomesticPackageData from '../Data/Domestic/packageData';

const FeaturedPackages = () => {
  const navigate = useNavigate();

  const handleCardClick = (packageId) => {
    navigate(`/package/${packageId}`);
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
          LATEST PACKAGES
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
        <Typography variant="subtitle1" sx={{ mt: 1, color: '#555', fontStyle: 'italic' }}>
          Discover our handpicked travel experiences
        </Typography>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={4} justifyContent="center">
        {allDomesticPackageData.slice(0, 8).map((pkg) => (
          <Grid
            size={{ xs: 12, md: 3, sm: 6 }}
            key={pkg.id}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 300,
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
                title={pkg.title}
                image={pkg.headerImage}
                nights={pkg.nights}
                sightseeing={pkg.sightseeing}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedPackages;