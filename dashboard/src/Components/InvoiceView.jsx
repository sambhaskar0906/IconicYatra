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
import ShareIcon from '@mui/icons-material/Share';
import PaymentIcon from '@mui/icons-material/Payment';
import logo from '../assets/Logo/logoiconic.jpg';
import digital from '../assets/Digital/digital.jpeg';

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
        voucherType,
        date = new Date().toLocaleDateString('en-GB'),
        particulars,
        paymentMode,
        reference,
        paymentLink = 'https://iconicyatra.com/payment' // Default payment link
    } = payment;

    const amountInWords = `${toWords(amount || 0)} only`.replace(/\b\w/g, c => c.toUpperCase());
    const isReceipt = voucherType === 'receive';

    const handleDownload = () => {
        const element = invoiceRef.current;
        const opt = {
            margin: 0.3, // Margin कम किया
            filename: `${receipt || 'invoice'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handlePaymentClick = () => {
        window.open(paymentLink, '_blank', 'noopener,noreferrer');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${isReceipt ? 'Receive Voucher' : 'Payment Voucher'} - ${receipt}`,
                    text: `Please find the ${isReceipt ? 'receive' : 'payment'} voucher details. Amount: ₹${amount}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <Box maxWidth="1000px" mx="auto" my={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
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
                    onClick={handleShare}
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

            {/* Invoice Paper - COMPACT VERSION */}
            <Box
                component={Paper}
                elevation={10}
                ref={invoiceRef}
                sx={{
                    p: { xs: 2, md: 3 }, // Padding कम किया
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    position: "relative",
                    overflow: "hidden",
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.08)",
                    maxWidth: '100%',
                }}
            >
                {/* Watermark - SIZE REDUCED */}
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
                        height: 200, // Size कम किया
                        zIndex: 0,
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />

                {/* Title - COMPACT */}
                <Typography
                    variant="h5" // h4 से h5 किया
                    align="center"
                    fontWeight={700}
                    sx={{
                        textTransform: 'uppercase',
                        color: '#0b5394',
                        mb: 1, // Margin कम किया
                        letterSpacing: 1,
                        position: 'relative',
                        zIndex: 1,
                        borderBottom: "2px solid #1976d2",
                        pb: 0.5 // Padding कम किया
                    }}
                >
                    {isReceipt ? 'Receive Voucher' : 'Payment Voucher'}
                </Typography>

                {/* Header - COMPACT */}
                <Grid container justifyContent="space-between" alignItems="center" mt={2} mb={1}>
                    <Grid item xs={12} sm={6}>
                        <Box>
                            <img src={logo} alt="Logo" style={{ height: 50 }} /> {/* Logo size कम किया */}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box textAlign={{ xs: 'left', sm: 'right' }}>
                            <Typography variant="h6" fontWeight={700} fontSize="1.1rem">Iconic Yatra</Typography>
                            <Typography fontSize={12}>Noida - 201301, Uttar Pradesh</Typography> {/* Font size कम किया */}
                            <Typography fontSize={12}>📞 +91 7053900957</Typography>
                            <Typography fontSize={12}>✉️ info@iconicyatra.com</Typography>
                            <Link
                                href="https://www.iconicyatra.com"
                                target="_blank"
                                underline="hover"
                                color="primary"
                                fontSize={12}
                            >
                                🌐 www.iconicyatra.com
                            </Link>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} /> {/* Margin कम किया */}

                {/* Party Info - COMPACT */}
                <Stack spacing={0.3} mb={2} zIndex={1}>
                    <Typography variant="subtitle1" fontWeight={600} color="#1976d2" fontSize="0.9rem">
                        {isReceipt ? 'Received From:' : 'Paid To:'}
                    </Typography>
                    <Typography fontSize={14} fontWeight={500}>{partyName}</Typography>
                    <Typography fontSize={12} color="text.secondary">{country}</Typography>
                </Stack>

                {/* Date and Receipt Number - COMPACT */}
                <Grid container justifyContent="space-between" mb={2}>
                    <Grid item>
                        <Typography fontSize={12}><strong>Date:</strong> {date}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography fontSize={12}><strong>{isReceipt ? 'Receipt No:' : 'Payment No:'}</strong> {receipt || '-'}</Typography>
                    </Grid>
                </Grid>

                {/* Amount Box - COMPACT */}
                <Box
                    my={2} // Margin कम किया
                    sx={{
                        background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
                        borderRadius: 2,
                        border: '1px dashed #2196f3',
                        p: 2, // Padding कम किया
                        zIndex: 1,
                    }}
                >
                    <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
                        <Grid item xs={12} sm={8}>
                            <Typography fontWeight={600} gutterBottom color="#0d47a1" fontSize="0.9rem">
                                Amount In Words
                            </Typography>
                            <Typography fontSize={14}>{amountInWords}</Typography>
                            <Typography fontSize={12} color="text.secondary">INR</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                fontSize="1.8rem" // Font size कम किया
                                fontWeight="bold"
                                color="#2e7d32"
                                textAlign={{ xs: 'left', sm: 'right' }}
                            >
                                ₹ {Number(amount).toLocaleString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Particulars - COMPACT */}
                <Box my={2}>
                    <Typography fontWeight={600} gutterBottom color="#1976d2" fontSize="0.9rem">
                        Particulars
                    </Typography>
                    <Typography fontSize={14}>{particulars}</Typography>
                </Box>

                {/* Payment Mode - COMPACT */}
                <Box mb={2}>
                    <Typography fontWeight={600} gutterBottom color="#1976d2" fontSize="0.9rem">
                        Payment Mode
                    </Typography>
                    <Typography fontSize={14}>{paymentMode}</Typography>
                </Box>

                <Box mb={3}>
                    <Typography fontWeight={600} gutterBottom color="#1976d2" fontSize="0.9rem">
                        Transaction Id:
                    </Typography>
                    <Typography fontSize={14}>{reference}</Typography>
                </Box>

                {/* Payment Link Section - COMPACT VERSION */}
                {!isReceipt && (
                    <Box
                        mb={3}
                        sx={{
                            p: 2, // Padding कम किया
                            border: '2px dashed #28a745',
                            borderRadius: 2,
                            backgroundColor: '#f8fff9',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} color="#28a745" gutterBottom fontSize="1rem">
                            💳 Online Payment
                        </Typography>
                        <Button
                            variant="contained"
                            size="medium" // large से medium किया
                            sx={{
                                background: 'linear-gradient(to right, #28a745, #20c997)',
                                color: 'white',
                                px: 3, // Padding कम किया
                                py: 1, // Padding कम किया
                                borderRadius: 2,
                                fontWeight: 'bold',
                                fontSize: '0.9rem', // Font size कम किया
                                mb: 1,
                                '&:hover': {
                                    background: 'linear-gradient(to right, #218838, #1e7e34)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)',
                                },
                            }}
                            startIcon={<PaymentIcon />}
                            onClick={handlePaymentClick}
                        >
                            Pay ₹{Number(amount).toLocaleString()} Now
                        </Button>
                        <Typography variant="body2" color="text.secondary" gutterBottom fontSize="0.8rem">
                            Secure payment via Iconic Yatra
                        </Typography>
                        <Link
                            href={paymentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                mt: 0.5,
                                display: 'block',
                                fontSize: '12px', // Font size कम किया
                                color: '#1976d2',
                                wordBreak: 'break-all'
                            }}
                        >
                            {paymentLink}
                        </Link>
                    </Box>
                )}

                <Divider sx={{ my: 1 }} /> {/* Margin कम किया */}

                {/* Signatures - COMPACT */}
                <Grid container justifyContent="space-between" alignItems="center" mt={2}>
                    <Grid item>
                        <Typography fontSize={12}>For, <strong>Iconic Yatra</strong></Typography>
                    </Grid>
                    <Grid item>
                        <img
                            src={digital}
                            alt="Digital Signature"
                            style={{
                                height: '50px', // Size कम किया
                                width: '150px' // Size कम किया
                            }}
                        />
                        <Typography fontWeight={600} fontSize={12} textAlign="right">
                            Authorized Signatory
                        </Typography>
                    </Grid>
                </Grid>

                {/* Footer - COMPACT */}
                <Box textAlign="center" mt={2} zIndex={1}>
                    <Typography variant="caption" color="gray" fontSize={11}>
                        Powered by Iconic Yatra Billing System
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default InvoiceView;