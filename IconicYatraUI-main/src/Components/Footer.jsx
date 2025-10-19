import React from 'react';
import { Box, Grid, Typography, Link, Stack, IconButton, Button, useTheme, useMediaQuery } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import logo from '../assets/Logo/logoiconic.jpg';
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";

const Footer = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handlePaymentClick = () => {
    navigate("/payment");
  };

  return (
    <Box sx={{
      width: '100%',
      background: 'linear-gradient(135deg, #1f3c65 0%, #2c5282 100%)',
      color: '#fff',
      px: { xs: 3, sm: 5 },
      pt: 6,
      pb: 2,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #ffd700, #ff6b00, #ffd700)',
      }
    }}>

      {/* Top Footer Sections */}
      <Grid container spacing={4} justifyContent="center">
        {/* About Section */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img src={logo} alt="Logo" height="55" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ffd700' }}>
              About Iconic Yatra
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#e0e0e0' }}>
              Welcome to Iconic Yatra – where every journey becomes an unforgettable memory! We are a premier travel company specializing in domestic and international tour packages, dedicated to providing experiences that combine comfort, adventure, and cultural discovery.
              At Iconic Yatra, we believe that travel is more than visiting places—it's about exploring new horizons, connecting with people, and creating stories that last a lifetime. With years of expertise and a passionate team of travel professionals, we design customized itineraries that cater to every traveler's needs.....
            </Typography>

          </Box>
        </Grid>

        {/* Important Links */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <Typography variant="h6" sx={{
            letterSpacing: 0.5,
            py: 2,
            fontWeight: 'bold',
            color: '#ffd700',
            borderBottom: '2px solid #ffd700',
            display: 'inline-block'
          }}>
            POPULAR TOURS
          </Typography>
          <Stack spacing={1.5} alignItems={{ md: 'flex-start' }} sx={{ mt: 2 }}>
            {['Gujarat', 'Himachal', 'Kashmir', 'Chardham', 'Kerala', 'Honeymoon Tours', 'Latest News'].map((link, idx) => (
              <Link
                key={idx}
                component={RouterLink}
                to={'/'}
                underline="none"
                color="inherit"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#e0e0e0',
                  '&:hover': {
                    color: '#ffd700',
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                  fontWeight: 500
                }}
              >
                <Box component="span" sx={{
                  color: '#ffd700',
                  mr: 1,
                  fontSize: '18px'
                }}>
                  ›
                </Box>
                {link}
              </Link>
            ))}
          </Stack>
        </Grid>

        {/* Our Menu */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Typography variant="h6" sx={{
            letterSpacing: 1,
            py: 2,
            fontWeight: 'bold',
            color: '#ffd700',
            borderBottom: '2px solid #ffd700',
            display: 'inline-block'
          }}>
            QUICK LINKS
          </Typography>
          <Stack spacing={1.5} alignItems={{ md: 'flex-start' }} sx={{ mt: 2 }}>
            {[
              { name: "About us", path: "/aboutus" },
              { name: "Latest Blogs", path: "/latestblogs" },
              { name: "Gallery", path: "/gallery" },
              { name: "Testimonials", path: "/testimonials" },
              { name: "Term & Conditions", path: "/terms-conditions" },
              { name: "Contact", path: "/contact" },
              { name: "Career", path: "/careers" }
            ].map((link, idx) => (
              <Link
                key={idx}
                component={RouterLink}
                to={link.path}
                underline="none"
                color="inherit"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#e0e0e0',
                  "&:hover": {
                    color: "#ffd700",
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                  fontWeight: 500
                }}
              >
                <Box component="span" sx={{
                  color: '#ffd700',
                  mr: 1,
                  fontSize: '18px'
                }}>
                  ›
                </Box>
                {link.name}
              </Link>
            ))}
          </Stack>
        </Grid>

        {/* Contact Us */}
        <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
          <Typography variant="h6" sx={{
            letterSpacing: 1,
            py: 2,
            fontWeight: 'bold',
            color: '#ffd700',
            borderBottom: '2px solid #ffd700',
            display: 'inline-block'
          }}>
            CONTACT INFO
          </Typography>
          <Stack spacing={2} alignItems={{ md: 'flex-start' }} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LocationOnIcon sx={{ mr: 2, color: '#ffd700', mt: 0.5 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.5, color: '#e0e0e0' }}>
                B-25, 2nd Floor Sector -64,<br />Noida, Uttar Pradesh 201301
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CallIcon sx={{ mr: 2, color: '#ffd700' }} />
              <Typography variant="body2" sx={{ color: '#e0e0e0' }}>+91 7053900957</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PhoneInTalkIcon sx={{ mr: 2, color: '#ffd700' }} />
              <Typography variant="body2" sx={{ color: '#e0e0e0' }}>01204582960</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 2, color: '#ffd700' }} />
              <Typography variant="body2" sx={{ color: '#e0e0e0' }}>info@iconicyatra.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 2, color: '#ffd700' }} />
              <Typography variant="body2" sx={{ color: '#e0e0e0' }}>hr@iconicyatra.com</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Middle Section with Payment, Social, Support & Calendar */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 5, mb: 3 }}>

        {/* Policies Links */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            sx={{
              "& a": {
                color: "#e0e0e0",
                textDecoration: "none",
                fontSize: "14px",
                transition: "0.3s",
                fontWeight: 500,
                "&:hover": {
                  color: "#ffd700",
                  transform: 'translateY(-1px)'
                },
              },
              "& p": {
                color: "#ffd700",
                mx: 1,
                fontWeight: 'bold'
              },
            }}
          >
            <Link component={RouterLink} to="/terms-conditions">
              Terms & Conditions
            </Link>
            <Typography variant="body2">|</Typography>
            <Link component={RouterLink} to="/cancellationandrefundpolicy">
              Cancellation Policy
            </Link>
            <Typography variant="body2">|</Typography>
            <Link component={RouterLink} to="/privacypolicy">
              Privacy Policy
            </Link>
          </Stack>
        </Grid>

        {/* Social Icons */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography variant="body2" sx={{ whiteSpace: "nowrap", fontWeight: 600, color: '#ffd700' }}>
              Follow Us:
            </Typography>
            <IconButton
              size="small"
              sx={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                '&:hover': {
                  background: '#1877f2',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
              href="https://facebook.com"
              target="_blank"
            >
              <Facebook fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                '&:hover': {
                  background: '#e1306c',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
              href="https://instagram.com"
              target="_blank"
            >
              <Instagram fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                '&:hover': {
                  background: '#25d366',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
              href="https://wa.me/917053900957"
              target="_blank"
            >
              <WhatsApp fontSize="small" />
            </IconButton>
          </Stack>
        </Grid>

        {/* Support */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack direction={'row'} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffd700' }}>
              24x7 Customer Support:
            </Typography>
            <Typography variant="body2" sx={{ color: '#e0e0e0', fontWeight: 500 }}>
              +91 7053900957
            </Typography>
          </Stack>
        </Grid>

        {/* Calendar */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'center',
            mt: isMobile ? 2 : 0
          }}>
            <Calendar />
          </Box>
        </Grid>
      </Grid>

      {/* Alternative Payment Button for Mobile */}
      {isMobile && (
        <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<PaymentIcon />}
            onClick={handlePaymentClick}
            sx={{
              background: 'linear-gradient(45deg, #ff6b00 30%, #ffd700 90%)',
              color: '#1f3c65',
              fontWeight: 'bold',
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ffd700 30%, #ff6b00 90%)',
                boxShadow: '0 6px 20px rgba(255, 107, 0, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Quick Payment
          </Button>
        </Box>
      )}

      {/* Bottom Footer */}
      <Box sx={{
        borderTop: '2px solid rgba(255,215,0,0.3)',
        mt: 4,
        pt: 3,
        textAlign: 'center',
        position: 'relative'
      }}>
        <Typography variant="body2" sx={{ color: '#e0e0e0', fontWeight: 500 }}>
          © 2025 <Box component="span" sx={{ fontWeight: 'bold', color: '#ffd700' }}>iconicyatra.com</Box>. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;