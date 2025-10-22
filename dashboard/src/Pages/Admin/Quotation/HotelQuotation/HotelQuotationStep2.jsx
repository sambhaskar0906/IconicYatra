import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Paper,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { fetchDomesticCities } from "../../../../features/location/locationSlice";

const HotelQuotationStep2 = ({ onNext, onBack, initialData, step1Data }) => {
    const dispatch = useDispatch();

    // Redux state se cities data
    const { cities, loading: citiesLoading } = useSelector((state) => state.location);

    // Local states
    const [selectedState, setSelectedState] = useState("");
    const [locations, setLocations] = useState([]);
    const [stayLocations, setStayLocations] = useState([]);


    useEffect(() => {
        const sector = step1Data?.sector || initialData?.selectedState || "";

        if (sector) {
            setSelectedState(sector);
            console.log("Setting selected state:", sector);
        }

        // Agar pehle se step2 data hai to use karo
        if (initialData) {
            if (initialData.stayLocations) {
                setStayLocations(initialData.stayLocations);
            }
            if (initialData.locations) {
                setLocations(initialData.locations);
            }
        }
    }, [initialData, step1Data]);

    // Jab state change ho, cities fetch karo
    useEffect(() => {
        if (selectedState) {
            console.log("Fetching cities for state:", selectedState);
            dispatch(fetchDomesticCities(selectedState));
        }
    }, [selectedState, dispatch]);

    // Jab cities data update ho, locations set karo - FIXED
    useEffect(() => {
        if (cities && cities.length > 0) {
            console.log("Cities API response:", cities);

            // Extract only city names from the objects
            const cityNames = cities.map(city => city.name);
            console.log("Extracted city names:", cityNames);

            // Agar pehle se locations nahi hain to naye cities set karo
            if (locations.length === 0) {
                setLocations(cityNames);
            }

            // Agar initialData mein locations hain aur wo current cities mein available hain
            if (initialData?.locations && initialData.locations.length > 0) {
                const validLocations = initialData.locations.filter(loc =>
                    cityNames.includes(loc)
                );
                if (validLocations.length > 0) {
                    setLocations(prev =>
                        prev.filter(loc => !validLocations.includes(loc))
                    );
                }
            }
        }
    }, [cities, initialData]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // Same list reorder
        if (source.droppableId === destination.droppableId) {
            if (source.droppableId === "locations") {
                const updated = Array.from(locations);
                const [removed] = updated.splice(source.index, 1);
                updated.splice(destination.index, 0, removed);
                setLocations(updated);
            } else if (source.droppableId === "stayLocations") {
                const updated = Array.from(stayLocations);
                const [removed] = updated.splice(source.index, 1);
                updated.splice(destination.index, 0, removed);
                setStayLocations(updated);
            }
            return;
        }

        // Moving from Locations → Stay Locations
        if (source.droppableId === "locations" && destination.droppableId === "stayLocations") {
            const updatedLocations = Array.from(locations);
            const [movedItem] = updatedLocations.splice(source.index, 1);

            const updatedStay = Array.from(stayLocations);
            updatedStay.splice(destination.index, 0, {
                name: movedItem,
                nights: "",
                state: selectedState
            });

            setLocations(updatedLocations);
            setStayLocations(updatedStay);
        }

        // Moving from Stay Locations → Locations
        if (source.droppableId === "stayLocations" && destination.droppableId === "locations") {
            const updatedStay = Array.from(stayLocations);
            const [movedItem] = updatedStay.splice(source.index, 1);

            const updatedLocations = Array.from(locations);
            updatedLocations.splice(destination.index, 0, movedItem.name);

            setStayLocations(updatedStay);
            setLocations(updatedLocations);
        }
    };

    const handleNightsChange = (index, value) => {
        const updated = [...stayLocations];
        updated[index].nights = value;
        setStayLocations(updated);
    };

    const handleSaveAndContinue = () => {
        // Validate if at least one stay location is added
        if (stayLocations.length === 0) {
            alert("Please add at least one stay location to continue.");
            return;
        }

        // Validate all stay locations have nights specified
        const incompleteLocations = stayLocations.filter(loc => !loc.nights || loc.nights === "" || isNaN(loc.nights));
        if (incompleteLocations.length > 0) {
            alert("Please specify valid number of nights for all stay locations.");
            return;
        }

        // Prepare data for next step
        const stepData = {
            selectedState,
            locations,
            stayLocations,
            totalNights: stayLocations.reduce((total, loc) => total + parseInt(loc.nights || 0), 0),
            totalDays: stayLocations.reduce((total, loc) => total + parseInt(loc.nights || 0), 0) + 1
        };

        console.log("Step 2 Data to save:", stepData);

        // Call the onNext prop with the data
        onNext(stepData);
    };

    const handleBack = () => {
        // Save current state when going back
        const stepData = {
            selectedState,
            locations,
            stayLocations
        };
        onBack(stepData);
    };

    // Reset itinerary function
    const handleResetItinerary = () => {
        // Cities ko wapas locations mein add karo
        const returnedLocations = [...locations, ...stayLocations.map(loc => loc.name)];
        setLocations([...new Set(returnedLocations)]); // Remove duplicates
        setStayLocations([]);
    };

    // Calculate total nights and days
    const totalNights = stayLocations.reduce((total, loc) => total + parseInt(loc.nights || 0), 0);
    const totalDays = totalNights + 1;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Quotation Itinerary {totalNights}N/{totalDays}D
            </Typography>

            {/* Selected State Display (Read-only) */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    label="Selected Sector (From Step 1)"
                    value={selectedState || "No sector selected"}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>

            {/* State Change Warning */}
            {!selectedState && (
                <Paper sx={{ p: 2, mb: 3, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
                    <Typography variant="body2" color="warning.dark">
                        <strong>Note:</strong> Please go back to Step 1 and select a sector first.
                    </Typography>
                </Paper>
            )}

            {/* Summary Card */}
            {stayLocations.length > 0 && (
                <Paper sx={{ p: 2, mb: 3, backgroundColor: '#e8f5e8' }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Itinerary Summary
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2">
                                <strong>Total Locations:</strong> {stayLocations.length}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2">
                                <strong>Total Nights:</strong> {totalNights}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2">
                                <strong>Total Days:</strong> {totalDays}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2">
                                <strong>Sector:</strong> {selectedState}
                            </Typography>
                        </Grid>
                    </Grid >
                </Paper >
            )}

            {/* Loading State */}
            {
                citiesLoading && (
                    <Paper sx={{ p: 3, textAlign: 'center', mb: 2 }}>
                        <Typography>Loading cities for {selectedState}...</Typography>
                    </Paper>
                )
            }

            <DragDropContext onDragEnd={handleDragEnd}>
                <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                    {/* Left: Available Cities */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Available Cities in {selectedState}
                            </Typography>
                            <Typography variant="caption" color="error">
                                Drag & drop to add to itinerary
                            </Typography>

                            <Droppable droppableId="locations">
                                {(provided) => (
                                    <Paper
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            flex: 1,
                                            minHeight: 400,
                                            maxHeight: 400, // Fixed height for consistency
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden', // Important for scroll
                                            mt: 1,
                                            p: 1,
                                            border: "1px solid #ddd",
                                        }}
                                    >
                                        {/* Scrollable content container */}
                                        <Box sx={{
                                            flex: 1,
                                            overflowY: 'auto',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            {locations.length === 0 && !citiesLoading ? (
                                                <Box sx={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            p: 2,
                                                            color: "text.secondary",
                                                            textAlign: 'center',
                                                            fontStyle: 'italic'
                                                        }}
                                                    >
                                                        {selectedState ? `No cities found for ${selectedState}` : "Please select a sector in Step 1"}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <>
                                                    {locations.map((loc, index) => (
                                                        <Draggable key={loc} draggableId={loc} index={index}>
                                                            {(provided) => (
                                                                <Box
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    sx={{
                                                                        p: 1,
                                                                        mb: 1,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 1,
                                                                        bgcolor: "#f9f9f9",
                                                                        borderRadius: 1,
                                                                        border: "1px solid #eee",
                                                                        cursor: "grab",
                                                                        '&:hover': {
                                                                            bgcolor: '#f0f0f0',
                                                                        }
                                                                    }}
                                                                >
                                                                    <RoomIcon color="warning" fontSize="small" />
                                                                    <Typography>{loc}</Typography>
                                                                </Box>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </>
                                            )}
                                        </Box>
                                    </Paper>
                                )}
                            </Droppable>
                        </Box>
                    </Grid>

                    {/* Right: Stay Locations */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Itinerary Locations
                            </Typography>
                            <Typography variant="caption" color="error">
                                Arrange in order & set nights
                            </Typography>

                            <Droppable droppableId="stayLocations">
                                {(provided) => (
                                    <Paper
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            flex: 1,
                                            minHeight: 400,
                                            maxHeight: 400, // Fixed height for consistency
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden', // Important for scroll
                                            mt: 1,
                                            p: 1,
                                            border: "1px solid #ddd",
                                        }}
                                    >
                                        {/* Scrollable content container */}
                                        <Box sx={{
                                            flex: 1,
                                            overflowY: 'auto',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            {stayLocations.length === 0 ? (
                                                <Box sx={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            p: 2,
                                                            color: "text.secondary",
                                                            textAlign: 'center',
                                                            fontStyle: 'italic'
                                                        }}
                                                    >
                                                        Drag cities from the left to build your itinerary
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <>
                                                    {stayLocations.map((loc, index) => (
                                                        <Draggable key={`${loc.name}-${index}`} draggableId={`${loc.name}-${index}`} index={index}>
                                                            {(provided) => (
                                                                <Box
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    sx={{
                                                                        p: 1,
                                                                        mb: 2,
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        gap: 1,
                                                                        bgcolor: "#e8f4ff",
                                                                        borderRadius: 1,
                                                                        border: "1px solid #cce4ff",
                                                                        cursor: "grab",
                                                                        '&:hover': {
                                                                            bgcolor: '#d8e8ff',
                                                                        }
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                        <RoomIcon color="primary" fontSize="small" />
                                                                        <Typography fontWeight="medium">{loc.name}</Typography>
                                                                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {index + 1}.
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                    <TextField
                                                                        type="number"
                                                                        label="No. of Nights"
                                                                        size="small"
                                                                        value={loc.nights}
                                                                        onChange={(e) => handleNightsChange(index, e.target.value)}
                                                                        inputProps={{ min: 1, max: 10 }}
                                                                        error={!loc.nights || loc.nights === "" || isNaN(loc.nights)}
                                                                        helperText={!loc.nights || loc.nights === "" || isNaN(loc.nights) ? "Required" : ""}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </>
                                            )}
                                        </Box>
                                    </Paper>
                                )}
                            </Droppable>
                        </Box>
                    </Grid>
                </Grid>
            </DragDropContext>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                    variant="outlined"
                    sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                    onClick={handleBack}
                >
                    Back
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                        onClick={handleResetItinerary}
                        disabled={stayLocations.length === 0}
                    >
                        Reset Itinerary
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                        onClick={handleSaveAndContinue}
                        disabled={stayLocations.length === 0 || !selectedState}
                    >
                        Save & Continue
                    </Button>
                </Box>
            </Box>

            {/* Validation Messages */}
            {
                !selectedState && (
                    <Typography
                        variant="body2"
                        color="error"
                        sx={{ textAlign: 'center', mt: 2 }}
                    >
                        Please go back to Step 1 and select a sector first.
                    </Typography>
                )
            }

            {
                selectedState && stayLocations.length === 0 && (
                    <Typography
                        variant="body2"
                        color="error"
                        sx={{ textAlign: 'center', mt: 2 }}
                    >
                        Please add at least one city to your itinerary to continue.
                    </Typography>
                )
            }
        </Box >
    );
};

export default HotelQuotationStep2;