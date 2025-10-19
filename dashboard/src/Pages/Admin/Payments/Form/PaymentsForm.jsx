import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    Paper,
    Avatar,
    Stack,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Link,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const accountTypes = ['Savings', 'Current', 'Credit'];
const partyNames = ['Dharamveer Singh', 'Party B', 'Party C'];
const paymentModes = ['Cash', 'Cheque', 'UPI', 'Bank Transfer'];
const paymentLink = 'https://iconicyatra.com/payment';

const PaymentsForm = () => {
    const navigate = useNavigate();

    const [voucherType, setVoucherType] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    const formik = useFormik({
        initialValues: {
            date: '',
            screenshot: null,
            accountType: '',
            partyName: '',
            paymentMode: '',
            reference: '',
            particulars: '',
            amount: '',
            paymentLinkUsed: false, // New field to track if payment link was used
        },
        validationSchema: Yup.object({
            date: Yup.string().required('Date is required'),
            screenshot: Yup.mixed().nullable(),
            accountType: Yup.string().required('Select account type'),
            partyName: Yup.string().required('Select party name'),
            paymentMode: Yup.string().required('Select payment mode'),
            reference: Yup.string().when('voucherType', {
                is: 'receive',
                then: (schema) => schema.required('Reference is required for receipt'),
                otherwise: (schema) => schema.notRequired()
            }),
            particulars: Yup.string(),
            amount: Yup.number().typeError('Amount must be a number').required('Enter amount'),
            paymentLinkUsed: Yup.boolean(),
        }),
        onSubmit: (values) => {
            const formData = {
                ...values,
                voucherType,
                type: voucherType === 'receive' ? 'Cr' : 'Dr',
                screenshot: previewImage,
                receipt: getNextReceiptNumber(),
                invoice: getNextInvoiceNumber(),
                paymentLink: voucherType === 'payment' ? paymentLink : null, // Store payment link for PDF
            };

            // Save to localStorage
            const existingPayments = JSON.parse(localStorage.getItem('payments')) || [];
            localStorage.setItem('payments', JSON.stringify([...existingPayments, formData]));

            // Navigate with state (optional)
            navigate('/payments', { state: { newPayment: formData } });
        }

    });

    const getNextReceiptNumber = () => {
        const current = parseInt(localStorage.getItem('receiptCounter') || '0', 10) + 1;
        localStorage.setItem('receiptCounter', current);
        return `RCPT-${String(current).padStart(3, '0')}`;
    };

    const getNextInvoiceNumber = () => {
        const current = parseInt(localStorage.getItem('invoiceCounter') || '0', 10) + 1;
        localStorage.setItem('invoiceCounter', current);
        return `INV-${String(current).padStart(3, '0')}`;
    };

    const handlePaymentLinkClick = () => {
        // Mark that payment link was used
        formik.setFieldValue('paymentLinkUsed', true);

        // Open payment link in new tab
        window.open(paymentLink, '_blank');

        // Optional: Add reference automatically
        if (!formik.values.reference) {
            formik.setFieldValue('reference', `Online-Payment-${Date.now()}`);
        }
    };

    return (
        <Paper elevation={5} sx={{ p: 4, borderRadius: 4, maxWidth: 900, mx: 'auto', mt: 5, bgcolor: '#f5f7fb' }}>

            {/* Voucher Selection */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                    {voucherType === 'receive' ? 'Receive Voucher' : 'Payment Voucher'}
                </Typography>
                <RadioGroup
                    row
                    value={voucherType}
                    onChange={(e) => setVoucherType(e.target.value)}
                >
                    <FormControlLabel
                        value="receive"
                        control={<Radio color="primary" />}
                        label="Receive Voucher"
                    />
                    <FormControlLabel
                        value="payment"
                        control={<Radio color="secondary" />}
                        label="Payment Voucher"
                    />
                </RadioGroup>
            </Box>

            {voucherType && (
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                name="date"
                                InputLabelProps={{ shrink: true }}
                                value={formik.values.date}
                                onChange={formik.handleChange}
                                error={formik.touched.date && Boolean(formik.errors.date)}
                                helperText={formik.touched.date && formik.errors.date}
                                sx={{ bgcolor: 'white' }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Button variant="contained" component="label" fullWidth color="secondary">
                                Upload Screenshot (Optional)
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    name="screenshot"
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        formik.setFieldValue("screenshot", file);
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setPreviewImage(reader.result);
                                            reader.readAsDataURL(file);
                                        } else {
                                            setPreviewImage(null);
                                        }
                                    }}
                                />
                            </Button>
                            {previewImage && (
                                <Box mt={1}>
                                    <Typography variant="caption">Preview:</Typography>
                                    <Avatar src={previewImage} variant="rounded" sx={{ width: 60, height: 60, mt: 1 }} />
                                </Box>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth error={formik.touched.accountType && Boolean(formik.errors.accountType)}>
                                <InputLabel>Account Type</InputLabel>
                                <Select
                                    name="accountType"
                                    value={formik.values.accountType}
                                    onChange={formik.handleChange}
                                    label="Account Type"
                                    sx={{ bgcolor: 'white' }}
                                >
                                    {accountTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth error={formik.touched.partyName && Boolean(formik.errors.partyName)}>
                                <InputLabel>Party Name</InputLabel>
                                <Select
                                    name="partyName"
                                    value={formik.values.partyName}
                                    onChange={formik.handleChange}
                                    label="Party Name"
                                    sx={{ bgcolor: 'white' }}
                                >
                                    {partyNames.map((party) => (
                                        <MenuItem key={party} value={party}>
                                            {party}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth error={formik.touched.paymentMode && Boolean(formik.errors.paymentMode)}>
                                <InputLabel>Payment Mode</InputLabel>
                                <Select
                                    name="paymentMode"
                                    value={formik.values.paymentMode}
                                    onChange={formik.handleChange}
                                    label="Payment Mode"
                                    sx={{ bgcolor: 'white' }}
                                >
                                    {paymentModes.map((mode) => (
                                        <MenuItem key={mode} value={mode}>
                                            {mode}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Reference Field - Only for Receive Voucher */}
                        {voucherType === 'receive' && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Reference / Cash / Cheque"
                                    name="reference"
                                    value={formik.values.reference}
                                    onChange={formik.handleChange}
                                    error={formik.touched.reference && Boolean(formik.errors.reference)}
                                    helperText={formik.touched.reference && formik.errors.reference}
                                    sx={{ bgcolor: 'white' }}
                                />
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Particulars"
                                name="particulars"
                                multiline
                                rows={2}
                                value={formik.values.particulars}
                                onChange={formik.handleChange}
                                error={formik.touched.particulars && Boolean(formik.errors.particulars)}
                                helperText={formik.touched.particulars && formik.errors.particulars}
                                sx={{ bgcolor: 'white' }}
                            />
                        </Grid>

                        {/* Payment Link - Only show for Payment Voucher */}
                        {voucherType === 'payment' && (
                            <Grid size={{ xs: 12 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        border: '1px dashed #1976d2',
                                        borderRadius: 2,
                                        backgroundColor: '#e3f2fd',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Online Payment Link
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handlePaymentLinkClick}
                                        sx={{ mb: 1 }}
                                    >
                                        Pay Now via Iconic Yatra
                                    </Button>
                                    <Typography variant="body2" color="text.secondary">
                                        Click above to make payment through secure gateway
                                    </Typography>
                                    <Link
                                        href={paymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ mt: 1, display: 'block' }}
                                    >
                                        {paymentLink}
                                    </Link>
                                </Box>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Amount"
                                name="amount"
                                type="number"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                                helperText={formik.touched.amount && formik.errors.amount}
                                sx={{ bgcolor: 'white' }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                                <Button type="submit" variant="contained" color="primary" size="large">
                                    Submit
                                </Button>
                                <Button type="reset" variant="outlined" color="error" size="large">
                                    Clear
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Paper>
    );
};

export default PaymentsForm;