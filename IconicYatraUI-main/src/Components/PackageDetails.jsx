// src/Components/PackageDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  People,
  Warning,
  Schedule,
  Hotel,
} from "@mui/icons-material";
import allDomesticPackageData from "../Data/Domestic/packageData";

const PackageDetail = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("PackageDetail mounted with id:", packageId);
    
    if (packageId) {
      // Find the package by ID (convert packageId to number)
      const packageIdNum = parseInt(packageId, 10);
      const foundPackage = allDomesticPackageData.find(
        (pkg, index) => index === packageIdNum
      );
      
      console.log("Found package:", foundPackage);
      setPackageData(foundPackage);
    }
    
    setLoading(false);
  }, [packageId]);

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh" 
      }}>
        <Typography variant="h6">Loading package details...</Typography>
      </Box>
    );
  }

  if (!packageData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBackClick}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" color="error" gutterBottom>
            Package Not Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The package with ID "{packageId}" could not be found.
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/domestic"
          >
            Browse All Packages
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBackClick}
          sx={{ mb: 2 }}
          variant="outlined"
        >
          Back to Packages
        </Button>

        {/* Breadcrumbs */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
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
        <Card elevation={3} sx={{ mb: 4, overflow: "hidden" }}>
          <CardMedia
            component="img"
            height="400"
            image={packageData.headerImage}
            alt={packageData.title}
            sx={{ objectFit: "cover" }}
          />
          
          <Box sx={{ p: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
              {packageData.title}
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid size={{xs:12, md:6}}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Duration" 
                      secondary={packageData.sightseeing} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Hotel color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Nights" 
                      secondary={packageData.nights} 
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid size={{xs:12, md:6}}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Valid Till" 
                      secondary={packageData.validTill} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <People color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Price Basis" 
                      secondary={packageData.priceNote} 
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            {/* Not Valid During */}
            {packageData.notValidDuring && packageData.notValidDuring.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                  <Warning sx={{ mr: 1, color: "warning.main" }} /> 
                  Not Valid During:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {packageData.notValidDuring.map((period, index) => (
                    <Chip 
                      key={index} 
                      label={period} 
                      color="warning" 
                      variant="outlined" 
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Card>

        {/* Itinerary Section */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom color="primary" sx={{ mb: 3 }}>
            Detailed Itinerary
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            {packageData.days.map((day, index) => (
              <Card key={index} elevation={2} sx={{ mb: 3, overflow: "hidden" }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" component="h3" gutterBottom color="secondary">
                    {day.day}
                  </Typography>
                  
                  <Grid container spacing={3} alignItems="center">
                    <Grid size={{xs:12, md:4}}>
                      <CardMedia
                        component="img"
                        image={day.image}
                        alt={day.day}
                        sx={{ 
                          borderRadius: 2,
                          height: 200,
                          objectFit: "cover"
                        }}
                      />
                    </Grid>
                    
                    <Grid size={{xs:12, md:8}}>
                      <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                        {day.description}
                      </Typography>
                      
                      {day.note && (
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            backgroundColor: "primary.light",
                            color: "primary.contrastText",
                            borderRadius: 1
                          }}
                        >
                          <Typography variant="body2" fontStyle="italic">
                            <strong>Note:</strong> {day.note}
                          </Typography>
                        </Paper>
                      )}
                    </Grid>
                  </Grid>
                </Box>
                
                {index < packageData.days.length - 1 && (
                  <Divider sx={{ mx: 3 }} />
                )}
              </Card>
            ))}
          </Box>

          {/* Call to Action */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              backgroundColor: "success.light",
              color: "success.contrastText",
              textAlign: "center"
            }}
          >
            <Typography variant="h6" gutterBottom>
              Ready to Book This Package?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Contact us for pricing and availability
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link}
              to="/contact"
            >
              Contact Us Now
            </Button>
          </Paper>
        </Paper>
      </Container>
    </Box>
  );
};

export default PackageDetail;