// src/components/Form/TourDetailsForm.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    TextField,
    Typography,
    Button,
    Paper,
    IconButton,
    Autocomplete,
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch, useSelector } from "react-redux";
import { updatePackageTourDetails, fetchPackages } from "../../../../features/package/packageSlice";
import { fetchCities } from "../../../../features/allcities/citySlice";
import { useNavigate } from "react-router-dom";
import axios from "../../../../utils/axios";

const TourDetailsForm = ({ onNext, initialData, packageId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cities, loading } = useSelector((state) => state.cities);
    const [hotelOptions, setHotelOptions] = useState({});

    const [tourDetails, setTourDetails] = useState({
        arrivalCity: initialData?.arrivalCity || "",
        departureCity: initialData?.departureCity || "",
        title: initialData?.title || "",
        notes: initialData?.notes || "This is only tentative schedule for sightseeing and travel. Actual sightseeing may get affected due to weather, road conditions, local authority notices, shortage of timing, or off days.",
        bannerImage: initialData?.bannerImage || null,
        validFrom: initialData?.validFrom || null,
        validTill: initialData?.validTill || null,
        days:
            initialData?.days && initialData.days.length > 0
                ? initialData.days.map((d) => ({
                    title: d.title || "",
                    notes: d.notes || "",
                    aboutCity: d.aboutCity || "",
                    dayImage: d.dayImage || null,
                    sightseeing: d.sightseeing || [],
                    selectedSightseeing: d.selectedSightseeing || [],
                }))
                : [
                    {
                        title: "",
                        notes: "",
                        aboutCity: "",
                        dayImage: null,
                        sightseeing: [],
                        selectedSightseeing: [],
                    },
                ],
        perPerson: initialData?.perPerson || 1,
        mealPlan: {
            planType: initialData?.mealPlan?.planType || "",
            description: initialData?.mealPlan?.description || "",
        },
        destinationNights: (initialData?.destinationNights?.length > 0
            ? initialData.destinationNights
            : (initialData?.stayLocations || []).map((s) => ({
                destination: s.city || "",
                nights: s.nights || 0,
                hotels: [
                    { category: "standard", hotelName: "TBD", pricePerPerson: 0 },
                    { category: "deluxe", hotelName: "TBD", pricePerPerson: 0 },
                    { category: "superior", hotelName: "TBD", pricePerPerson: 0 },
                ],
            }))
        ).map(dest => ({
            ...dest,
            hotels: [
                {
                    category: "standard",
                    hotelName: dest.hotels[0]?.hotelName || "TBD",
                    pricePerPerson: dest.hotels[0]?.pricePerPerson || 0,
                },
                {
                    category: "deluxe",
                    hotelName: dest.hotels[1]?.hotelName || "TBD",
                    pricePerPerson: dest.hotels[1]?.pricePerPerson || 0,
                },
                {
                    category: "superior",
                    hotelName: dest.hotels[2]?.hotelName || "TBD",
                    pricePerPerson: dest.hotels[2]?.pricePerPerson || 0,
                },
            ]
        })),
    });

    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);

    // 🟢 Change handlers
    const handleDayChange = (index, field, value) => {
        const updatedDays = [...tourDetails.days];
        updatedDays[index][field] = value;
        setTourDetails({ ...tourDetails, days: updatedDays });
    };

    const handleAddDay = () => {
        setTourDetails({
            ...tourDetails,
            days: [
                ...tourDetails.days,
                {
                    title: "",
                    notes: "",
                    aboutCity: "",
                    dayImage: null,
                    sightseeing: [],
                    selectedSightseeing: [],
                },
            ],
        });
    };

    const handleRemoveDay = (index) => {
        setTourDetails({
            ...tourDetails,
            days: tourDetails.days.filter((_, i) => i !== index),
        });
    };

    // 🟢 Sightseeing
    const handleAddSightseeing = (dayIndex, e) => {
        if (e.key === "Enter" && e.target.value.trim() !== "") {
            e.preventDefault();
            const updatedDays = [...tourDetails.days];
            const newSight = e.target.value.trim();

            // Add to sightseeing (for record)
            updatedDays[dayIndex].sightseeing.push(newSight);

            // Add to selectedSightseeing automatically
            updatedDays[dayIndex].selectedSightseeing.push(newSight);

            setTourDetails({ ...tourDetails, days: updatedDays });
            e.target.value = "";
        }
    };


    // 🟢 Save (API Call)
    const handleSubmit = async () => {
        let textUpdateSuccess = false;

        // 1️⃣ Update textual data
        try {
            const payload = {
                arrivalCity: tourDetails.arrivalCity,
                departureCity: tourDetails.departureCity,
                title: tourDetails.title,
                notes: tourDetails.notes,
                validFrom: tourDetails.validFrom,
                validTill: tourDetails.validTill,
                mealPlan: {
                    planType: tourDetails.mealPlan?.planType || "",
                    description: tourDetails.mealPlan?.description || "",
                },
                days: tourDetails.days.map((day) => ({
                    title: day.title,
                    notes: day.notes,
                    aboutCity: day.aboutCity,
                    sightseeing: day.sightseeing,
                    selectedSightseeing: day.selectedSightseeing || [],
                    dayImage: typeof day.dayImage === "string" ? day.dayImage : "",
                })),
                destinationNights: tourDetails.destinationNights.map(dest => ({
                    destination: dest.destination || "",
                    nights: dest.nights || 0,
                    hotels: [
                        dest.hotels[0] || { category: "standard", hotelName: "", pricePerPerson: 0 },
                        dest.hotels[1] || { category: "deluxe", hotelName: "", pricePerPerson: 0 },
                        dest.hotels[2] || { category: "superior", hotelName: "", pricePerPerson: 0 },
                    ]
                })),
                perPerson: tourDetails.perPerson || 1,
            };

            await dispatch(updatePackageTourDetails({ id: packageId, data: payload })).unwrap();
            await dispatch(fetchPackages()).unwrap();

            textUpdateSuccess = true; // ✅ mark textual update success
        } catch (err) {
            console.error("❌ Failed to update textual details:", err.response?.data || err.message);
            alert("❌ Failed to save textual tour details");
        }

        // 2️⃣ Banner image
        if (tourDetails.bannerImage instanceof File) {
            try {
                const formData = new FormData();
                formData.append("banner", tourDetails.bannerImage);
                await axios.post(`/packages/${packageId}/banner`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } catch (err) {
                console.warn("⚠️ Banner upload failed:", err.response?.data || err.message);
            }
        }

        // 3️⃣ Day images
        for (let i = 0; i < tourDetails.days.length; i++) {
            const day = tourDetails.days[i];
            if (day.dayImage instanceof File) {
                try {
                    const formData = new FormData();
                    formData.append("dayImage", day.dayImage);
                    await axios.post(`/packages/${packageId}/days/${i}/image`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                } catch (err) {
                    console.warn(`⚠️ Day ${i + 1} image upload failed:`, err.response?.data || err.message);
                }
            }
        }

        // ✅ Finally navigate if textual update succeeded
        if (textUpdateSuccess) {
            alert("✅ Tour details saved!");
            navigate("/tourpackage");
        }
    };

    const handleHotelChange = (destIndex, category, hotelName) => {
        const updatedNights = [...tourDetails.destinationNights];
        const catIndex = ["standard", "deluxe", "superior"].indexOf(category);

        if (!updatedNights[destIndex].hotels) updatedNights[destIndex].hotels = [];

        updatedNights[destIndex].hotels[catIndex] = {
            ...updatedNights[destIndex].hotels[catIndex],
            category,
            hotelName,
        };

        setTourDetails({ ...tourDetails, destinationNights: updatedNights });
    };

    const handlePriceChange = (destIndex, category, price) => {
        const updatedNights = [...tourDetails.destinationNights];
        const catIndex = ["standard", "deluxe", "superior"].indexOf(category);

        if (!updatedNights[destIndex].hotels) updatedNights[destIndex].hotels = [];

        updatedNights[destIndex].hotels[catIndex] = {
            ...updatedNights[destIndex].hotels[catIndex],
            category,
            pricePerPerson: Number(price),
        };

        setTourDetails({ ...tourDetails, destinationNights: updatedNights });
    };


    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
                Tour Details
            </Typography>

            {/* Basic Info */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Autocomplete
                        options={cities.map((city) => city.city)}
                        loading={loading}
                        value={tourDetails.arrivalCity || null}
                        onChange={(e, newValue) =>
                            setTourDetails({ ...tourDetails, arrivalCity: newValue })
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Arrival City" fullWidth />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Autocomplete
                        options={cities.map((city) => city.city)}
                        value={tourDetails.departureCity || null}
                        onChange={(e, newValue) =>
                            setTourDetails({ ...tourDetails, departureCity: newValue })
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Departure City" fullWidth />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth
                        label="Package Title"
                        value={tourDetails.title}
                        onChange={(e) =>
                            setTourDetails({ ...tourDetails, title: e.target.value })
                        }
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Initial Notes"
                        value={tourDetails.notes}
                        onChange={(e) =>
                            setTourDetails({ ...tourDetails, notes: e.target.value })
                        }
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Button variant="contained" component="label">
                        Upload Banner Image
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setTourDetails({
                                    ...tourDetails,
                                    bannerImage: e.target.files[0],
                                })
                            }
                        />
                    </Button>
                    {tourDetails.bannerImage && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {tourDetails.bannerImage.name}
                        </Typography>
                    )}
                </Grid>
            </Grid>

            {/* Validity */}
            <Typography variant="h6" color="primary" sx={{ mt: 3, mb: 1 }}>
                Package Validity
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                        label="Valid From"
                        value={tourDetails.validFrom}
                        onChange={(newValue) =>
                            setTourDetails({ ...tourDetails, validFrom: newValue })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                        label="Valid Till"
                        value={tourDetails.validTill}
                        onChange={(newValue) =>
                            setTourDetails({ ...tourDetails, validTill: newValue })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Grid>
            </Grid>

            {/* Days Section */}
            <Typography variant="h6" color="primary" sx={{ mt: 3 }}>
                Day Wise Plan
            </Typography>
            {tourDetails.days.map((day, index) => (
                <Paper key={index} sx={{ p: 2, my: 2, border: "1px solid #ccc" }}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight="bold">Day {index + 1}</Typography>
                        {index > 0 && (
                            <IconButton color="error" onClick={() => handleRemoveDay(index)}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>

                    <Grid container spacing={2} mt={1}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Day Title"
                                value={day.title}
                                onChange={(e) => handleDayChange(index, "title", e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Day Notes"
                                value={day.notes}
                                onChange={(e) => handleDayChange(index, "notes", e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="About City"
                                value={day.aboutCity}
                                onChange={(e) =>
                                    handleDayChange(index, "aboutCity", e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button variant="outlined" component="label">
                                Upload Day Image
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleDayChange(index, "dayImage", e.target.files[0])
                                    }
                                />
                            </Button>
                            {day.dayImage && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {day.dayImage.name}
                                </Typography>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                placeholder="Add Sightseeing (press Enter)"
                                onKeyDown={(e) => handleAddSightseeing(index, e)}
                            />
                        </Grid>

                        {/* 🟢 Multi-select for Selected Sightseeing (list with top/bottom/delete) */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" mb={1}>
                                Selected Sightseeing
                            </Typography>
                            <Box>
                                {day.selectedSightseeing.map((s, i) => (
                                    <Paper
                                        key={i}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            p: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <Box display="flex" alignItems="center">
                                            <LocationOnIcon color="error" sx={{ mr: 1 }} />
                                            <Typography>{s}</Typography>
                                        </Box>
                                        <Box>
                                            {/* Move Up */}
                                            <IconButton
                                                size="small"
                                                disabled={i === 0}
                                                onClick={() => {
                                                    const newList = [...day.selectedSightseeing];
                                                    const [moved] = newList.splice(i, 1);
                                                    newList.splice(i - 1, 0, moved);
                                                    handleDayChange(index, "selectedSightseeing", newList);
                                                }}
                                            >
                                                ⬆️
                                            </IconButton>

                                            {/* Move Down */}
                                            <IconButton
                                                size="small"
                                                disabled={i === day.selectedSightseeing.length - 1}
                                                onClick={() => {
                                                    const newList = [...day.selectedSightseeing];
                                                    const [moved] = newList.splice(i, 1);
                                                    newList.splice(i + 1, 0, moved);
                                                    handleDayChange(index, "selectedSightseeing", newList);
                                                }}
                                            >
                                                ⬇️
                                            </IconButton>

                                            {/* Delete */}
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    const newList = [...day.selectedSightseeing];
                                                    newList.splice(i, 1);
                                                    handleDayChange(index, "selectedSightseeing", newList);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Grid>

                    </Grid>
                </Paper>
            ))}

            <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddDay}>
                + Add Day
            </Button>
            <Grid container sx={{ mt: 5 }} spacing={5}>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Per Person"
                        value={tourDetails.perPerson}
                        onChange={(e) =>
                            setTourDetails({ ...tourDetails, perPerson: Number(e.target.value) })
                        }
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        label="Meal Plan"
                        value={tourDetails.mealPlan.planType}
                        onChange={(e) =>
                            setTourDetails({
                                ...tourDetails,
                                mealPlan: { ...tourDetails.mealPlan, planType: e.target.value },
                            })
                        }
                        fullWidth
                    >
                        <MenuItem value="AP">AP (All meals)</MenuItem>
                        <MenuItem value="MAP">MAP (Breakfast + Dinner)</MenuItem>
                        <MenuItem value="CP">CP (Breakfast only)</MenuItem>
                        <MenuItem value="EP">EP (Room only)</MenuItem>
                    </TextField>
                </Grid>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Destination</TableCell>
                            <TableCell>Nights</TableCell>
                            <TableCell>Standard</TableCell>
                            <TableCell>Deluxe</TableCell>
                            <TableCell>Superior</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tourDetails.destinationNights.map((dest, index) => (
                            <TableRow key={index}>
                                <TableCell>{dest.destination}</TableCell>
                                <TableCell>
                                    <TextField
                                        value={dest.nights}
                                        fullWidth
                                        size="small"
                                        InputProps={{ readOnly: true }}
                                    />
                                </TableCell>

                                {["standard", "deluxe", "superior"].map((cat, i) => (
                                    <TableCell key={cat}>
                                        {/* Hotel dropdown stays in every row */}
                                        <TextField
                                            select
                                            value={dest.hotels[i]?.hotelName || ""}
                                            onChange={(e) => handleHotelChange(index, cat, e.target.value)}
                                            fullWidth
                                        >
                                            {hotelOptions[dest.destination]?.map((h) => (
                                                <MenuItem key={h._id} value={h.name}>
                                                    {h.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                        {/* Bottom row for manual price input */}
                        <TableRow>
                            <TableCell colSpan={2} align="right">
                                <Typography fontWeight="bold">Per Person Price:</Typography>
                            </TableCell>
                            {["standard", "deluxe", "superior"].map((cat, i) => (
                                <TableCell key={cat}>
                                    <TextField
                                        type="number"
                                        value={tourDetails.destinationNights[0]?.hotels[i]?.pricePerPerson || ""}
                                        onChange={(e) =>
                                            handlePriceChange(0, cat, e.target.value)
                                        }
                                        size="small"
                                        fullWidth
                                    />
                                </TableCell>
                            ))}
                        </TableRow>

                    </TableBody>
                </Table>


            </Grid>

            <Box textAlign="center" mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save Tour Details
                </Button>
            </Box>
        </Paper >
    );
};

export default TourDetailsForm;
