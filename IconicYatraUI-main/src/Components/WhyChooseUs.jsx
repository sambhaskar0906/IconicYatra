import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Safe and Secure Travel",
    description:
      "A safe and secure journey is our top priority — ensuring peace of mind every step of the way.",
    path: "/safe-and-secure-travel",
  },
  {
    title: "100% Guaranteed Services",
    description:
      "We go the extra mile to make your holidays seamless, reliable, and worry-free.",
    path: "/guaranteed-services",
  },
  {
    title: "100% Satisfaction",
    description:
      "Your happiness is our goal — personalized services designed just for you.",
    path: "/satisfaction",
  },
  {
    title: "Reliable & Trusted Travel Agency",
    description:
      "With years of expertise, Iconic Yatra is your reliable travel partner.",
    path: "/reliable-and-trusted-agency",
  },
];

const WhyChooseUs = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: 8, width: "100%" }}>
      {/* Section Heading */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ position: "relative", display: "inline-block" }}
        >
          Why Choose <span style={{ color: "#ff5722" }}>Iconic Yatra?</span>
          <Box
            sx={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: "3px",
              bgcolor: "#ff5722",
              borderRadius: 2,
            }}
          />
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mt: 2, maxWidth: 600, mx: "auto" }}
        >
          Experience unmatched travel services designed to make your journey
          safe, comfortable, and memorable.
        </Typography>
      </Box>

      {/* Features Grid */}
      <Grid container spacing={6} justifyContent="center">
        {features.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              onClick={() => navigate(item.path)}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                },
              }}
            >
              {/* Circle Icon */}
              <Paper
                elevation={6}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ff5722, #ff9800)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                  transition: "all 0.4s ease",
                  "&:hover": {
                    boxShadow: "0px 10px 25px rgba(255, 87, 34, 0.5)",
                  },
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 30 }} />
              </Paper>

              {/* Title */}
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 1 }}
              >
                {item.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 220, mx: "auto" }}
              >
                {item.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WhyChooseUs;
