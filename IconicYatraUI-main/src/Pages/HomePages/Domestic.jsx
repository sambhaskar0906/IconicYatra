// src/Pages/HomePages/Domestic.jsx
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
import allDomesticPackageData from "../../Data/Domestic/packageData";

const Domestic = () => {
  const { destination } = useParams();
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState("All");

  useEffect(() => {
    console.log("Destination from URL:", destination);
    
    if (destination && destination !== "All") {
      // Decode the URL parameter (replace hyphens with spaces)
      const formattedDestination = destination.replace(/-/g, " ").toLowerCase();
      
      // Find matching destination
      const matched = allDomesticPackageData.find(
        (pkg) => pkg.title.toLowerCase() === formattedDestination
      );
      
      if (matched) {
        setSelectedDestination(matched.title);
      } else {
        setSelectedDestination("All");
      }
    } else {
      setSelectedDestination("All");
    }
  }, [destination]);

  // Filter packages based on selection
  const filteredPackages =
    selectedDestination === "All"
      ? allDomesticPackageData
      : allDomesticPackageData.filter(
          (pkg) => pkg.title.toLowerCase() === selectedDestination.toLowerCase()
        );

  const handleCardClick = (packageIndex) => {
    console.log("Navigating to package with ID:", packageIndex);
    // Use package index as ID in URL
    navigate(`/package/${packageIndex}`);
  };


  console.log("Selected destination:", selectedDestination);
  console.log("Filtered packages count:", filteredPackages.length);

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <MUILink 
              underline="hover" 
              color="inherit" 
              component={Link} 
              to="/"
            >
              Home
            </MUILink>
            <MUILink
              underline="hover"
              color="inherit"
              component={Link}
              to="/domestic"
            >
              Domestic Packages
            </MUILink>
            <Typography color="text.primary">
              {selectedDestination === "All" ? "All Packages" : selectedDestination}
            </Typography>
          </Breadcrumbs>
        </Paper>

      

        {/* Package Grid */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          textAlign: "center", 
          mb: 4,
          color: "primary.main",
          fontWeight: "bold"
        }}>
          {selectedDestination === "All" ? "All Domestic Packages" : selectedDestination}
        </Typography>

        {filteredPackages.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {filteredPackages.map((pkg) => {
              // Find the original index in allDomesticPackageData
              const originalIndex = allDomesticPackageData.findIndex(
                originalPkg => originalPkg.title === pkg.title
              );
              
              return (
                <Grid item key={originalIndex} xs={12} sm={6} md={4} lg={3}>
                  <PackageCard
                    image={pkg.headerImage}
                    title={pkg.title}
                    duration={pkg.sightseeing}
                    priceNote={pkg.priceNote}
                    onClick={() => handleCardClick(originalIndex)}
                  />
                </Grid>
              );
            })}
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
            fontStyle: "italic"
          }}
        >
          Showing {filteredPackages.length} of {allDomesticPackageData.length} packages
        </Typography>
      </Container>
    </Box>
  );
};

export default Domestic;