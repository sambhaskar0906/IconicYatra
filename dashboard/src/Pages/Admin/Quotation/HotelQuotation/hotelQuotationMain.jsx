import React, { useState, useEffect } from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Paper,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import HotelQuotationStep1 from "../HotelQuotation/hotelquotation";
import HotelQuotationStep2 from "../HotelQuotation/HotelQuotationStep2";
import HotelQuotationStep3 from "../HotelQuotation/HotelQuotationStep3";
import HotelQuotationStep4 from "../HotelQuotation/HotelQuotationStep4";
import HotelQuotationStep5 from "../HotelQuotation/HotelQuotationStep5";
import { createHotelQuotation } from "../../../../features/quotation/hotelQuotation";

const steps = [
    "Basic Details",
    "Itinerary Setup",
    "Hotel Configuration",
    "Transport Details",
    "Final Review"
];

const HotelQuotationMain = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        step1: null,
        step2: null,
        step3: null,
        step4: null,
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const dispatch = useDispatch();

    // ✅ Enhanced Data Logging
    useEffect(() => {
        console.log("=== MAIN COMPONENT DATA STATE ===");
        console.log("📊 CURRENT FORM DATA STATE:", formData);
        console.log("🔍 Step1 Data:", formData.step1);
        console.log("🔍 Step1 Client Name:", formData.step1?.clientName);
        console.log("🔍 Step2 Data:", formData.step2);
        console.log("🔍 Step3 Data:", formData.step3);
        console.log("🔍 Step4 Data:", formData.step4);
        console.log("========================");
    }, [formData]);

    // ✅ FIXED: Handle moving to next step - PROPER data passing
    const handleNext = (stepData) => {
        console.log(`✅ STEP ${activeStep + 1} COMPLETED:`, stepData);

        // ✅ IMMEDIATE state update
        const stepKey = `step${activeStep + 1}`;
        const newFormData = {
            ...formData,
            [stepKey]: stepData
        };

        setFormData(newFormData);
        console.log(`🔄 UPDATED FORM DATA for ${stepKey}:`, newFormData[stepKey]);

        if (activeStep === steps.length - 2) {
            setOpenConfirmDialog(true);
        } else {
            // ✅ Small delay to ensure state is updated
            setTimeout(() => {
                setActiveStep((prevStep) => prevStep + 1);
            }, 100);
        }
    };

    // Handle moving to previous step
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    // Handle final submission
    const handleSubmitQuotation = async () => {
        try {
            setSubmissionStatus('loading');

            const finalData = {
                ...formData.step1,
                itinerary: formData.step2,
                hotels: formData.step3,
                transport: formData.step4,
                createdAt: new Date().toISOString(),
                status: 'draft'
            };

            await dispatch(createHotelQuotation(finalData)).unwrap();

            setSubmissionStatus('success');
            setOpenConfirmDialog(false);

            setTimeout(() => {
                setActiveStep(0);
                setFormData({
                    step1: null,
                    step2: null,
                    step3: null,
                    step4: null,
                });
                setSubmissionStatus(null);
            }, 2000);

        } catch (error) {
            console.error('Submission failed:', error);
            setSubmissionStatus('error');
        }
    };

    const renderStepContent = (step) => {
        console.log(`🎯 RENDERING STEP ${step + 1} with data:`, {
            step1Data: formData.step1,
            step2Data: formData.step2,
            step3Data: formData.step3,
            step4Data: formData.step4
        });

        const commonProps = {
            onNext: handleNext,
            onBack: handleBack,
            initialData: formData[`step${step + 1}`] || {},
        };

        switch (step) {
            case 0:
                return <HotelQuotationStep1 {...commonProps} />;
            case 1:
                return <HotelQuotationStep2
                    {...commonProps}
                    step1Data={formData.step1 || {}} // ✅ Pass step1 data
                />;
            case 2:
                return <HotelQuotationStep3
                    {...commonProps}
                    step1Data={formData.step1 || {}} // ✅ Pass step1 data
                    step2Data={formData.step2 || {}}
                />;
            case 3:
                return <HotelQuotationStep4
                    {...commonProps}
                    step1Data={formData.step1 || {}} // ✅ CRITICAL: Pass step1 data to Step4
                    step2Data={formData.step2 || {}}
                    step3Data={formData.step3 || {}}
                />;
            case 4:
                return <HotelQuotationStep5
                    formData={formData}
                    onBack={handleBack}
                    onSubmit={handleSubmitQuotation}
                    submissionStatus={submissionStatus}
                />;
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {/* Header */}
                <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                    Hotel Quotation
                </Typography>

                <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
                    Create a comprehensive hotel quotation in simple steps
                </Typography>

                {/* ✅ ENHANCED Data Status Alert */}
                {formData.step1 && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        <strong>Step 1 Data Loaded:</strong><br />
                        Client: {formData.step1.clientName || 'Not found'} |
                        Arrival: {formData.step1.arrivalLocation || 'Not found'} →
                        Departure: {formData.step1.departureLocation || 'Not found'}
                    </Alert>
                )}

                {!formData.step1 && activeStep > 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        ⚠️ Step 1 data not available. Please go back to Step 1 and complete it.
                    </Alert>
                )}

                {/* Stepper */}
                <Box sx={{ width: '100%', mt: 4, mb: 6 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Step Content */}
                <Box sx={{ mt: 2 }}>
                    {renderStepContent(activeStep)}
                </Box>
            </Paper>

            {/* Confirmation Dialog */}
            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>Ready to Review?</DialogTitle>
                <DialogContent>
                    <Typography>
                        You're about to proceed to the final review step. Make sure all information is correct.
                        You can still go back and make changes before final submission.
                    </Typography>
                    {formData.step1 && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            <strong>Client:</strong> {formData.step1.clientName || 'Not specified'}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setOpenConfirmDialog(false);
                            setActiveStep(steps.length - 1);
                        }}
                        variant="contained"
                    >
                        Continue to Review
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default HotelQuotationMain;