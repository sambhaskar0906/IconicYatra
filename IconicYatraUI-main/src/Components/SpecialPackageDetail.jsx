// src/Pages/PackageDetails/InternationalPackageDetailPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Paper,
    Link as MUILink,
    Grid,
    Card,
    CardMedia,
    CardContent,
} from "@mui/material";
import allInternationalPackageData from "../Data/specialPackagesData";

const SpecialPackageDetail = () => {
    const { packageId } = useParams();
    const pkg = allInternationalPackageData.find(
        (p) => p.id === parseInt(packageId)
    );

    if (!pkg) {
        return (
            <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="h5" color="error">
                    Package not found
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    The package you are looking for does not exist.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", py: 4 }}>
            <Container maxWidth="lg">

                {/* Header */}
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
                >
                    {pkg.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {pkg.sightseeing} | {pkg.nights}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Valid Till:</strong> {pkg.validTill}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Not Valid During:</strong> {pkg.notValidDuring.join(", ")}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Price Note:</strong> {pkg.priceNote}
                </Typography>

                {/* Header Image */}
                <Paper
                    elevation={3}
                    sx={{ mt: 3, mb: 5, borderRadius: 2, overflow: "hidden" }}
                >
                    <CardMedia
                        component="img"
                        height="400"
                        image={pkg.headerImage}
                        alt={pkg.title}
                        sx={{ objectFit: "cover" }}
                    />
                </Paper>

                {/* Day Wise Itinerary */}
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold", mb: 3 }}
                >
                    Day-wise Itinerary
                </Typography>
                <Grid container spacing={3}>
                    {pkg.days.map((dayItem, index) => (
                        <Grid size={{ xs: 12 }} key={index}>
                            <Card elevation={2} sx={{ display: "flex", borderRadius: 2 }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 220, objectFit: "cover" }}
                                    image={dayItem.image}
                                    alt={dayItem.day}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom color="primary">
                                        {dayItem.day}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {dayItem.description}
                                    </Typography>
                                    {dayItem.note && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 1, fontStyle: "italic" }}
                                        >
                                            Note: {dayItem.note}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default SpecialPackageDetail;