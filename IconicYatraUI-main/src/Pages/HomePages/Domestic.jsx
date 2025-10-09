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
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDomesticPackages } from "../../Features/packageSlice";
import PackageCard from "../../Components/PackageCard";
import { BASE_URL } from "../../Utils/axiosInstance";


const Domestic = () => {
  const { destination } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { domestic: packages, loading, error } = useSelector(
    (state) => state.packages
  );

  const [selectedDestination, setSelectedDestination] = useState("All");

  useEffect(() => {
    dispatch(fetchDomesticPackages());
  }, [dispatch]);


  // ✅ Handle destination filter (via URL param)
  useEffect(() => {
    if (destination && destination !== "All") {
      const formattedDestination = destination
        .replace(/-/g, " ")
        .toLowerCase()
        .trim();
      const matched = packages.find(
        (pkg) => pkg.title.toLowerCase().trim() === formattedDestination
      );
      setSelectedDestination(matched ? matched.title : "All");
    } else {
      setSelectedDestination("All");
    }
  }, [destination, packages]);

  // ✅ Filter logic
  const filteredPackages =
    selectedDestination === "All"
      ? packages
      : packages.filter(
        (pkg) =>
          pkg.title.toLowerCase().trim() ===
          selectedDestination.toLowerCase().trim()
      );

  // ✅ Handle click
  const handleCardClick = (id) => {
    navigate(`/package/${id}`);
  };

  // ✅ Loading / Error states
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // ✅ Main UI
  return (
    <Box sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <MUILink underline="hover" color="inherit" component={Link} to="/">
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
            <Typography color="text.primary" fontWeight="bold">
              {selectedDestination === "All"
                ? "All Packages"
                : selectedDestination}
            </Typography>
          </Breadcrumbs>
        </Paper>

        {/* Heading */}
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(90deg, #ff5722, #e91e63)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {selectedDestination === "All"
              ? "All Domestic Packages"
              : selectedDestination}
          </Typography>
          <Divider
            sx={{
              width: "150px",
              mx: "auto",
              my: 2,
              height: "4px",
              borderRadius: 2,
              background:
                "linear-gradient(90deg, #ff9800, #f44336)",
            }}
          />
          <Typography variant="subtitle1" color="text.secondary">
            Discover the best domestic travel packages
          </Typography>
        </Box>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {filteredPackages.map((pkg) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                key={pkg._id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <PackageCard
                  image={
                    pkg.bannerImage
                      ? pkg.bannerImage.startsWith("http")
                        ? pkg.bannerImage
                        : pkg.bannerImage.startsWith("/upload/")
                          ? `${BASE_URL}${pkg.bannerImage}`
                          : `${BASE_URL}/upload/${pkg.bannerImage}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  title={pkg.title || "No Title"}
                  location={`${pkg.sector || "Unknown Sector"}, ${pkg.arrivalCity || "Unknown City"}`}
                  onClick={() => handleCardClick(pkg._id)}
                  onQueryClick={() => console.log("Query:", pkg._id)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            elevation={3}
            sx={{
              p: 5,
              mt: 4,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h5" color="text.secondary">
              No packages found for "{selectedDestination}"
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Please try selecting a different destination filter.
            </Typography>
          </Paper>
        )}

        {/* Footer Info */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: "center",
            mt: 6,
            fontStyle: "italic",
          }}
        >
          Showing {filteredPackages.length} of {packages.length} packages
        </Typography>
      </Container>
    </Box>
  );
};

export default Domestic;
