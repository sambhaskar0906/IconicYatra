// src/components/MultiStepPackageForm.jsx
import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Typography, Paper, Button } from "@mui/material";
import PackageEntryForm from "../Form/PackageForm";
import TourDetailsForm from "../Form/TourDetailsForm";
import { useDispatch } from "react-redux";
import { createPackage, updatePackageTourDetails } from "../../../../features/package/packageSlice";
import { useNavigate } from "react-router-dom";

const steps = ["Package Info", "Tour Details"];

const MultiStepPackageForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [createdPackageId, setCreatedPackageId] = useState(null);
    const [step1Data, setStep1Data] = useState({}); // Step1 ka data yahan store
    const [step2Data, setStep2Data] = useState({}); // Step2 ka data yahan store

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Step 1 → Create new package
    const handleNextStep1 = async (values, stayLocations) => {
        try {
            const payload = { ...values, stayLocations }; // ✅ stayLocations include karna
            const result = await dispatch(createPackage(payload)).unwrap();

            if (!result || !result._id) {
                alert("❌ Backend did not return a valid package ID");
                return;
            }

            setCreatedPackageId(result._id.toString().trim());
            setStep1Data(payload); // Step1 data save
            setActiveStep(1);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to create package");
        }
    };

    // Step 2 → Update tour details
    const handleNextStep2 = async (step2Values) => {
        if (!createdPackageId) {
            alert("❌ Package ID not found. Complete Step 1 first.");
            return;
        }

        try {
            const payload = {
                id: createdPackageId,
                data: {
                    arrivalCity: step2Values.arrivalCity || "",
                    departureCity: step2Values.departureCity || "",
                    title: step2Values.title || "",
                    notes: step2Values.notes || "",
                    days: (step2Values.days || []).map((day) => ({
                        title: day.title || "",
                        notes: day.notes || "",
                        aboutCity: day.aboutCity || "",
                        sightseeing: day.sightseeing || [],
                        selectedSightseeing: day.selectedSightseeing || [],
                        dayImage: day.dayImage || null,
                    })),
                    // ✅ Optional: if tourDetails wants perPerson / mealPlan
                    perPerson: step2Values.perPerson || 1,
                    mealPlan: step2Values.mealPlan || { planType: "", description: "" },
                    destinationNights:
                        step2Values.destinationNights || step1Data.stayLocations?.map((s) => ({
                            destination: s.city,
                            nights: s.nights,
                            hotels: [
                                { category: "standard", hotelName: "", pricePerPerson: 0 },
                                { category: "deluxe", hotelName: "", pricePerPerson: 0 },
                                { category: "superior", hotelName: "", pricePerPerson: 0 },
                            ],
                        })) || [],
                },
            };

            console.log("🚀 Sending Step2 Payload:", payload);

            const result = await dispatch(updatePackageTourDetails(payload)).unwrap();
            alert("✅ Tour details updated successfully!");
            console.log("Step 2 Response:", result);

            navigate("/tourpackage"); // Finish
        } catch (err) {
            console.error("❌ Step 2 Error:", err);
            alert("❌ Failed to update tour details");
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom color="primary">
                Package Form
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label, i) => (
                    <Step key={i}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box mt={2}>
                {activeStep === 0 && (
                    <PackageEntryForm
                        onNext={handleNextStep1}
                        initialData={step1Data}
                    />
                )}
                {activeStep === 1 && (
                    <TourDetailsForm
                        onNext={handleNextStep2}
                        initialData={step1Data} // ✅ Step1 data automatically Step2 me
                        packageId={createdPackageId}
                    />
                )}
            </Box>

            {activeStep === 1 && (
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="outlined" onClick={handleBack}>
                        Back
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default MultiStepPackageForm;
