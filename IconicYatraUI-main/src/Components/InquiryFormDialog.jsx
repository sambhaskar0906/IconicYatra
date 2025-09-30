// src/Components/InquiryFormDialog.jsx
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Alert
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createInquiry, resetInquiryState } from "../Features/inquirySlice";

const InquiryFormDialog = ({ open, handleClose, title = "Travel Inquiry", defaultDestination = "" }) => {
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.inquiry);

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        persons: "",
        destination: defaultDestination,
        date: "",
    });

    useEffect(() => {
        setForm((prev) => ({ ...prev, destination: defaultDestination }));
    }, [defaultDestination, open]);

    useEffect(() => {
        if (success) {
            // Reset form after successful submission
            setForm({
                name: "",
                email: "",
                mobile: "",
                persons: "",
                destination: "",
                date: "",
            });
            dispatch(resetInquiryState());
            handleClose();
        }
    }, [success, dispatch, handleClose]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        dispatch(createInquiry(form));
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, textAlign: "center", color: "#ff9800" }}>
                ✈ {title} - Iconic Yatra
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity="error">{error.message || error}</Alert>}
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} required />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} required />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="No. of Persons" name="persons" type="number" value={form.persons} onChange={handleChange} required />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Destination" name="destination" value={form.destination} onChange={handleChange} required />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth type="date" name="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} label="Travel Date" required />
                        </Grid>
                        <Grid size={{ xs: 12 }} sx={{ textAlign: "center", mt: 2 }}>
                            <Button type="submit" variant="contained" color="warning" size="large" sx={{ px: 5, borderRadius: 3 }} disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Inquiry"}
                            </Button>
                        </Grid>
                    </Grid>
                </form >
            </DialogContent >
        </Dialog >
    );
};

export default InquiryFormDialog;
