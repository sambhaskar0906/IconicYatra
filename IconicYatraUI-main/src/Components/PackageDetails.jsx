import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Breadcrumbs,
  Link as MUILink,
  Chip,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardMedia,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  People,
  Warning,
  Schedule,
  Hotel
} from "@mui/icons-material";
import { fetchPackageById, clearSelected } from "../Features/packageSlice";

const PackageDetail = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selected, loading, error } = useSelector(state => state.packages);

  useEffect(() => {
    if (packageId) {
      dispatch(fetchPackageById(packageId));
    }
    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, packageId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={handleBackClick} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!selected) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={handleBackClick} sx={{ mb: 2 }}>
          Back
        </Button>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" color="error" gutterBottom>
            Package Not Found
          </Typography>
          <Button variant="contained" component={Link} to="/domestic">
            Browse All Packages
          </Button>
        </Paper>
      </Container>
    );
  }

  const packageData = selected;

  return (
    <>
      <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* Back Button */}
          <Button startIcon={<ArrowBack />} onClick={handleBackClick} sx={{ mb: 2 }} variant="outlined">
            Back to Packages
          </Button>

          {/* Breadcrumbs */}
          <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <MUILink underline="hover" color="inherit" component={Link} to="/">
                Home
              </MUILink>
              <MUILink underline="hover" color="inherit" component={Link} to="/domestic">
                Domestic Packages
              </MUILink>
              <Typography color="text.primary">{packageData.title}</Typography>
            </Breadcrumbs>
          </Paper>

          {/* Package Header */}
          <Card elevation={3} sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
            <CardMedia
              component="img"
              height="400"
              image={
                packageData.bannerImage
                  ? packageData.bannerImage.startsWith("http")
                    ? packageData.bannerImage
                    : `http://localhost:5000${packageData.bannerImage.startsWith("/") ? "" : "/upload/"}${packageData.bannerImage}`
                  : "https://via.placeholder.com/800x400?text=No+Image"
              }
              alt={packageData.title}
              sx={{ objectFit: "cover" }}
            />
            <Box sx={{ p: 4, backgroundColor: "#fff" }}>
              <Typography variant="h3" gutterBottom color="primary" sx={{ fontWeight: "bold" }}>
                {packageData.title}
              </Typography>

              <Grid container spacing={4} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Schedule color="primary" /></ListItemIcon>
                      <ListItemText
                        primary="Duration"
                        secondary={packageData.stayLocations?.map(s => `${s.nights} Nights in ${s.city}`).join(", ")}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Hotel color="primary" /></ListItemIcon>
                      <ListItemText
                        primary="Total Nights"
                        secondary={packageData.stayLocations?.reduce((sum, loc) => sum + loc.nights, 0)}
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CalendarToday color="primary" /></ListItemIcon>
                      <ListItemText
                        primary="Valid Till"
                        secondary={new Date(packageData.validTill).toDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><People color="primary" /></ListItemIcon>
                      <ListItemText
                        primary="Meal Plan"
                        secondary={packageData.mealPlan?.planType}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              {packageData.notes && (
                <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8 }}>
                  {packageData.notes}
                </Typography>
              )}
            </Box>
          </Card>

          {/* Itinerary Section */}
          <Typography
            variant="h4"
            gutterBottom
            color="primary"
            sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
          >
            Detailed Itinerary
          </Typography>

          {packageData.days?.map((day, index) => (
            <Card
              key={index}
              elevation={4}
              sx={{
                mb: 5,
                borderRadius: 3,
                overflow: "hidden",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }
              }}
            >
              <Grid container spacing={0}>
                {/* Image Side */}
                {day.dayImage && (
                  <Grid size={{ xs: 12, md: 5 }}>
                    <CardMedia
                      component="img"
                      image={
                        day.dayImage && day.dayImage.trim() !== ""
                          ? day.dayImage.startsWith("http")
                            ? day.dayImage
                            : `http://localhost:5000/upload/${day.dayImage}`
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={day.title}
                      sx={{
                        height: 250,
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.05)" }
                      }}
                    />

                  </Grid>
                )}

                {/* Text Side */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ p: 4, backgroundColor: "#fafafa" }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      color="secondary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {day.title}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      {day.notes}
                    </Typography>
                    {day.aboutCity && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 2, fontStyle: "italic", color: "text.secondary" }}
                      >
                        {day.aboutCity}
                      </Typography>
                    )}
                    {day.selectedSightseeing?.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Sightseeing:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                          {day.selectedSightseeing.map((s, idx) => (
                            <Chip
                              key={idx}
                              label={s}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Card>
          ))}


        </Container >
      </Box >
      {/* Call to Action */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          textAlign: "center",
          backgroundColor: "#f5f5f5", // Changed to light gray
          color: "#333", // Dark text for contrast
          mt: 4,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          Ready to Book This Package?
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Contact us for pricing and availability
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={Link} to="/contact">
          Contact Us Now
        </Button>
      </Paper>
    </>
  );
};

export default PackageDetail;
