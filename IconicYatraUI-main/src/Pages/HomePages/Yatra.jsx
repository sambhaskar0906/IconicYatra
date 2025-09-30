// src/pages/Yatra/Yatra.jsx
import React, { useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PackageCard from "../../Components/PackageCard";
import bannerImg from "../../assets/Banner/banner3.jpg";
import allDomesticPackageData from "../../Data/Domestic/packageData";

const Yatra = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const navigate = useNavigate();

  const loadMore = () => setVisibleCount((prev) => prev + 8);

  return (
    <>
      {/* Hero Banner */}
      <Box
        sx={{
          height: { xs: 220, md: 300 },
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          position: "relative",
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
            bgcolor: "rgba(0,0,0,0.5)",
          }}
        />
        {/* Banner Text */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.8rem", md: "2rem" } }}
          >
            ICONIC PACKAGES
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: { xs: "1rem", md: "1rem" } }}
          >
            Explore Our Best Travel Deals
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 5 }, width: "100%", py: 6 }}>
        {/* Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            ICONIC <span style={{ color: "red" }}>PACKAGES</span>
          </Typography>
          <Divider sx={{ mt: 1, borderColor: "#ccc", borderBottomWidth: 5 }} />
        </Box>

        {/* Cards Grid */}
        <Grid
          container
          spacing={3}
          sx={{ textAlign: "center", justifyContent: "center" }}
        >
          {allDomesticPackageData.slice(0, visibleCount).map((pkg) => (
            <Grid
              size={{ xs: 12, md: 3 }}
              key={pkg.id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{ width: "100%", maxWidth: 320, cursor: "pointer" }}
                onClick={() => navigate(`/package/${pkg.id}`)}
              >
                <PackageCard
                  title={pkg.title}
                  image={pkg.headerImage}
                  id={pkg.id}
                  dpkg={pkg.id}
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Load More Button */}
        {visibleCount < allDomesticPackageData.length && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={loadMore}
              sx={{
                width: { xs: "100%", sm: 300 },
                backgroundColor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 3,
                py: 1.5,
                "&:hover": { backgroundColor: "#43a047" },
              }}
            >
              Click More
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Yatra;