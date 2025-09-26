import React from 'react';
import {
  Typography,
  Grid,
  Box,
  Divider,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PackageCard from '../Components/PackageCard';
import img1 from "../assets/packageimg/package1.png"
import img2 from "../assets/packageimg/package2.png"
import img3 from "../assets/packageimg/package3.png"
import img4 from "../assets/packageimg/package4.jpg"
import img5 from "../assets/packageimg/package4.jpg"
import img6 from "../assets/packageimg/package3.png"
import img7 from "../assets/packageimg/package2.png"
import img8 from "../assets/packageimg/package1.png"


const packages = [
  {
    image: img1,
    title: 'Mussoorie -Rishikesh- Nainital',
    id: '1',
    dpkg: '1',
    queryLink: 'https://example.com/query/uttarakhand',
  },
  {
    image: img2,
    title: '8N Amazing Nepal',
    id: '2',
    dpkg: '1',
    queryLink: 'https://example.com/query/nepal',
  },
  {
    image: img3,
    title: 'Manali Volvo 3 Nights Tour ',
    id: '3',
    dpkg: '1',
    queryLink: 'https://example.com/query/manali',
  },
  {
    image: img4,
    title: 'Explore Kerala',
    id: '4',
    dpkg: '1',
    queryLink: 'https://example.com/query/kerala',
  },
  {
    image: img5,
    title: 'Best of Kerala 6 N',
    id: '5',
    dpkg: '1',
    queryLink: 'https://example.com/query/kerala-6n',
  },
  {
    image: img6,
    title: '07 Nights / 08 Days Scenic Kerala',
    id: '6',
    dpkg: '1',
    queryLink: 'https://example.com/query/scenic-kerala',
  },
  {
    image: img7,
    title: 'Southern Hills 4N',
    id: '7',
    dpkg: '1',
    queryLink: 'https://example.com/query/southern-hills',
  },
  {
    image: img8,
    title: 'Kathmandu-Pokhara / 4N-5D',
    id: '8',
    dpkg: '1',
    queryLink: 'https://example.com/query/kathmandu',
  }
];

const FeaturedPackages = () => {
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
        <Typography
          variant="subtitle1"
          sx={{ mt: 1, color: '#555', fontStyle: 'italic' }}
        >
          Discover our handpicked travel experiences
        </Typography>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={4} justifyContent="center">
        {packages.slice(0, 8).map((pkg, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            key={index}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}
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
                '&:hover': {
                  transform: 'translateY(-10px) scale(1.05)',
                  boxShadow: '0px 12px 24px rgba(0,0,0,0.2)',
                },
              }}
            >
              <PackageCard {...pkg} />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* "Click More" Button */}
      <Box textAlign="center" mt={6}>
        <Button
          component={RouterLink}
          to="/all-latest-packages"
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

export default FeaturedPackages;
