import React from 'react';
import { Box, Grid, Typography, Link, Stack, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink } from 'react-router-dom';
import Calendar from './Calendar';
import logo from '../assets/Logo/logoiconic.jpg';
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";

const Footer = () => {
  return (
    <Box sx={{ width: '100%', background: '#1f3c65', color: '#fff', px: { xs: 3, sm: 5 }, pt: 6, pb: 2 }}>

      {/* Top Footer Sections */}
      <Grid container spacing={4} justifyContent="center">
        {/* About Section */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ mt: 1 }}>
            <img src={logo} alt="Logo" height="55" style={{ maxWidth: '100%' }} />
            <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              About Iconic Yatra
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              Welcome to Iconic Yatra – where every journey becomes an unforgettable memory! We are a premier travel company specializing in domestic and international tour packages, dedicated to providing experiences that combine comfort, adventure, and cultural discovery. At Iconic Yatra, we believe that travel is more than visiting places—it's about exploring new horizons, connecting with people, and creating stories that last a lifetime........
            </Typography>
          </Box>
        </Grid>

        {/* Important Links */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <Typography variant="h6" sx={{ letterSpacing: 0.5, py: 2 }}>
            IMPORTANT LINKS
          </Typography>
          <Stack spacing={1} alignItems={{ md: 'flex-start' }}>
            {['Gujarat', 'Himachal', 'Kashmir', 'Chardham', 'Kerala', 'Honeymoon tours', ' Latest News'].map((link, idx) => (
              <Link
                key={idx}
                component={RouterLink}
                to={'/'}
                underline="hover"
                color="inherit"
                sx={{ '&:hover': { color: '#ffd700' }, transition: '0.3s' }}
              >
                › {link}
              </Link>
            ))}
          </Stack>
        </Grid>

        {/* Our Menu */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Typography variant="h6" sx={{ letterSpacing: 1, py: 2 }}>
            OUR MENU
          </Typography>
          <Stack spacing={1} alignItems={{ md: 'flex-start' }}>
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
                underline="hover"
                color="inherit"
                sx={{ "&:hover": { color: "#ffd700" }, transition: "0.3s" }}
              >
                › {link.name}
              </Link>
            ))}
          </Stack>
        </Grid>

        {/* Contact Us */}
        <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
          <Typography variant="h6" sx={{ letterSpacing: 1, py: 2 }}>
            CONTACT US
          </Typography>
          <Stack spacing={1} alignItems={{ md: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                B-25, 2nd Floor Sector -64, Noida, Uttar Pradesh 201301
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CallIcon sx={{ mr: 1 }} />
              <Typography variant="body2">+91 7053900957</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PhoneInTalkIcon sx={{ mr: 1 }} />
              <Typography variant="body2">01204582960</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1 }} />
              <Typography variant="body2">info@iconicyatra.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1 }} />
              <Typography variant="body2">hr@iconicyatra.com</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Policies Links Centered */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 5 }}
      >
        {/* Policies Links */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            mt={1}
            sx={{
              "& a": {
                color: "inherit",
                textDecoration: "none",
                fontSize: "14px",
                transition: "0.3s",
                "&:hover": { color: "#ffd700" },
              },
              "& p": {
                color: "#ccc",
                mx: 0.5,
              },
            }}
          >
            <Link component={RouterLink} to="/terms-conditions">
              Terms & Conditions
            </Link>
            <Typography variant="body2">|</Typography>
            <Link component={RouterLink} to="/cancellationandrefundpolicy">
              Cancellation and Refund Policy
            </Link>
            <Typography variant="body2">|</Typography>
            <Link component={RouterLink} to="/privacypolicy">
              Privacy Policy
            </Link>
          </Stack>
        </Grid>

        <Grid
          size={{ xs: 12, md: 2 }}
        >
          {/* Social Icons */}
          <Stack direction="row" spacing={0.5} alignItems="center" mt={2}>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "nowrap", fontWeight: 500 }}
            >
              Follow Us:
            </Typography>
            <IconButton
              size="small"
              color="inherit"
              href="https://facebook.com"
              target="_blank"
              sx={{ "&:hover": { color: "#1877f2" } }}
            >
              <Facebook fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="inherit"
              href="https://instagram.com"
              target="_blank"
              sx={{ "&:hover": { color: "#e1306c" } }}
            >
              <Instagram fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="inherit"
              href="https://wa.me/919999999999"
              target="_blank"
              sx={{ "&:hover": { color: "#25d366" } }}
            >
              <WhatsApp fontSize="small" />
            </IconButton>
          </Stack>
        </Grid>

        <Grid
          size={{ xs: 12, md: 3 }}
        >
          {/* Support */}
          <Typography variant="body2" sx={{ fontWeight: 500, mt: 1.5 }}>
            <strong>Support (24x7):</strong> +91 7053900957
          </Typography>
        </Grid>


        {/* Calendar */}
        <Grid
          size={{ xs: 12, md: 2 }}
        >
          <Box sx={{ marginTop: '0px !important' }}>
            <Calendar sx={{ marginTop: '0px !important' }} />
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Footer */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.3)', mt: 4, pt: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#ccc' }}>
          © 2025 <Box component="span" sx={{ fontWeight: 'bold', color: '#ffd700' }}>iconicyatra.com</Box>. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
