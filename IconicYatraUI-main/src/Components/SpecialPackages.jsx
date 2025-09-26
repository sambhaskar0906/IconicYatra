import React, { useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Button,
  useMediaQuery,
  Divider,
  Grid,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import img1 from "../assets/packageimg/package1.png"
import img2 from "../assets/packageimg/package2.png"
import img3 from "../assets/packageimg/package3.png"
import img4 from "../assets/packageimg/package4.jpg"
import img5 from "../assets/packageimg/package5.png"
import img6 from "../assets/packageimg/package6.png"

const packages = [
  {
    image: img1,
    title: 'Mussoorie -Rishikesh- Nainital',
    id: '1',
    dpkg: '1',
  },
  {
    image: img2,
    title: '8N Amazing Nepal',
    id: '2',
    dpkg: '2',
  },
  {
    image: img3,
    title: 'Manali Volvo 3 Nights Tour : Ex Delhi',
    id: '3',
    dpkg: '3',
  },
  {
    image: img4,
    title: 'Explore Kerala',
    id: '4',
    dpkg: '4',
  },
  {
    image: img5,
    title: '07 Nights / 08 Days Scenic Kerala',
    id: '5',
    dpkg: '5',
  },
  {
    image: img6,
    title: 'Southern Hills 4N',
    id: '6',
    dpkg: '6',
  },
];

const SpecialPackages = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');
  const cardsToShow = isMobile ? 1 : isTablet ? 2 : 3;
  const cardWidthPercent = 100 / cardsToShow;

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left:
          direction === 'left'
            ? -scrollRef.current.offsetWidth / cardsToShow
            : scrollRef.current.offsetWidth / cardsToShow,
        behavior: 'smooth',
      });
    }
  };

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

  const Click = (id, dpkg) => {
    if (id && dpkg) {
      navigate(`/package-details?id=${id}&Dpkg=${dpkg}`);
    }
  };

  return (
    <Box sx={{ px: 3, py: 5, position: 'relative', width: '100%', overflow: 'hidden' }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          SPECIAL <span style={{ color: 'red' }}>PACKAGES</span>
        </Typography>
        <Divider sx={{ borderColor: '#ff5722', borderBottomWidth: 3, mx: 'auto', width: '200px' }} />
      </Box>

      {/* Cards */}
      <Grid>
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 3, // manageable spacing
            overflowX: 'scroll',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            width: '100%',
            px: 2, // left-right padding to avoid cut
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
            '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
          }}
        >
          {packages.map((pkg, i) => (
            <Box
              key={i}
              onClick={() => Click(pkg.id, pkg.dpkg)}
              sx={{
                flex: `0 0 calc(${cardWidthPercent}% - 16px)`, // minus gap handling
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
              {/* Gradient Overlay */}
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

export default SpecialPackages;
