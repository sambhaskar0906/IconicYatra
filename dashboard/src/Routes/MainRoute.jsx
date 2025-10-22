import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Container,
    Box,
    LinearProgress
} from "@mui/material";
import Dashboard from "../Pages/Admin/Dashboard";
import DashboardLayout from "../Layout/DashboardLayout";
import LeadCard from "../Pages/Admin/Lead/LeadCard";
import LeadCreationFlow from "../Pages/Admin/Lead/Form/LeadCreationFlow";
import LeadEditForm from "../Pages/Admin/Lead/Form/LeadEditForm";
import HotelCard from "../Pages/Admin/Hotel/HotelCard";
import HotelForm from "../Pages/Admin/Hotel/Form/HotelForm";
import HotelEditForm from "../Pages/Admin/Hotel/Form/HotelEditForm";
import PackageCard from "../Pages/Admin/TourPackage/PackageCard";
import MultiStepPackageForm from "../Pages/Admin/TourPackage/Form/MultiStepPackageForm";
import PackageEditForm from "../Pages/Admin/TourPackage/Form/PackagrEditForm";
import AssociatesCard from "../Pages/Admin/Associates/AssociatesCard";
import AssociatesForm from "../Pages/Admin/Associates/Form/AssociatesForm";
import AssociatesEditFrom from "../Pages/Admin/Associates/Form/AssociatesEditFrom";
import StaffCard from "../Pages/Admin/Staff/StaffCard";
import StaffForm from "../Pages/Admin/Staff/Form/StaffForm";
import PaymentsCard from "../Pages/Admin/Payments/PaymentsCard";
import PaymentsForm from "../Pages/Admin/Payments/Form/PaymentsForm";
import InvoiceView from "../Components/InvoiceView";
import EditProfile from "../Pages/Admin/User/EditProfile";
import QuotationCard from "../Pages/Admin/Quotation/QuotationCard";
import VehicleQuotation from "../Pages/Admin/Quotation/VehicleQuotation/VehicleQuotation";
import FlightQuotation from "../Pages/Admin/Quotation/FlightQuotation/flightquotation";
import QuickQuotation from "../Pages/Admin/Quotation/QuickQuotation/quickquotation";
import FullQuotation from "../Pages/Admin/Quotation/FullQuotation/fullquotation";
import CustomQuotation from "../Pages/Admin/Quotation/CustomQuotation/customquotation";
import FlightFinalize from "../Pages/Admin/Quotation/FlightQuotation/FlightFinalize";
import VehicleFinalize from "../Pages/Admin/Quotation/VehicleQuotation/VehicleFinalize";
import HotelFinalize from "../Pages/Admin/Quotation/HotelQuotation/HotelFinalize";
import Profile from "../Pages/Admin/Profile/Profile";
import StaffEditForm from "../Pages/Admin/Staff/Form/EditStaff";

// Import the main hotel quotation component
import HotelQuotationMain from "../Pages/Admin/Quotation/HotelQuotation/hotelQuotationMain";

const MainRoute = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showExpiryAlert, setShowExpiryAlert] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = () => {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");

            if (!token || !user) {
                setIsAuthenticated(false);
                setIsAuthChecked(true);
                setLoading(false);
                return;
            }

            try {
                // Validate token format (basic check)
                const tokenParts = token.split('.');
                if (tokenParts.length !== 3) {
                    throw new Error('Invalid token format');
                }

                setIsAuthenticated(true);
                setIsAuthChecked(true);

                // Initialize session start if not exists
                const sessionStart = Number(localStorage.getItem("sessionStart"));
                const now = Date.now();

                if (!sessionStart || now - sessionStart > 10 * 60 * 60 * 1000) {
                    localStorage.setItem("sessionStart", now.toString());
                }

                setLoading(false);
            } catch (error) {
                console.error('Authentication error:', error);
                localStorage.clear();
                setIsAuthenticated(false);
                setIsAuthChecked(true);
                setLoading(false);
            }
        };

        checkAuthentication();
    }, [location]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const expiryTime = 10 * 60 * 60 * 1000; // 10 hours in milliseconds
        const alertBefore = 5 * 60 * 1000; // 5 minutes before expiry

        const timer = setInterval(() => {
            const sessionStart = Number(localStorage.getItem("sessionStart"));
            const now = Date.now();
            const elapsed = now - sessionStart;
            const remaining = expiryTime - elapsed;

            if (remaining <= 0) {
                clearInterval(timer);
                handleLogout();
                return;
            }

            setCountdown(Math.ceil(remaining / 1000));
            setShowExpiryAlert(remaining <= alertBefore);
        }, 1000);

        return () => clearInterval(timer);
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setShowExpiryAlert(false);
        window.location.href = "https://iconicyatra.com/admin/login";
    };

    const handleExtendSession = () => {
        // Reset session timer
        localStorage.setItem("sessionStart", Date.now().toString());
        setShowExpiryAlert(false);
    };

    if (loading) {
        return (
            <Container
                sx={{
                    display: "flex",
                    height: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
            </Container>
        );
    }

    if (!isAuthenticated) {
        const hasPreviousSession = localStorage.getItem("sessionStart");

        // If no valid session, redirect to login
        if (!hasPreviousSession) {
            window.location.href = "https://iconicyatra.com/admin/login";
            return null;
        }

        return (
            <Container
                sx={{
                    display: "flex",
                    height: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Alert
                    severity="error"
                    sx={{
                        width: "100%",
                        maxWidth: 600,
                        textAlign: "center",
                        p: 3,
                        fontSize: "1.1rem",
                    }}
                >
                    <AlertTitle sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                        ⚠️ Session Expired
                    </AlertTitle>
                    Your session has expired. Redirecting to login page...
                </Alert>
            </Container>
        );
    }

    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;

    return (
        <DashboardLayout user={userData}>
            {showExpiryAlert && (
                <Container sx={{ position: "fixed", top: 20, width: "100%", zIndex: 9999 }}>
                    <Alert
                        severity="warning"
                        sx={{
                            maxWidth: 600,
                            margin: "auto",
                            borderRadius: 2,
                            boxShadow: 3
                        }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={handleExtendSession}
                            >
                                EXTEND
                            </Button>
                        }
                    >
                        <AlertTitle sx={{ fontWeight: "bold" }}>⚠️ Session Expiry Alert</AlertTitle>
                        Your session will expire in <b>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</b>. Please save your work.
                        <Box sx={{ mt: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={((36000 - countdown) / 36000) * 100}
                                color="warning"
                            />
                        </Box>
                    </Alert>
                </Container>
            )}

            <Box sx={{
                pt: showExpiryAlert ? 8 : 0,
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <Routes>
                    {/* Dashboard */}
                    <Route path="/" element={<Dashboard user={userData} />} />

                    {/* Lead Routes */}
                    <Route path="/lead" element={<LeadCard />} />
                    <Route path="/lead/leadtourform" element={<LeadCreationFlow />} />
                    <Route path="/lead/leadeditform/:id" element={<LeadEditForm />} />

                    {/* Hotel Routes */}
                    <Route path="/hotel" element={<HotelCard />} />
                    <Route path="/hotelform" element={<HotelForm />} />
                    <Route path="/hotel/edit/:id" element={<HotelEditForm isEdit={true} />} />

                    {/* Tour Package Routes */}
                    <Route path="/tourpackage" element={<PackageCard />} />
                    <Route path="/packageform" element={<MultiStepPackageForm />} />
                    <Route path="/tourpackage/packageeditform/:id" element={<PackageEditForm />} />

                    {/* Associates Routes */}
                    <Route path='/associates' element={<AssociatesCard />} />
                    <Route path='/associatesform' element={<AssociatesForm />} />
                    <Route path='/associates/associateseditform/:associateId' element={<AssociatesEditFrom />} />

                    {/* Staff Routes */}
                    <Route path="/staff" element={<StaffCard />} />
                    <Route path="/staffform" element={<StaffForm />} />
                    <Route path="/staff/staffeditform/:staffId" element={<StaffEditForm />} />

                    {/* Payments Routes */}
                    <Route path="/payments" element={<PaymentsCard />} />
                    <Route path="/payments-form" element={<PaymentsForm />} />

                    {/* Invoice & Profile */}
                    <Route path="/invoice-view/:id?" element={<InvoiceView />} />
                    <Route path="/profile/edit" element={<EditProfile />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Quotation Routes */}
                    <Route path="/quotation" element={<QuotationCard />} />
                    <Route path="/vehiclequotation" element={<VehicleQuotation />} />

                    {/* Updated Hotel Quotation Route */}
                    <Route path="/hotelquotation" element={<HotelQuotationMain />} />

                    <Route path="/flightquotation" element={<FlightQuotation />} />
                    <Route path="/quickquotation" element={<QuickQuotation />} />
                    <Route path="/fullquotation" element={<FullQuotation />} />
                    <Route path="/customquotation" element={<CustomQuotation />} />

                    {/* Finalize Routes */}
                    <Route path="/flightfinalize/:id" element={<FlightFinalize />} />
                    <Route path="/vehiclefinalize/:id" element={<VehicleFinalize />} />
                    <Route path="/hotelfinalize/:id" element={<HotelFinalize />} />

                    {/* Fallback route for 404 */}
                    <Route path="*" element={
                        <Container sx={{ textAlign: 'center', mt: 10 }}>
                            <Alert severity="error">
                                <AlertTitle>Page Not Found</AlertTitle>
                                The page you're looking for doesn't exist.
                            </Alert>
                        </Container>
                    } />
                </Routes>
            </Box>
        </DashboardLayout>
    );
};

export default MainRoute;