import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";

import StaffForm from "./StaffForm";
import StaffFirmForm from "./StaffFirmForm";
import { getStaffById, updateStaff } from "../../../../features/staff/staffSlice";

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Required"),
    mobile: Yup.string().required("Required"),
    designation: Yup.string().required("Required"),
    userRole: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email"),
    country: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    firmType: Yup.string().required("Required"),
    firmName: Yup.string().required("Required"),
});

const EditStaff = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const formik = useFormik({
        initialValues: {
            // personal
            fullName: "",
            mobile: "",
            alternateContact: "",
            designation: "",
            userRole: "",
            email: "",
            title: "",
            dob: null,
            address1: "",
            address2: "",
            address3: "",
            pincode: "",
            country: "",
            state: "",
            city: "",
            // firm
            firmType: "",
            gstin: "",
            cin: "",
            pan: "",
            turnover: "",
            firmName: "",
            firmDescription: "",
            sameAsContact: false,
            supportingDocs: null,
            // bank
            bankName: "",
            branchName: "",
            accountHolderName: "",
            accountNumber: "",
            ifscCode: "",
        },
        validationSchema,
        onSubmit: (values) => {
            const formattedData = {
                personalDetails: {
                    fullName: values.fullName,
                    title: values.title,
                    firstName: values.fullName.split(" ")[0] || "",
                    lastName: values.fullName.split(" ").slice(1).join(" ") || "",
                    mobileNumber: values.mobile,
                    alternateContact: values.alternateContact,
                    designation: values.designation,
                    userRole: values.userRole,
                    email: values.email,
                    dob: values.dob,
                },
                staffLocation: {
                    country: values.country,
                    state: values.state,
                    city: values.city,
                },
                address: {
                    addressLine1: values.address1,
                    addressLine2: values.address2,
                    addressLine3: values.address3,
                    pincode: values.pincode,
                },
                firm: {
                    firmType: values.firmType,
                    gstin: values.gstin,
                    cin: values.cin,
                    pan: values.pan,
                    turnover: values.turnover,
                    firmName: values.firmName,
                    firmDescription: values.firmDescription,
                    sameAsContact: values.sameAsContact,
                    supportingDocs: values.supportingDocs,
                },
                bank: {
                    bankName: values.bankName,
                    branchName: values.branchName,
                    accountHolderName: values.accountHolderName,
                    accountNumber: values.accountNumber,
                    ifscCode: values.ifscCode,
                },
            };

            dispatch(updateStaff({ id, data: formattedData }))
                .unwrap()
                .then(() => {
                    navigate("/staff");
                })
                .catch((err) => console.error("Update failed:", err));
        },
    });

    // Fetch data for editing
    useEffect(() => {
        setLoading(true);
        dispatch(getStaffById(id))
            .unwrap()
            .then((res) => {
                const data = res.data; // adjust based on your API response
                formik.setValues({
                    fullName: data.personalDetails?.fullName || "",
                    mobile: data.personalDetails?.mobileNumber || "",
                    alternateContact: data.personalDetails?.alternateContact || "",
                    designation: data.personalDetails?.designation || "",
                    userRole: data.personalDetails?.userRole || "",
                    email: data.personalDetails?.email || "",
                    title: data.personalDetails?.title || "",
                    dob: data.personalDetails?.dob ? dayjs(data.personalDetails.dob) : null,
                    address1: data.address?.addressLine1 || "",
                    address2: data.address?.addressLine2 || "",
                    address3: data.address?.addressLine3 || "",
                    pincode: data.address?.pincode || "",
                    country: data.staffLocation?.country || "",
                    state: data.staffLocation?.state || "",
                    city: data.staffLocation?.city || "",
                    firmType: data.firm?.firmType || "",
                    gstin: data.firm?.gstin || "",
                    cin: data.firm?.cin || "",
                    pan: data.firm?.pan || "",
                    turnover: data.firm?.turnover || "",
                    firmName: data.firm?.firmName || "",
                    firmDescription: data.firm?.firmDescription || "",
                    sameAsContact: data.firm?.sameAsContact || false,
                    supportingDocs: null, // handle separately if file
                    bankName: data.bank?.bankName || "",
                    branchName: data.bank?.branchName || "",
                    accountHolderName: data.bank?.accountHolderName || "",
                    accountNumber: data.bank?.accountNumber || "",
                    ifscCode: data.bank?.ifscCode || "",
                });
            })
            .finally(() => setLoading(false));
    }, [dispatch, id]);

    if (loading) return <CircularProgress />;

    return (
        <Box p={3}>
            <Typography variant="h6" gutterBottom>
                Edit Staff
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                {/* Step 1 : Personal + Address */}
                <StaffForm formik={formik} isEdit />
                {/* Step 2 : Firm + Bank */}
                <StaffFirmForm formik={formik} />
                <Box display="flex" justifyContent="center" mt={3}>
                    <Button type="submit" variant="contained" color="primary">
                        Update Staff
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditStaff;
