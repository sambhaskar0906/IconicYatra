import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    MenuItem,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from "@mui/material";
import {
    DatePicker,
    TimePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema - Simplified
const validationSchema = Yup.object({
    vehicleType: Yup.string().required("Vehicle Type is required"),
    tripType: Yup.string().required("Trip Type is required"),
    noOfDays: Yup.number().min(1, "Minimum 1 day required").required("Number of days required"),
    ratePerKm: Yup.number().min(0, "Rate cannot be negative").required("Rate per km required"),
    kmPerDay: Yup.number().min(0, "KM per day cannot be negative").required("KM per day required"),
    driverAllowance: Yup.number().min(0, "Allowance cannot be negative").required("Driver allowance required"),
    tollParking: Yup.number().min(0, "Toll/Parking cannot be negative").required("Toll/Parking required"),
    totalCost: Yup.number()
        .min(0, "Total cost cannot be negative")
        .required("Total Costing is required"),
});

const tripTypes = ["OneWay", "RoundTrip"];

const HotelQuotationStep4 = ({ onNext, onBack, initialData, step1Data, step2Data, step3Data }) => {
    const [vehicleTypes, setVehicleTypes] = useState([
        "Sedan",
        "SUV",
        "Bus",
        "Tempo Traveller",
    ]);

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [newValue, setNewValue] = useState("");
    const [fieldType, setFieldType] = useState("");

    // Debug component
    const DebugInfo = () => (
        <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Debug Info - Step 1 Data:</Typography>
            <Typography variant="body2">
                Step1 Data Available: {step1Data ? '✅ Yes' : '❌ No'}<br />
                Client Name: {step1Data?.clientName || 'Not found'}<br />
                Arrival Location: {step1Data?.arrivalLocation || 'Not found'}<br />
                Departure Location: {step1Data?.departureLocation || 'Not found'}<br />
                Arrival Date: {step1Data?.arrivalDate ? 'Available' : 'Not found'}<br />
                Departure Date: {step1Data?.departureDate ? 'Available' : 'Not found'}
            </Typography>
        </Alert>
    );

    // Step 1 se data automatically fetch karein
    useEffect(() => {
        console.log("🔍 Step 1 Data received in Step 4:", step1Data);
        console.log("🔍 Step 1 Client Name:", step1Data?.clientName);
        console.log("🔍 Step 1 Arrival Location:", step1Data?.arrivalLocation);
        console.log("🔍 Step 1 Departure Location:", step1Data?.departureLocation);
    }, [step1Data]);

    // Initialize form with step1Data
    const formik = useFormik({
        initialValues: {
            // Client Name automatically from step1
            clientName: step1Data?.clientName || initialData?.clientName || "",

            // Transport details
            vehicleType: initialData?.vehicleType || "",
            tripType: initialData?.tripType || "RoundTrip",
            noOfDays: initialData?.noOfDays || "",
            ratePerKm: initialData?.ratePerKm || "",
            kmPerDay: initialData?.kmPerDay || "",
            driverAllowance: initialData?.driverAllowance || "",
            tollParking: initialData?.tollParking || "",
            totalCost: initialData?.totalCost || "",

            // Pickup/Drop details automatically from step1
            pickupDate: step1Data?.arrivalDate || initialData?.pickupDate || null,
            pickupTime: initialData?.pickupTime || null,
            pickupLocation: step1Data?.arrivalLocation || initialData?.pickupLocation || "",
            dropDate: step1Data?.departureDate || initialData?.dropDate || null,
            dropTime: initialData?.dropTime || null,
            dropLocation: step1Data?.departureLocation || initialData?.dropLocation || "",
        },
        validationSchema,
        onSubmit: (values) => {
            handleSaveAndContinue(values);
        },
        enableReinitialize: true,
    });

    // Initialize data from step1Data
    useEffect(() => {
        if (step1Data) {
            console.log("🔄 Auto-filling form with Step 1 data");

            // Auto-fill pickup/drop details from step1
            const updates = {};

            if (step1Data.arrivalDate) {
                updates.pickupDate = step1Data.arrivalDate;
            }
            if (step1Data.arrivalLocation) {
                updates.pickupLocation = step1Data.arrivalLocation;
            }
            if (step1Data.departureDate) {
                updates.dropDate = step1Data.departureDate;
            }
            if (step1Data.departureLocation) {
                updates.dropLocation = step1Data.departureLocation;
            }
            if (step1Data.clientName) {
                updates.clientName = step1Data.clientName;
            }

            // Batch update karein
            Object.keys(updates).forEach(key => {
                formik.setFieldValue(key, updates[key]);
            });
        }
    }, [step1Data]);

    // Auto-calculate total cost when relevant fields change
    useEffect(() => {
        const calculateTotalCost = () => {
            const noOfDays = parseFloat(formik.values.noOfDays) || 0;
            const ratePerKm = parseFloat(formik.values.ratePerKm) || 0;
            const kmPerDay = parseFloat(formik.values.kmPerDay) || 0;
            const driverAllowance = parseFloat(formik.values.driverAllowance) || 0;
            const tollParking = parseFloat(formik.values.tollParking) || 0;

            const distanceCost = noOfDays * kmPerDay * ratePerKm;
            const total = distanceCost + (driverAllowance * noOfDays) + tollParking;

            if (!isNaN(total) && total >= 0) {
                formik.setFieldValue("totalCost", Math.round(total));
            }
        };

        calculateTotalCost();
    }, [
        formik.values.noOfDays,
        formik.values.ratePerKm,
        formik.values.kmPerDay,
        formik.values.driverAllowance,
        formik.values.tollParking
    ]);

    // Handle dropdown change
    const handleVehicleChange = (event) => {
        if (event.target.value === "addNew") {
            setFieldType("vehicle");
            setNewValue("");
            setOpenDialog(true);
        } else {
            formik.handleChange(event);
        }
    };

    const handleDialogSave = () => {
        if (newValue.trim() === "") return;

        if (fieldType === "vehicle") {
            const updatedVehicleTypes = [...vehicleTypes, newValue.trim()];
            setVehicleTypes(updatedVehicleTypes);
            formik.setFieldValue("vehicleType", newValue.trim());
        }

        setNewValue("");
        setOpenDialog(false);
    };

    const handleSaveAndContinue = (values = formik.values) => {
        // Trigger validation for all fields
        formik.validateForm().then(errors => {
            if (Object.keys(errors).length === 0) {
                const stepData = {
                    ...values,
                    vehicleTypes: vehicleTypes
                };

                console.log("✅ Step 4 Data:", stepData);
                onNext(stepData);
            } else {
                // Scroll to first error
                const firstErrorField = Object.keys(errors)[0];
                const element = document.querySelector(`[name="${firstErrorField}"]`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    };

    const handleBack = () => {
        const stepData = {
            ...formik.values,
            vehicleTypes: vehicleTypes
        };
        onBack(stepData);
    };

    // Calculate cost breakdown for display
    const distanceCost = (parseFloat(formik.values.noOfDays) || 0) *
        (parseFloat(formik.values.kmPerDay) || 0) *
        (parseFloat(formik.values.ratePerKm) || 0);

    const driverAllowanceTotal = (parseFloat(formik.values.noOfDays) || 0) *
        (parseFloat(formik.values.driverAllowance) || 0);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper sx={{ p: 3, maxWidth: 900, mx: "auto", mt: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Transport Details
                </Typography>


                <form onSubmit={formik.handleSubmit}>
                    {/* Basic Details */}
                    <Box mb={3}>
                        <Grid container spacing={2}>
                            {/* Client Name - Display Only (Auto-filled from Step 1) */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Client Name"
                                    value={formik.values.clientName}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    helperText="Auto-filled from Step 1"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            backgroundColor: '#f5f5f5',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Vehicle Type"
                                    name="vehicleType"
                                    value={formik.values.vehicleType}
                                    onChange={handleVehicleChange}
                                    error={
                                        formik.touched.vehicleType && Boolean(formik.errors.vehicleType)
                                    }
                                    helperText={
                                        formik.touched.vehicleType && formik.errors.vehicleType
                                    }
                                >
                                    {vehicleTypes.map((type, idx) => (
                                        <MenuItem key={idx} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="addNew">+ Add New Vehicle</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Trip Type"
                                    name="tripType"
                                    value={formik.values.tripType}
                                    onChange={formik.handleChange}
                                    error={formik.touched.tripType && Boolean(formik.errors.tripType)}
                                    helperText={formik.touched.tripType && formik.errors.tripType}
                                >
                                    {tripTypes.map((type, idx) => (
                                        <MenuItem key={idx} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="No Of Days"
                                    name="noOfDays"
                                    type="number"
                                    value={formik.values.noOfDays}
                                    onChange={formik.handleChange}
                                    error={formik.touched.noOfDays && Boolean(formik.errors.noOfDays)}
                                    helperText={formik.touched.noOfDays && formik.errors.noOfDays}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Rate Per Km (₹)"
                                    name="ratePerKm"
                                    type="number"
                                    value={formik.values.ratePerKm}
                                    onChange={formik.handleChange}
                                    error={formik.touched.ratePerKm && Boolean(formik.errors.ratePerKm)}
                                    helperText={formik.touched.ratePerKm && formik.errors.ratePerKm}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Km Per Day"
                                    name="kmPerDay"
                                    type="number"
                                    value={formik.values.kmPerDay}
                                    onChange={formik.handleChange}
                                    error={formik.touched.kmPerDay && Boolean(formik.errors.kmPerDay)}
                                    helperText={formik.touched.kmPerDay && formik.errors.kmPerDay}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Cost Details */}
                    <Box mb={3}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Cost Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Driver Allowance (₹/day)"
                                    name="driverAllowance"
                                    type="number"
                                    value={formik.values.driverAllowance}
                                    onChange={formik.handleChange}
                                    error={formik.touched.driverAllowance && Boolean(formik.errors.driverAllowance)}
                                    helperText={formik.touched.driverAllowance && formik.errors.driverAllowance}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Toll/Parking (₹)"
                                    name="tollParking"
                                    type="number"
                                    value={formik.values.tollParking}
                                    onChange={formik.handleChange}
                                    error={formik.touched.tollParking && Boolean(formik.errors.tollParking)}
                                    helperText={formik.touched.tollParking && formik.errors.tollParking}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Total Costing (₹)"
                                    name="totalCost"
                                    type="number"
                                    value={formik.values.totalCost}
                                    onChange={formik.handleChange}
                                    error={formik.touched.totalCost && Boolean(formik.errors.totalCost)}
                                    helperText={formik.touched.totalCost && formik.errors.totalCost}
                                    inputProps={{ min: 0, readOnly: true }}
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        '& .MuiInputBase-input': {
                                            fontWeight: 'bold',
                                            color: '#1976d2'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Pickup/Drop Details - Auto-filled from Step 1 */}
                    <Box mb={3}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            PickUp/Drop Details (Auto-filled from Step 1)
                        </Typography>
                        <Grid container spacing={2}>
                            {/* Pickup Date - Auto-filled */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <DatePicker
                                    label="Pickup Date"
                                    value={formik.values.pickupDate}
                                    onChange={(val) => formik.setFieldValue("pickupDate", val)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            helperText: step1Data?.arrivalDate ? "Auto-filled from Step 1" : ""
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TimePicker
                                    label="Pickup Time"
                                    value={formik.values.pickupTime}
                                    onChange={(val) => formik.setFieldValue("pickupTime", val)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </Grid>
                            {/* Pickup Location - Auto-filled */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Pickup Location"
                                    name="pickupLocation"
                                    value={formik.values.pickupLocation}
                                    onChange={formik.handleChange}
                                    helperText={step1Data?.arrivalLocation ? "Auto-filled from Step 1" : ""}
                                />
                            </Grid>

                            {/* Drop Date - Auto-filled */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <DatePicker
                                    label="Drop Date"
                                    value={formik.values.dropDate}
                                    onChange={(val) => formik.setFieldValue("dropDate", val)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            helperText: step1Data?.departureDate ? "Auto-filled from Step 1" : ""
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TimePicker
                                    label="Drop Time"
                                    value={formik.values.dropTime}
                                    onChange={(val) => formik.setFieldValue("dropTime", val)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </Grid>
                            {/* Drop Location - Auto-filled */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Drop Location"
                                    name="dropLocation"
                                    value={formik.values.dropLocation}
                                    onChange={formik.handleChange}
                                    helperText={step1Data?.departureLocation ? "Auto-filled from Step 1" : ""}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            variant="outlined"
                            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                            onClick={handleBack}
                        >
                            Back
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                        >
                            Save & Continue
                        </Button>
                    </Box>
                </form>
            </Paper>

            {/* Add New Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    Add New Vehicle Type
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Vehicle Type"
                        fullWidth
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleDialogSave();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleDialogSave}
                        disabled={!newValue.trim()}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default HotelQuotationStep4;