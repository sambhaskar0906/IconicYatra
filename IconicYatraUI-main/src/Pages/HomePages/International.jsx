// src/Pages/HomePages/International.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Breadcrumbs,
  Link as MUILink,
  Container,
} from "@mui/material";
import PackageCard from "../../Components/PackageCard";
import allInternationalPackageData from "../../Data/International/packageData";

const International = () => {
  const { destination } = useParams();
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState("All");

  useEffect(() => {
    if (destination && destination !== "All") {
      const formattedDestination = destination.replace(/-/g, " ").toLowerCase();
      const matched = allInternationalPackageData.find(
        (pkg) => pkg.title.toLowerCase() === formattedDestination
      );
      setSelectedDestination(matched ? matched.title : "All");
    } else {
      setSelectedDestination("All");
    }
  }, [destination]);

  const filteredPackages =
    selectedDestination === "All"
      ? allInternationalPackageData
      : allInternationalPackageData.filter(
        (pkg) => pkg.title.toLowerCase() === selectedDestination.toLowerCase()
      );

  // ✅ Updated navigation
  const handleCardClick = (packageId) => {
    navigate(`/internationalpackage/${packageId}`);
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <MUILink underline="hover" color="inherit" component={Link} to="/">
              Home
            </MUILink>
            <MUILink underline="hover" color="inherit" component={Link} to="/international">
              International Packages
            </MUILink>
            <Typography color="text.primary">
              {selectedDestination === "All" ? "All Packages" : selectedDestination}
            </Typography>
          </Breadcrumbs>
        </Paper>

        {/* Title */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            mb: 4,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {selectedDestination === "All" ? "All International Packages" : selectedDestination}
        </Typography>

        {/* Package Grid */}
        {filteredPackages.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {filteredPackages.map((pkg) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={pkg.id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.2)",
                  },
                }}>
                <PackageCard
                  image={pkg.headerImage}
                  title={pkg.title}
                  duration={pkg.sightseeing}
                  priceNote={pkg.priceNote}
                  onClick={() => handleCardClick(pkg.id)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" color="text.secondary">
              No packages found for "{selectedDestination}"
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Please try selecting a different destination filter.
            </Typography>
          </Paper>
        )}

        {/* Total Packages Count */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: "center",
            mt: 4,
            fontStyle: "italic",
          }}
        >
          Showing {filteredPackages.length} of {allInternationalPackageData.length} packages
        </Typography>
      </Container>
    </Box>
  );
};

export default International;
