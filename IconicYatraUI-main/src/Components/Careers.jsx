import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { keyframes } from "@mui/system";
import carrerBanner from "../assets/Banner/careersBanner.jpg";
import teamImage1 from "../assets/Banner/banner1.jpg";
import teamImage2 from "../assets/Banner/banner2.jpg";
import teamImage3 from "../assets/Banner/banner3.jpg";
import teamImage4 from "../assets/Banner/banner4.jpg";

// Animation for floating elements
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export default function CareersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const perks = [
    {
      icon: <FlightTakeoffIcon fontSize="large" color="primary" />,
      title: "Travel Perks",
      desc: "Experience the destinations we create for our travelers.",
    },
    {
      icon: <WorkIcon fontSize="large" color="primary" />,
      title: "Growth Opportunities",
      desc: "Advance your career with training, mentorship, and projects that inspire.",
    },
    {
      icon: <EmojiEventsIcon fontSize="large" color="primary" />,
      title: "Impactful Work",
      desc: "Help people build unforgettable travel memories.",
    },
    {
      icon: <PeopleIcon fontSize="large" color="primary" />,
      title: "Supportive Team",
      desc: "Join passionate explorers who share your love for travel.",
    },
  ];

  const jobs = [
    { title: "Travel Consultant", type: "Full-Time", location: "Delhi, India" },
    {
      title: "Digital Marketing Executive",
      type: "Full-Time",
      location: "Remote / Hybrid",
    },
    {
      title: "Operations Executive",
      type: "Full-Time",
      location: "Mumbai, India",
    },
    { title: "Content Creator / Blogger", type: "Part-Time", location: "Remote" },
  ];

  // Array of different team images
  const teamImages = [
    teamImage1,
    teamImage2,
    teamImage3,
    teamImage4
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(${alpha(theme.palette.primary.dark, 0.7)}, ${alpha(theme.palette.secondary.main, 0.7)}), url(${carrerBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          color: "white",
          py: 15,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100px",
            background: "linear-gradient(to top, #fff, transparent)",
            zIndex: 1,
          }
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            fontWeight="bold"
            sx={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              animation: `${float} 6s ease-in-out infinite`,
            }}
          >
            Careers at Iconic Yatra
          </Typography>
          <Typography variant="h6" mt={2} sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
            Join our journey. Create memories. Build your career in travel with us.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              mt: 2, 
              px: 4, 
              py: 1.5,
              borderRadius: 3,
              fontSize: "1.1rem",
              boxShadow: `0 6px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.4)}`,
              },
              transition: "all 0.3s ease",
            }}
          >
            Apply Now
          </Button>
        </Container>
      </Box>

      {/* Why Work With Us */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          color="primary"
        >
          Why Work With Us?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: "auto" }}>
          We're building a culture that empowers our team to grow professionally while exploring the world.
        </Typography>
        <Grid container spacing={4} mt={2}>
          {perks.map((perk, index) => (
            <Grid size={{xs:12, sm:6, md:3}} key={index}>
              <Card 
                sx={{ 
                  textAlign: "center", 
                  py: 4, 
                  height:"280px",
                  borderRadius: 4,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      borderRadius: "50%",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      mb: 2,
                    }}
                  >
                    {perk.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    {perk.title}
                  </Typography>
                  <Typography variant="body2" mt={1} color="text.secondary">
                    {perk.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Open Positions */}
      <Box sx={{ 
        bgcolor: "background.default", 
        py: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100px",
          background: "linear-gradient(to bottom, #fff, transparent)",
          zIndex: 1,
        }
      }}>
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            color="primary"
          >
            Open Positions
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: "auto" }}>
            Join our team of passionate travel enthusiasts and help create unforgettable experiences.
          </Typography>
          <Grid container spacing={3} mt={2}>
            {jobs.map((job, i) => (
              <Grid size={{xs:12, md:6}} key={i}>
                <Card 
                  sx={{ 
                    p: 4, 
                    borderRadius: 4,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {job.title}
                  </Typography>
                  <Box mt={1} mb={3}>
                    <Chip 
                      label={job.type} 
                      color="primary" 
                      size="small" 
                      sx={{ 
                        mr: 1, 
                        fontWeight: "bold",
                        borderRadius: 1
                      }} 
                    />
                    <Chip 
                      label={job.location} 
                      variant="outlined" 
                      size="small" 
                      sx={{ 
                        fontWeight: "medium",
                        borderRadius: 1
                      }} 
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    href="mailto:careers@iconicyatra.com"
                    sx={{ 
                      borderRadius: 3,
                      fontWeight: "bold",
                    }}
                  >
                    Apply Now
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Life at Iconic Yatra */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          color="primary"
        >
          Life at Iconic Yatra
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: "auto" }}>
          We believe in working hard, exploring often, and creating memories together.
        </Typography>
        <Grid container spacing={3} mt={2}>
          {teamImages.map((image, i) => (
            <Grid size={{xs:12, sm:6, md:3}} key={i}>
              <Box
                component="img"
                src={image}
                alt={`Team life at Iconic Yatra ${i+1}`}
                sx={{ 
                  width: "100%", 
                  height: 250,
                  objectFit: "cover",
                  borderRadius: 4,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
        
      </Container>

      {/* CTA Section */}
      <Box sx={{ 
        bgcolor: "primary.main", 
        color: "white", 
        py: 10,
        textAlign: "center",
      }}>
        <Container>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready for Your Next Adventure?
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
            Send us your resume, and let's explore the possibilities together.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            href="mailto:careers@iconicyatra.com"
            sx={{ 
              px: 5, 
              py: 1.5,
              borderRadius: 3,
              fontSize: "1.1rem",
              fontWeight: "bold",
              boxShadow: `0 6px 12px ${alpha("#000", 0.2)}`,
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: `0 8px 16px ${alpha("#000", 0.3)}`,
              },
              transition: "all 0.3s ease",
            }}
          >
            Send Your Resume
          </Button>
        </Container>
      </Box>
    </Box>
  );
}