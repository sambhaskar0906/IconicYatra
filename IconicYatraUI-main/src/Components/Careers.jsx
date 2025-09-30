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
    { icon: <FlightTakeoffIcon fontSize="large" color="primary" />, title: "Travel Perks", desc: "Experience the destinations we create for our travelers." },
    { icon: <WorkIcon fontSize="large" color="primary" />, title: "Growth Opportunities", desc: "Advance your career with training, mentorship, and projects that inspire." },
    { icon: <EmojiEventsIcon fontSize="large" color="primary" />, title: "Impactful Work", desc: "Help people build unforgettable travel memories." },
    { icon: <PeopleIcon fontSize="large" color="primary" />, title: "Supportive Team", desc: "Join passionate explorers who share your love for travel." },
  ];

  const jobs = [
    { title: "Travel Consultant", type: "Full-Time", location: "Delhi, India" },
    { title: "Digital Marketing Executive", type: "Full-Time", location: "Remote / Hybrid" },
    { title: "Operations Executive", type: "Full-Time", location: "Mumbai, India" },
    { title: "Content Creator / Blogger", type: "Part-Time", location: "Remote" },
  ];

  const teamImages = [teamImage1, teamImage2, teamImage3, teamImage4];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          color: "#fff",
          py: 12,
          textAlign: "center",
          background: `url(${carrerBanner}) center/cover no-repeat`,
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // dark overlay with 50% opacity
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant={isMobile ? "h4" : "h2"}
            fontWeight="bold"
            sx={{ animation: `${float} 6s ease-in-out infinite` }}
          >
            Careers at Iconic Yatra
          </Typography>
          <Typography variant="h6" mt={2} sx={{ maxWidth: 700, mx: "auto" }}>
            Join our journey. Create memories. Build your career in travel with us.
          </Typography>
        </Container>
      </Box>


      {/* Why Work With Us */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom color="primary">
          Why Work With Us?
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: "auto" }}>
          We're building a culture that empowers our team to grow professionally while exploring the world.
        </Typography>
        <Grid container spacing={4}>
          {perks.map((perk, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ textAlign: "center", py: 4, borderRadius: 3, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                <CardContent>
                  <Box sx={{ display: "inline-flex", p: 2, borderRadius: "50%", bgcolor: "#f5f5f5", mb: 2 }}>
                    {perk.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" mt={2}>{perk.title}</Typography>
                  <Typography variant="body2" mt={1} color="text.secondary">{perk.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Life at Iconic Yatra */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom color="primary">
          Life at Iconic Yatra
        </Typography>
        <Grid container spacing={3}>
          {teamImages.map((image, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Box component="img" src={image} alt={`Team ${i + 1}`} sx={{ width: "100%", borderRadius: 3, height: 250, objectFit: "cover" }} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "primary.main", color: "#fff", py: 5, textAlign: "center" }}>
        <Container>
          <Typography variant="h4" fontWeight="bold">Ready for Your Next Adventure?</Typography>
        </Container>
      </Box>
    </Box>
  );
}
