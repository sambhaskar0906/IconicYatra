import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchHotels,
    fetchHotelById,
    filterHotelsByCity,
    filterHotelsByCityManual
} from "../../../../features/hotel/hotelSlice";
import HotelQuotationStep4 from "./HotelQuotationStep4";

const emptySection = {
    city: "",
    hotelType: "",
    hotelName: "",
    roomType: "",
    mealPlan: "",
    noNights: "",
    noRooms: "",
    mattressAdult: "",
    mattressChild: "",
    costAdultEx: "",
    costChildEx: "",
    costWithout: "",
    costRoom: "",
    totalCost: "",
};

const HotelQuotationStep3 = ({ step2Data }) => {
    const dispatch = useDispatch();
    const { hotels, filteredHotels, loading, error } = useSelector((state) => state.hotel);

    const [openDialog, setOpenDialog] = useState(false);
    const [newHotelName, setNewHotelName] = useState("");
    const [showStep4, setShowStep4] = useState(false);
    const [selectedHotelsData, setSelectedHotelsData] = useState({});
    const [sectionLoading, setSectionLoading] = useState({});
    const [availableCities, setAvailableCities] = useState([]);
    const [cityNightsMap, setCityNightsMap] = useState({});

    // Step 2 se cities aur nights extract karein
    useEffect(() => {
        if (step2Data?.stayLocations) {
            const cities = step2Data.stayLocations.map(loc => loc.name);
            setAvailableCities(cities);

            // City to nights mapping create karein
            const nightsMap = {};
            step2Data.stayLocations.forEach(loc => {
                nightsMap[loc.name] = loc.nights || "";
            });
            setCityNightsMap(nightsMap);

            console.log("Available cities from step 2:", cities);
            console.log("City nights mapping:", nightsMap);

            // Automatically create sections for each city with nights
            const initialSections = cities.map((city, index) => ({
                ...emptySection,
                city: city,
                noNights: nightsMap[city] || "", // Automatically set nights
                label: `${city} Hotels (${nightsMap[city] || 0} Nights)`,
                removable: false
            }));

            formik.setFieldValue("sections", initialSections);
        }
    }, [step2Data]);

    // Fetch all hotels on component mount
    useEffect(() => {
        dispatch(fetchHotels());
    }, [dispatch]);

    // Extract hotel names from FILTERED hotels (city-wise)
    const getHotelNamesForCity = (cityName) => {
        if (!cityName) return [];

        const searchTerm = cityName.toLowerCase().trim();
        const cityHotels = filteredHotels.filter(hotel =>
            hotel.location?.city?.toLowerCase().includes(searchTerm) ||
            hotel.hotelName?.toLowerCase().includes(searchTerm) ||
            hotel.location?.state?.toLowerCase().includes(searchTerm)
        );

        return cityHotels.map(hotel => hotel.hotelName);
    };

    // Function to fetch hotel details when hotel is selected
    const fetchHotelDetails = async (hotelId, index) => {
        try {
            setSectionLoading(prev => ({ ...prev, [index]: true }));
            const result = await dispatch(fetchHotelById(hotelId)).unwrap();

            setSelectedHotelsData(prev => ({
                ...prev,
                [index]: result
            }));
        } catch (error) {
            console.error("Error fetching hotel details:", error);
        } finally {
            setSectionLoading(prev => ({ ...prev, [index]: false }));
        }
    };

    // Extract room types from selected hotel data
    const getRoomTypes = (index) => {
        const hotelData = selectedHotelsData[index];
        if (!hotelData?.rooms?.[0]?.roomDetails) return [];
        const roomTypes = [...new Set(hotelData.rooms[0].roomDetails.map(room => room.roomType))];
        return roomTypes;
    };

    // Get meal plan for selected room type
    const getMealPlan = (roomType, index) => {
        const hotelData = selectedHotelsData[index];
        if (!hotelData?.rooms?.[0]?.roomDetails) return "";
        const roomDetail = hotelData.rooms[0].roomDetails.find(
            room => room.roomType === roomType
        );
        return roomDetail?.mealPlan || "";
    };

    // Get mattress cost for selected room type
    const getMattressCost = (roomType, index) => {
        const hotelData = selectedHotelsData[index];
        if (!hotelData?.rooms?.[0]?.roomDetails) return null;
        const roomDetail = hotelData.rooms[0].roomDetails.find(
            room => room.roomType === roomType
        );
        return roomDetail?.mattressCost || null;
    };

    // Auto-calculate total cost function - FIXED
    const calculateTotalCost = (index) => {
        const noNights = parseInt(formik.values.sections[index].noNights) || 0;
        const noRooms = parseInt(formik.values.sections[index].noRooms) || 0;
        const costRoom = parseInt(formik.values.sections[index].costRoom) || 0;

        console.log(`Calculating for section ${index}:`, { noNights, noRooms, costRoom });

        if (noNights > 0 && noRooms > 0 && costRoom > 0) {
            const totalCost = noNights * noRooms * costRoom;
            console.log(`Total cost for section ${index}:`, totalCost);
            formik.setFieldValue(`sections[${index}].totalCost`, totalCost);
        } else {
            formik.setFieldValue(`sections[${index}].totalCost`, "");
        }
    };

    const formik = useFormik({
        initialValues: {
            sections: [],
        },
        onSubmit: (values) => {
            console.log("Form Values:", values);
        },
    });

    const handleAddHotel = () => {
        if (newHotelName.trim()) {
            setNewHotelName("");
            setOpenDialog(false);
            dispatch(fetchHotels());
        }
    };

    const handleAddMore = () => {
        const newSection = {
            ...emptySection,
            city: "",
            label: `Additional Hotel Section`,
            removable: true
        };

        formik.setFieldValue("sections", [...formik.values.sections, newSection]);
    };

    const handleDeleteSection = (index) => {
        const updatedSections = formik.values.sections.filter((_, i) => i !== index);
        formik.setFieldValue("sections", updatedSections);

        setSelectedHotelsData(prev => {
            const newData = { ...prev };
            delete newData[index];
            return newData;
        });
    };

    // Handle city selection - AUTOMATICALLY SET NIGHTS
    const handleCitySelect = (e, index) => {
        const selectedCity = e.target.value;
        const nightsFromStep2 = cityNightsMap[selectedCity] || "";

        formik.setFieldValue(`sections[${index}].city`, selectedCity);
        formik.setFieldValue(`sections[${index}].noNights`, nightsFromStep2);
        formik.setFieldValue(`sections[${index}].label`, `${selectedCity} Hotels (${nightsFromStep2 || 0} Nights)`);

        // Clear other fields when city changes
        formik.setFieldValue(`sections[${index}].hotelName`, "");
        formik.setFieldValue(`sections[${index}].hotelType`, "");
        formik.setFieldValue(`sections[${index}].roomType`, "");
        formik.setFieldValue(`sections[${index}].mealPlan`, "");
        formik.setFieldValue(`sections[${index}].mattressAdult`, "");
        formik.setFieldValue(`sections[${index}].mattressChild`, "");
        formik.setFieldValue(`sections[${index}].costWithout`, "");
        formik.setFieldValue(`sections[${index}].costRoom`, "");
        formik.setFieldValue(`sections[${index}].totalCost`, "");

        dispatch(filterHotelsByCityManual(selectedCity));
    };

    // Handle hotel selection
    const handleHotelSelect = (e, index) => {
        const selectedHotelName = e.target.value;
        const currentCity = formik.values.sections[index].city;

        if (selectedHotelName === "add_new") {
            setOpenDialog(true);
            return;
        }

        formik.setFieldValue(`sections[${index}].hotelName`, selectedHotelName);

        const selectedHotel = filteredHotels.find(hotel => hotel.hotelName === selectedHotelName);

        if (selectedHotel) {
            formik.setFieldValue(
                `sections[${index}].hotelType`,
                selectedHotel.hotelType?.[0] || ""
            );

            // Clear previous data
            formik.setFieldValue(`sections[${index}].roomType`, "");
            formik.setFieldValue(`sections[${index}].mealPlan`, "");
            formik.setFieldValue(`sections[${index}].mattressAdult`, "");
            formik.setFieldValue(`sections[${index}].mattressChild`, "");
            formik.setFieldValue(`sections[${index}].costWithout`, "");
            formik.setFieldValue(`sections[${index}].costRoom`, "");
            formik.setFieldValue(`sections[${index}].totalCost`, "");

            if (selectedHotel._id) {
                fetchHotelDetails(selectedHotel._id, index);
            }
        }
    };

    // Handle room type selection - AUTOMATICALLY SET MEAL PLAN AND COSTS - FIXED
    const handleRoomTypeSelect = (e, index) => {
        const roomType = e.target.value;

        formik.setFieldValue(`sections[${index}].roomType`, roomType);

        const mealPlan = getMealPlan(roomType, index);
        formik.setFieldValue(`sections[${index}].mealPlan`, mealPlan);

        const mattressCost = getMattressCost(roomType, index);

        if (mattressCost) {
            // Auto-fill mattress costs from API data
            formik.setFieldValue(`sections[${index}].mattressAdult`, mattressCost.adult || "");
            formik.setFieldValue(`sections[${index}].mattressChild`, mattressCost.children || "");
            formik.setFieldValue(`sections[${index}].costWithout`, mattressCost.kidWithoutMattress || "");

            // ✅ FIX: costRoom ko disabled se enabled karo aur value set karo
            formik.setFieldValue(`sections[${index}].costRoom`, mattressCost.adult || "");

            // Auto-calculate total cost
            setTimeout(() => calculateTotalCost(index), 100);
        }
    };

    // Handle numeric field changes for auto-calculation - FIXED
    const handleNumericFieldChange = (e, index) => {
        const { name, value } = e.target;

        formik.setFieldValue(name, value);

        // If nights, rooms, or room cost change, recalculate total cost
        if (name.includes('noNights') || name.includes('noRooms') || name.includes('costRoom')) {
            setTimeout(() => calculateTotalCost(index), 100);
        }
    };

    // Handle nights manual override
    const handleNightsOverride = (e, index) => {
        const value = e.target.value;
        formik.setFieldValue(`sections[${index}].noNights`, value);

        const city = formik.values.sections[index].city;
        const originalNights = cityNightsMap[city] || "";
        const labelSuffix = value !== originalNights ? ` (Manual: ${value} Nights)` : ` (${value} Nights)`;
        formik.setFieldValue(`sections[${index}].label`, `${city} Hotels${labelSuffix}`);

        setTimeout(() => calculateTotalCost(index), 100);
    };

    // Handle rooms manual override
    const handleRoomsOverride = (e, index) => {
        const value = e.target.value;
        formik.setFieldValue(`sections[${index}].noRooms`, value);
        setTimeout(() => calculateTotalCost(index), 100);
    };

    // Handle room cost manual override - NEW FUNCTION
    const handleRoomCostOverride = (e, index) => {
        const value = e.target.value;
        formik.setFieldValue(`sections[${index}].costRoom`, value);
        setTimeout(() => calculateTotalCost(index), 100);
    };

    const renderHotelSection = (section, index) => {
        const isCitySelected = !!formik.values.sections[index].city;
        const isHotelSelected = !!formik.values.sections[index].hotelName;
        const isSectionLoading = sectionLoading[index];
        const availableRoomTypes = getRoomTypes(index);
        const hotelNamesForCity = isCitySelected ? getHotelNamesForCity(formik.values.sections[index].city) : [];

        const currentCity = formik.values.sections[index].city;
        const originalNights = cityNightsMap[currentCity] || "";
        const currentNights = formik.values.sections[index].noNights;
        const isNightsModified = currentNights !== originalNights;

        return (
            <Paper sx={{ p: 2, mb: 2, position: "relative" }} variant="outlined" key={index}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">{section.label}</Typography>

                    {isNightsModified && (
                        <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
                            (Nights Modified)
                        </Typography>
                    )}

                    {section.removable && (
                        <Button
                            color="error"
                            variant="outlined"
                            size="small"
                            onClick={() => handleDeleteSection(index)}
                        >
                            Delete
                        </Button>
                    )}
                </Box>

                {isSectionLoading && (
                    <Box display="flex" alignItems="center" mb={2}>
                        <CircularProgress size={20} />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Loading hotel details...
                        </Typography>
                    </Box>
                )}

                <Grid container spacing={2}>
                    {/* City Selection */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label="Select City"
                            name={`sections[${index}].city`}
                            value={formik.values.sections[index].city}
                            onChange={(e) => handleCitySelect(e, index)}
                        >
                            <MenuItem value="">Select City</MenuItem>
                            {availableCities.map((city) => (
                                <MenuItem key={city} value={city}>
                                    {city} ({cityNightsMap[city] || 0} Nights)
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* No Nights - AUTO-FILLED FROM STEP 2 */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="No of Nights"
                            name={`sections[${index}].noNights`}
                            value={formik.values.sections[index].noNights}
                            onChange={(e) => handleNightsOverride(e, index)}
                            type="number"
                            inputProps={{ min: 1 }}
                            helperText={
                                isNightsModified
                                    ? `Originally ${originalNights} nights`
                                    : "From Step 2 itinerary"
                            }
                            color={isNightsModified ? "warning" : "primary"}
                        />
                    </Grid>

                    {/* No of Rooms */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="No of Rooms"
                            name={`sections[${index}].noRooms`}
                            value={formik.values.sections[index].noRooms}
                            onChange={(e) => handleRoomsOverride(e, index)}
                            type="number"
                            inputProps={{ min: 1 }}
                        />
                    </Grid>

                    {/* Hotel Name */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label="Hotel Name"
                            name={`sections[${index}].hotelName`}
                            value={formik.values.sections[index].hotelName}
                            onChange={(e) => handleHotelSelect(e, index)}
                            disabled={loading || !isCitySelected}
                        >
                            <MenuItem value="">Select Hotel</MenuItem>
                            {hotelNamesForCity.map((name) => (
                                <MenuItem key={name} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                            <MenuItem value="add_new" sx={{ fontWeight: "bold", color: "blue" }}>
                                + Add New Hotel
                            </MenuItem>
                        </TextField>
                        {isCitySelected && (
                            <Typography variant="caption" color="text.secondary">
                                {hotelNamesForCity.length} hotels found in {formik.values.sections[index].city}
                            </Typography>
                        )}
                    </Grid>

                    {/* Hotel Type */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Hotel Type"
                            name={`sections[${index}].hotelType`}
                            value={formik.values.sections[index].hotelType}
                            onChange={formik.handleChange}
                            disabled
                        />
                    </Grid>

                    {/* Room Type */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label="Room Type"
                            name={`sections[${index}].roomType`}
                            value={formik.values.sections[index].roomType}
                            onChange={(e) => handleRoomTypeSelect(e, index)}
                            disabled={!isHotelSelected || isSectionLoading}
                        >
                            <MenuItem value="">Select Room Type</MenuItem>
                            {availableRoomTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Meal Plan - AUTOMATICALLY FILLED, NO DROPDOWN */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Meal Plan"
                            name={`sections[${index}].mealPlan`}
                            value={formik.values.sections[index].mealPlan}
                            onChange={formik.handleChange}
                            disabled
                            helperText="Automatically set from room type"
                        />
                    </Grid>

                    {/* Mattress Costs from API */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Mattress For Adult"
                            name={`sections[${index}].mattressAdult`}
                            value={formik.values.sections[index].mattressAdult}
                            type="number"
                            disabled
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Mattress For Children"
                            name={`sections[${index}].mattressChild`}
                            value={formik.values.sections[index].mattressChild}
                            type="number"
                            disabled
                        />
                    </Grid>

                    {/* Divider row */}
                    <Grid size={{ xs: 12 }}>
                        <Divider color="#000" sx={{ my: 2 }}>
                            <Typography variant="body1">Cost Per Unit</Typography>
                        </Divider>
                    </Grid>

                    {/* Costs */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Adult Ex Mattress"
                            name={`sections[${index}].costAdultEx`}
                            value={formik.values.sections[index].costAdultEx}
                            onChange={formik.handleChange}
                            type="number"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Children Ex Mattress"
                            name={`sections[${index}].costChildEx`}
                            value={formik.values.sections[index].costChildEx}
                            onChange={formik.handleChange}
                            type="number"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Without Mattress"
                            name={`sections[${index}].costWithout`}
                            value={formik.values.sections[index].costWithout}
                            type="number"
                            disabled
                        />
                    </Grid>

                    {/* ✅ FIX: Room/Night field ko enabled karo */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Room/Night"
                            name={`sections[${index}].costRoom`}
                            value={formik.values.sections[index].costRoom}
                            onChange={(e) => handleRoomCostOverride(e, index)}
                            type="number"
                            // ✅ REMOVED: disabled attribute
                            helperText="Cost per room per night"
                        />
                    </Grid>

                    {/* Total */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Total Cost"
                            name={`sections[${index}].totalCost`}
                            value={formik.values.sections[index].totalCost}
                            type="number"
                            disabled
                            helperText="Auto-calculated: Nights × Rooms × Room Cost"
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    };

    if (showStep4) {
        return <HotelQuotationStep4 />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Step 3: Hotel Selection by City
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select hotels for each city in your itinerary. Nights are automatically filled from Step 2.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading && (
                <Box textAlign="center" sx={{ mb: 2 }}>
                    <CircularProgress />
                    <Typography>Loading hotels...</Typography>
                </Box>
            )}

            <form onSubmit={formik.handleSubmit}>
                {formik.values.sections.map((section, index) =>
                    renderHotelSection(section, index)
                )}

                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button
                        type="button"
                        variant="outlined"
                        sx={{ mr: 2 }}
                        onClick={handleAddMore}
                    >
                        + Add More Cities
                    </Button>
                    <Box textAlign="center" sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                            onClick={() => setShowStep4(true)}
                        >
                            Save & Continue
                        </Button>
                    </Box>
                </Box>
            </form>

            {/* Add Hotel Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Hotel</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Hotel Name"
                        fullWidth
                        value={newHotelName}
                        onChange={(e) => setNewHotelName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddHotel} variant="contained">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HotelQuotationStep3;