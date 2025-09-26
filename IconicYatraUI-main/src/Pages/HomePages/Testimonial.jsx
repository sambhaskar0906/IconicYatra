import React, { useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const testimonials = [
  {
    name: 'Ankit Rajput',
    location: 'Sikkim',
    feedback:
      'The overall plan by iconic travels was good. Very responsive to our queries. Highly recommend!',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    name: 'Priya Sharma',
    location: 'Delhi',
    feedback:
      'Amazing experience! Everything was smooth and perfectly managed.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Ravi Mehta',
    location: 'Mumbai',
    feedback:
      'Superb service. Our trip to Goa was memorable!',
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
  },
  {
    name: 'Neha Gupta',
    location: 'Lucknow',
    feedback:
      'Hassle-free bookings and excellent support. Highly recommended!',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

const Testimonial = () => {
  const scrollRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const cardsToShow = isMobile ? 1 : isTablet ? 2 : 3;
  const cardWidth = 100 / cardsToShow;

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: scrollRef.current.offsetWidth / cardsToShow,
          behavior: 'smooth',
        });
        // Infinite loop effect
        if (
          scrollRef.current.scrollLeft + scrollRef.current.offsetWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [cardsToShow]);

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 6, background: '#f5f5f5', width: '100%' }}>
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(90deg, #ff5722, #e91e63)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          gutterBottom
        >
          TESTIMONIALS
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ mt: 1, color: '#555', fontStyle: 'italic' }}
        >
          What our happy customers say about us
        </Typography>
      </Box>

      {/* Slider */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { display: 'none' },
          px: { xs: 1, md: 2 },
        }}
      >
        {testimonials.map((t, index) => (
          <Box
            key={index}
            sx={{
              flex: `0 0 ${cardWidth}%`,
              scrollSnapAlign: 'center',
              borderRadius: 3,
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              p: 4,
              background: 'white',
              minWidth: 250,
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px) scale(1.02)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
              },
            }}
          >
            <Avatar
              src={t.image}
              alt={t.name}
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                border: '3px solid #1976d2',
              }}
            />
            <Typography variant="h6" fontWeight="bold" color="#1976d2">
              {t.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {t.location}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
              sx={{ px: 1 }}
            >
              “{t.feedback}”
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Testimonial;
