import React, { useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  Divider,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import  img1 from "../assets/packageimg/internationalPackage1.png"
import  img2 from "../assets/packageimg/internationalPackage2.jpg"
import  img3 from "../assets/packageimg/internationalPackage3.png"
import  img4 from "../assets/packageimg/internationalPackage4.png"
import  img5 from "../assets/packageimg/internationalPackage5.png"
import  img6 from "../assets/packageimg/internationalPackage6.png"

const packages = [
  {
    id: 1,
    title: 'Maldives',
    image: img1,
    queryLink: 'https://example.com/query/maldives',
  },
  {
    id: 2,
    title: 'Europe',
    image: img2,
    queryLink: 'https://example.com/query/europe',
  },
  {
    id: 3,
    title: 'Thailand',
    image: img3,
    queryLink: 'https://example.com/query/thailand',
  },
  {
    id: 4,
    title: 'Singapore',
    image: img4,
    queryLink: 'https://example.com/query/singapore',
  },
  {
    id: 5,
    title: 'Bali',
    image: img5,
    queryLink: 'https://example.com/query/bali',
  },
  {
    id: 6,
    title: 'Dubai',
    image: img6,
    queryLink: 'https://example.com/query/dubai',
  },
];

const InternationalPackage = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');
  const cardsToShow = isMobile ? 1 : isTablet ? 2 : 3;
  const cardWidthPercent = 100 / cardsToShow;

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: scrollRef.current.offsetWidth / cardsToShow,
          behavior: 'smooth',
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [cardsToShow]);

  const handleClick = (link) => {
    if (link) {
      window.open(link, '_blank'); // send query link in new tab
    }
  };

  return (
    <Box sx={{ px: 3, py: 5, position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Section Title */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          INTERNATIONAL <span style={{ color: 'red' }}>PACKAGES</span>
        </Typography>
        <Divider sx={{ borderColor: '#ff5722', borderBottomWidth: 3, mx: 'auto', width: '250px' }} />
      </Box>

      {/* Cards */}
      <Grid>
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'scroll',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            width: '100%',
            px: 2,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {packages.map((pkg, i) => (
            <Box
              key={i}
              onClick={() => handleClick(pkg.queryLink)}
              sx={{
                flex: `0 0 calc(${cardWidthPercent}% - 16px)`, // gap adjust
                height: isMobile ? 200 : isTablet ? 220 : 260,
                borderRadius: '15px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                scrollSnapAlign: 'center',
                backgroundImage: `url(${pkg.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.4s ease',
                boxShadow: 4,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 8,
                },
              }}
            >
              {/* Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <Typography
                  variant={isMobile ? 'body2' : 'body1'}
                  fontWeight="bold"
                  color="#fff"
                  textAlign="center"
                  sx={{ mb: 1 }}
                >
                  {pkg.title}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontSize: isMobile ? '0.75rem' : '0.85rem',
                    borderRadius: '20px',
                    px: 2,
                    backgroundColor: '#ff5722',
                    boxShadow: '0px 3px 8px rgba(0,0,0,0.3)',
                    '&:hover': { backgroundColor: '#e64a19' },
                  }}
                >
                  Send Query
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
};

export default InternationalPackage;
