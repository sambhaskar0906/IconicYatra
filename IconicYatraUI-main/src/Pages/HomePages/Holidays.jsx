// src/pages/Holidays/Holidays.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PackageCard from "../../Components/PackageCard";
import bannerImg from "../../assets/Banner/banner1.jpg";
import allInternationalPackageData from "../../Data/International/packageData";

const Holidays = () => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(8);

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
            HOLIDAY PACKAGES
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: "1rem" }}>
            Choose Your Dream Destination
          </Typography>
        </Box>
      </Box>

      {/* Packages Section */}
      <Box
        sx={{ p: { xs: 2, md: 5 }, background: "#f8f8f8", minHeight: "100vh" }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            HOLIDAYS <span style={{ color: "red" }}>PACKAGES</span>
          </Typography>
          <Divider sx={{ mt: 1, borderColor: "#ccc", borderBottomWidth: 5 }} />
        </Box>

        <Grid
          container
          spacing={3}
          sx={{ justifyContent: "center", textAlign: "center" }}
        >
          {allInternationalPackageData.slice(0, visibleCount).map((pkg) => (
            <Grid
              size={{ xs: 12, md: 3 }}
              key={pkg.id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                onClick={() => navigate(`/internationalpackage/${pkg.id}`)}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
                  },
                }}
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
        {visibleCount < allInternationalPackageData.length && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={loadMore}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                fontWeight: "bold",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              Load More
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Holidays;