import React, { useRef } from 'react';
import {
    Box,
    Typography,
    Divider,
    Grid,
    Paper,
    Stack,
    Link,
    Button,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toWords } from 'number-to-words';
import html2pdf from 'html2pdf.js';
import DownloadIcon from '@mui/icons-material/Download';
import logo from '../assets/logo.png';
import ShareIcon from '@mui/icons-material/Share';


const InvoiceView = () => {
    const location = useLocation();
    const payment = location.state?.payment;
    const invoiceRef = useRef();

    if (!payment) {
        return <Typography>No data found</Typography>;
    }

    const {
        partyName,
        country = 'India',
        receipt,
        amount,
        type,
        date = new Date().toLocaleDateString('en-GB'),
        particulars,
        paymentMode,
    } = payment;

    const amountInWords = `${toWords(amount || 0)} only`.replace(/\b\w/g, c => c.toUpperCase());
    const isReceipt = type === 'Dr';

    const handleDownload = () => {
        const element = invoiceRef.current;
        const opt = {
            margin: 0.5,
            filename: `${receipt || 'invoice'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <Box maxWidth="1000px" mx="auto" my={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                {/* Share Button */}
                <Button
                    variant="outlined"
                    sx={{
                        color: '#1976d2',
                        borderColor: '#1976d2',
                        px: 2.5,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#e3f2fd',
                            borderColor: '#1565c0',
                        },
                    }}
                    startIcon={<ShareIcon />}
                    onClick={() => {
                        // Replace this logic with actual share feature if needed
                        alert('Share functionality coming soon!');
                    }}
                >
                    Share
                </Button>

                {/* Download Button */}
                <Button
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(to right, #1976d2, #004ba0)',
                        color: '#fff',
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        '&:hover': {
                            background: 'linear-gradient(to right, #1565c0, #003c8f)',
                        },
                    }}
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                >
                    Download PDF
                </Button>
            </Box>


            {/* Invoice Paper */}
            <Box
                component={Paper}
                elevation={10}
                ref={invoiceRef}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    position: "relative",
                    overflow: "hidden",
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.08)",
                }}
            >
                {/* Watermark */}
                <Box
                    component="img"
                    src={logo}
                    alt="Watermark"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        opacity: 0.03,
                        height: 320,
                        zIndex: 0,
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />

                {/* Title */}
                <Typography
                    variant="h4"
                    align="center"
                    fontWeight={700}
                    sx={{
                        textTransform: 'uppercase',
                        color: '#0b5394',
                        mb: 2,
                        letterSpacing: 1.2,
                        position: 'relative',
                        zIndex: 1,
                        borderBottom: "2px solid #1976d2",
                        pb: 1
                    }}
                >
                    {isReceipt ? 'Receive Voucher' : 'Payment Voucher'}
                </Typography>

                {/* Header */}
                <Grid container justifyContent="space-between" alignItems="center" mt={3} mb={2}>
                    <Grid item xs={12} sm={6}>
                        <Box>
                            <img src={logo} alt="Logo" style={{ height: 70 }} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box textAlign={{ xs: 'left', sm: 'right' }}>
                            <Typography variant="h6" fontWeight={700}>Iconic Yatra</Typography>
                            <Typography fontSize={14}>Noida - 201301, Uttar Pradesh</Typography>
                            <Typography fontSize={14}>📞 +91 7053900957</Typography>
                            <Typography fontSize={14}>✉️ info@iconicyatra.com</Typography>
                            <Link
                                href="https://www.iconicyatra.com"
                                target="_blank"
                                underline="hover"
                                color="primary"
                                fontSize={14}
                            >
                                🌐 www.iconicyatra.com
                            </Link>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Party Info */}
                <Stack spacing={0.5} mb={3} zIndex={1}>
                    <Typography variant="subtitle1" fontWeight={600} color="#1976d2">Received From:</Typography>
                    <Typography fontSize={16} fontWeight={500}>{partyName}</Typography>
                    <Typography fontSize={14} color="text.secondary">{country}</Typography>
                </Stack>

                {/* Date and Receipt Number */}
                <Grid container justifyContent="space-between" mb={3}>
                    <Grid item>
                        <Typography fontSize={14}><strong>Date:</strong> {date}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography fontSize={14}><strong>Receipt No:</strong> {receipt || '-'}</Typography>
                    </Grid>
                </Grid>

                {/* Amount Box */}
                <Box
                    my={4}
                    sx={{
                        background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
                        borderRadius: 3,
                        border: '1px dashed #2196f3',
                        p: 3,
                        zIndex: 1,
                    }}
                >
                    <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <Typography fontWeight={600} gutterBottom color="#0d47a1">Amount In Words</Typography>
                            <Typography fontSize={16}>{amountInWords}</Typography>
                            <Typography fontSize={14} color="text.secondary">INR</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                fontSize="2.4rem"
                                fontWeight="bold"
                                color="#2e7d32"
                                textAlign={{ xs: 'left', sm: 'right' }}
                            >
                                ₹ {Number(amount).toLocaleString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Particulars */}
                <Box my={3}>
                    <Typography fontWeight={600} gutterBottom color="#1976d2">Particulars</Typography>
                    <Typography fontSize={15}>{particulars}</Typography>
                </Box>

                {/* Payment Mode */}
                <Box mb={4}>
                    <Typography fontWeight={600} gutterBottom color="#1976d2">Payment Mode</Typography>
                    <Typography fontSize={15}>{paymentMode}</Typography>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Signatures */}
                <Grid container justifyContent="space-between" alignItems="center" mt={6}>
                    <Grid item>
                        <Typography fontSize={14}>For, <strong>Iconic Yatra</strong></Typography>
                    </Grid>
                    <Grid item>
                        <Typography fontWeight={600} fontSize={14} textAlign="right">
                            Authorized Signatory
                        </Typography>
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box textAlign="center" mt={6} zIndex={1}>
                    <Typography variant="caption" color="gray" fontSize={13}>
                        Powered by Iconic Yatra Billing System
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default InvoiceView;
