import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
  Paper,
} from "@mui/material";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  FlightTakeoff,
  Public,
  EmojiPeople,
  Star,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Visibility,
  Flag,
} from "@mui/icons-material";
import HandshakeIcon from '@mui/icons-material/Handshake';
import PublicIcon from '@mui/icons-material/Public';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import aboutBanner  from "../assets/Banner/aboutBanner.jpeg";
import about from "../assets/Banner/about.jpeg"

const team = [
  {
    name: "Amit Sharma",
    role: "Founder & CEO",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Travel enthusiast with 15+ years of industry experience",
  },
  {
    name: "Priya Kapoor",
    role: "Travel Consultant",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Specialist in luxury and adventure travel packages",
  },
  {
    name: "Ravi Verma",
    role: "Tour Manager",
    img: "https://randomuser.me/api/portraits/men/76.jpg",
    bio: "Expert in cultural immersion experiences",
  },
];

const values = [
  { icon: <FlightTakeoff sx={{ fontSize: 40 }} />, title: "Adventure", description: "Creating unforgettable experiences" },
  { icon: <Public sx={{ fontSize: 40 }} />, title: "Global Reach", description: "Connecting you to worldwide destinations" },
  { icon: <EmojiPeople sx={{ fontSize: 40 }} />, title: "Personalized", description: "Tailored journeys just for you" },
];

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      setIsVisible(true); 
    }
  }, [inView]);

  return (
    <Box>
      {/* Hero Section with Parallax Effect */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${aboutBanner})`,

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          color: "#fff",
          textAlign: "center",
          py: { xs: 10, md: 15 },
          px: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Chip
            icon={<Star color="white" />}
            label="Since 2013"
            sx={{ 
              bgcolor: "rgba(255,255,255,0.2)", 
              color: "white", 
              mb: 3, 
              backdropFilter: "blur(10px)",
              fontSize: "1rem",
              py: 2,
            }}
          />
          <Typography 
            variant="h2" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              mb: 3,
            }}
          >
            About Iconic Yatra
          </Typography>
          <Typography 
            variant="h5" 
            maxWidth="800px" 
            mx="auto"
            sx={{
              fontWeight: 300,
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            We are more than just a travel agency. We craft unforgettable
            journeys, connecting you to the world's most iconic destinations.
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: "center",
            maxWidth: "800px",
            mx: "auto",
            mb: 6,
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Our Mission
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ lineHeight: 1.8 }}
          >
            At Iconic Yatra, our mission is to create meaningful travel
            experiences that go beyond sightseeing. We believe travel is about
            culture, adventure, and memories that last a lifetime.
          </Typography>
        </Box>

        {/* Values Grid */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {values.map((value, index) => (
            <Grid size={{xs:12, md:4}} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 4,
                  borderRadius: 4,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  height: "100%",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    color: "primary.main",
                    mb: 2,
                  }}
                >
                  {value.icon}
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {value.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {value.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Vision Section */}
      <Box sx={{ py: 8, bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
        <Container>
          <Grid container alignItems="center" spacing={6}>
            <Grid size={{xs:12, md:6}}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Chip
                  icon={<Visibility  color="white" />}
                  label="Our Vision"
                  sx={{ 
                    bgcolor: "primary.main", 
                    color: "white", 
                    mb: 3,
                    fontSize: "1rem",
                    py: 1.5,
                    px: 2,
                  }}
                />
                <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
                  Shaping the Future of Travel
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
                  We envision a world where travel transcends boundaries and creates meaningful 
                  connections between cultures. Our vision is to be the leading force in sustainable 
                  tourism, making extraordinary experiences accessible to all while preserving 
                  the beauty and heritage of our destinations for future generations.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Chip label="Sustainable Tourism" variant="outlined" color="primary" />
                  <Chip label="Cultural Exchange" variant="outlined" color="primary" />
                  <Chip label="Global Community" variant="outlined" color="primary" />
                </Box>
              </Box>
            </Grid>
            <Grid size={{xs:12, md:6}}>
              <Paper
                elevation={4}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  height: 400,
                  backgroundImage: `url(${about})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Goals Section */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip
            icon={<Flag color="white" />}
            label="Our Goals"
            sx={{ 
              bgcolor: "primary.main", 
              color: "white", 
              mb: 3,
              fontSize: "1rem",
              py: 1.5,
              px: 2,
            }}
          />
          <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
            Our Commitment to Excellence
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="800px" mx="auto">
            We are dedicated to achieving these key objectives to ensure we deliver exceptional value to our travelers
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid size={{xs:12, md:4}}>
            <Card sx={{ p: 3, borderRadius: 3, textAlign: "center", height: "100%" }}>
              <Box sx={{ fontSize: 60, color: "primary.main", mb: 2 }}><CrisisAlertIcon fontSize="auto" /></Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Customer Satisfaction
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Maintain a 98% customer satisfaction rate through personalized service and 
                attention to detail in every journey we curate.
              </Typography>
            </Card>
          </Grid>
          <Grid size={{xs:12, md:4}}>
            <Card sx={{ p: 3, borderRadius: 3, textAlign: "center", height: "100%" }}>
              <Box sx={{ fontSize: 60, color: "primary.main", mb: 2 }}><PublicIcon fontSize="auto"/></Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Sustainable Expansion
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Expand our destinations to 75+ countries by 2025 while implementing 
                eco-friendly travel practices across all our operations.
              </Typography>
            </Card>
          </Grid>
          <Grid size={{xs:12, md:4}}>
            <Card sx={{ p: 3, borderRadius: 3, textAlign: "center", height: "100%" }}>
              <Box sx={{ fontSize: 60, color: "primary.main", mb: 2 }}><HandshakeIcon fontSize="auto"/></Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Community Impact
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Support local communities in our destinations by directing 5% of 
                profits toward community development and cultural preservation projects.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box 
        sx={{ 
          bgcolor: "primary.main", 
          color: "white", 
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
        ref={ref}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(45deg, rgba(0,0,0,0.1) 0%, transparent 100%)",
          }}
        />
        <Container sx={{ position: "relative" }}>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Our Journey in Numbers
          </Typography>
          <Grid container spacing={4} textAlign="center">
            {/* Years of Excellence */}
            <Grid size={{xs:12, md:4}}>
              <Typography variant="h2" fontWeight="bold">
                {isVisible && <CountUp end={10} duration={2} />}+
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Years of Excellence
              </Typography>
            </Grid>

            {/* Happy Travelers */}
            <Grid size={{xs:12, md:4}}>
              <Typography variant="h2" fontWeight="bold">
                {isVisible && <CountUp end={5000} duration={3} />}+
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Happy Travelers
              </Typography>
            </Grid>

            {/* Destinations Covered */}
            <Grid size={{xs:12, md:4}}>
              <Typography variant="h2" fontWeight="bold">
                {isVisible && <CountUp end={50} duration={2.5} />}+
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Destinations Covered
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
            Meet Our Team
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
            Passionate travel experts dedicated to crafting your perfect journey
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {team.map((member, i) => (
            <Grid  size={{xs:12, sm:6, md:4}} key={i}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 4,
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { 
                    transform: "translateY(-8px)", 
                    boxShadow: 6,
                  },
                }}
              >
                <Avatar
                  src={member.img}
                  alt={member.name}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: "auto", 
                    mb: 2,
                    border: "4px solid",
                    borderColor: "primary.main",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    fontWeight="medium"
                    gutterBottom
                  >
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <IconButton size="small" sx={{ color: "#3b5998" }}>
                      <Facebook />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#1DA1F2" }}>
                      <Twitter />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#E1306C" }}>
                      <Instagram />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#0077B5" }}>
                      <LinkedIn />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          textAlign: "center",
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready for Your Next Adventure?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: "auto" }}>
            Let Iconic Yatra help you discover the world's most iconic destinations. 
            Your journey begins here.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: "#fff", 
              color: "primary.main", 
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1.1rem",
              "&:hover": {
                bgcolor: "#f5f5f5",
                transform: "translateY(-2px)",
                boxShadow: 4,
              },
              transition: "all 0.3s",
            }}
          >
            Plan Your Trip
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs;