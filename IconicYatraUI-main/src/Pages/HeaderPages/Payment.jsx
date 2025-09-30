import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AccountBalance,
  CreditCard,
  QrCode,
  Payment,
  Security,
  Download,
  Share,
} from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhonePay from "../../assets/packageimg/QR1.png";
import GPay from "../../assets/packageimg/QR2.png";
import RazorpayButton from "../../RazorPay/PaymentButton";


const PaymentOption = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [copiedField, setCopiedField] = useState(null);


  const bankDetails = [
    {
      bank: "Yes Bank",
      details: {
        name: "ICONIC YATRA",
        account: "001463400002757",
        ifsc: "YESB0000014",
        address: "Block H1 A Sec 63, Noida UP 201301",
      },
      color: "#0047AB",
    },
    {
      bank: "Kotak Bank",
      details: {
        name: "ICONIC YATRA",
        account: "7147083682",
        ifsc: "KKBK0005033",
        address: "SEC 18, NOIDA UP, 201301",
      },
      color: "#FF6B00",
    },
  ];

  const handleDownloadQR = (qrImage, name) => {
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `${name}_QR.png`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Payment Options - Iconic Yatra",
          text: "Check out the payment options for Iconic Yatra",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Breadcrumb */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)",
          border: "1px solid #e0e0e0",
        }}
      >
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <MuiLink
            underline="hover"
            color="inherit"
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              "&:hover": { color: "primary.main" },
            }}
            onClick={() => navigate("/")}
          >
            Home
          </MuiLink>
          <Typography
            color="primary.main"
            sx={{ display: "flex", alignItems: "center", fontWeight: "600" }}
          >
            <Payment sx={{ mr: 1, fontSize: 20 }} />
            Payment Option
          </Typography>
        </Breadcrumbs>
      </Paper>

      <Grid container spacing={4}>
        {/* LEFT SIDE - PAYMENT DETAILS */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Payment <span style={{ color: "#ffd54f" }}>Options</span>
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              {/* Security Badge */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4,
                  p: 2,
                  backgroundColor: "#e8f5e9",
                  borderRadius: 2,
                  border: "2px dashed #4caf50",
                }}
              >
                <Security sx={{ color: "#4caf50", mr: 2 }} />
                <Typography variant="h6" color="#2e7d32" fontWeight="bold">
                  🔒 100% Secure Payment Processing
                </Typography>
              </Box>

              {/* NET BANKING SECTION */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AccountBalance
                    sx={{ color: "primary.main", mr: 2, fontSize: 30 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    Net Banking
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: "text.secondary" }}
                >
                  Transfer funds directly from your bank account using the
                  details below:
                </Typography>

                {/* Bank Details Cards */}
                <Grid container spacing={3}>
                  {bankDetails.map((bank, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          border: `2px solid ${bank.color}20`,
                          background: `linear-gradient(135deg, #ffffff 0%, ${bank.color}08 100%)`,
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <Chip
                          label={bank.bank}
                          sx={{
                            backgroundColor: bank.color,
                            color: "white",
                            fontWeight: "bold",
                            mb: 2,
                          }}
                        />

                        {Object.entries(bank.details).map(([key, value]) => {
                          const isAccountOrIFSC =
                            key.toLowerCase().includes("account") ||
                            key.toLowerCase().includes("ifsc");

                          return (
                            <Box key={key} sx={{ mb: 1.5 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: "bold",
                                  color: "text.secondary",
                                  textTransform: "uppercase",
                                }}
                              >
                                {key.replace(/([A-Z])/g, " $1")}:
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mt: 0.5,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: isAccountOrIFSC ? "bold" : "normal",
                                    fontSize: isAccountOrIFSC ? "1.1rem" : "1rem",
                                  }}
                                >
                                  {value}
                                </Typography>

                                {isAccountOrIFSC && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      minWidth: "24px",
                                      p: "2px",
                                      borderRadius: "50%",
                                      borderColor: bank.color,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                    onClick={() => {
                                      navigator.clipboard.writeText(value);
                                      setCopiedField(`${bank.bank}_${key}`);
                                      setTimeout(() => setCopiedField(null), 1500);
                                    }}
                                  >
                                    {copiedField === `${bank.bank}_${key}` ? (
                                      <Typography sx={{ fontSize: "0.8rem", color: "green" }}>
                                        Copied!
                                      </Typography>
                                    ) : (
                                      <ContentCopyIcon sx={{ fontSize: "16px" }} />
                                    )}
                                  </Button>
                                )}

                              </Box>
                            </Box>
                          );
                        })}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

              </Box>

              <Divider sx={{ my: 4 }} />

              {/* CREDIT/DEBIT CARD SECTION */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CreditCard sx={{ color: "#ff9800", mr: 2, fontSize: 30 }} />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#ff9800" }}
                  >
                    Credit/Debit Cards
                  </Typography>
                </Box>

                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#fff3e0",
                    border: "2px dashed #ff9800",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, fontStyle: "italic" }}
                  >
                    💡 <strong>Note:</strong> All cards are accepted here. 3%
                    extra charges apply for card payments.
                  </Typography>

                  {/* Razorpay Payment Button */}
                  <RazorpayButton
                    onBack={() => console.log("Back clicked")}
                    onNext={() => console.log("Payment successful! Proceed to next step")}
                  />

                </Paper>
              </Box>


              <Divider sx={{ my: 4 }} />

              {/* ADDITIONAL INSTRUCTIONS */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}
                >
                  📋 Payment Instructions
                </Typography>
                <Grid container spacing={2}>
                  {[
                    "Local / at par AC Payee Cheque should be drawn in the name of Iconic Yatra",
                    "Cash payments at our office during office hours. Please collect receipts",
                    "Booking subject to NEFT/RTGS transfers. Cheque clearance within 3 working days",
                  ].map((instruction, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={index}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          height: "100%",
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {instruction}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT SIDE - QR CODES */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)",
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              position: "sticky",
              top: 20,
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <QrCode sx={{ color: "primary.main", mr: 2, fontSize: 32 }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Scan to Pay
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Quick and secure payments using UPI apps
              </Typography>

              {/* QR Codes */}
              <Grid container spacing={4}>
                {[
                  { src: PhonePay, name: "Phone Pay", color: "#5c29db" },
                  { src: GPay, name: "Google Pay", color: "#4285f4" },
                ].map((qr, index) => (
                  <Grid size={{ xs: 12, md: 12 }} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, #ffffff 0%, ${qr.color}08 100%)`,
                        border: `2px solid ${qr.color}20`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <Chip
                        label={qr.name}
                        sx={{
                          backgroundColor: qr.color,
                          color: "white",
                          fontWeight: "bold",
                          mb: 2,
                        }}
                      />
                      <img
                        src={qr.src}
                        alt={`${qr.name} QR`}
                        style={{
                          width: "100%",
                          maxWidth: 200,
                          borderRadius: 12,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      />
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleDownloadQR(qr.src, qr.name)}
                          sx={{ borderRadius: 2 }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Share />}
                          onClick={handleShare}
                          sx={{ borderRadius: 2 }}
                        >
                          Share
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Support Info */}
              <Paper
                elevation={1}
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "#e3f2fd",
                  border: "2px solid #bbdefb",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1, color: "#1565c0" }}
                >
                  💁 Need Help?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Contact our support team for payment assistance
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background:
                      "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
                    borderRadius: 2,
                    fontWeight: "bold",
                  }}
                >
                  Contact Support
                </Button>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentOption;
