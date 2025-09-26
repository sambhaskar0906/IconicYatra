import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Alert, AlertTitle, Container, Box, LinearProgress } from "@mui/material";
import Dashboard from "../Pages/Admin/Dashboard";
import DashboardLayout from "../Layout/DashboardLayout";
import LeadCard from "../Pages/Admin/Lead/LeadCard";
import LeadCreationFlow from "../Pages/Admin/Lead/Form/LeadTourForm";
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
import HotelQuotation from "../Pages/Admin/Quotation/HotelQuotation/hotelquotation";
import FlightQuotation from "../Pages/Admin/Quotation/FlightQuotation/flightquotation";
import QuickQuotation from "../Pages/Admin/Quotation/QuickQuotation/quickquotation";
import FullQuotation from "../Pages/Admin/Quotation/FullQuotation/fullquotation";
import CustomQuotation from "../Pages/Admin/Quotation/CustomQuotation/customquotation";
import FlightFinalize from "../Pages/Admin/Quotation/FlightQuotation/FlightFinalize";
import VehicleFinalize from "../Pages/Admin/Quotation/VehicleQuotation/VehicleFinalize";
import profile from "../Pages/Admin/Profile/Profile";
import Profile from "../Pages/Admin/Profile/Profile";

const MainRoute = () => {
    const location = useLocation();

    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [countdown, setCountdown] = useState(60); // 1 min remaining countdown
    const [showExpiryAlert, setShowExpiryAlert] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        const sessionStart = localStorage.getItem("sessionStart");

        // Session start time set if not present
        if (!sessionStart) {
            localStorage.setItem("sessionStart", Date.now());
        }

        // Check token existence
        if (!token || !user) {
            setIsAuthenticated(false);
            setIsAuthChecked(true);
            return;
        }

        setIsAuthenticated(true);
        setIsAuthChecked(true);

        const expiryTime = 10 * 60 * 60;
        const alertBefore = 60;

        const timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - Number(localStorage.getItem("sessionStart"))) / 1000);
            const remaining = expiryTime - elapsed;

            setCountdown(remaining);

            if (remaining === alertBefore) {
                setShowExpiryAlert(true);
            }

            if (remaining <= 0) {
                clearInterval(timer);
                localStorage.clear();
                setIsAuthenticated(false);
                setShowExpiryAlert(false);
                window.location.href = "http://localhost:5173/login";
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [location]);

    if (!isAuthChecked) return null;

    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;

    if (!isAuthenticated) {
        return (
            <Container
                sx={{
                    display: "flex",
                    height: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Alert severity="error" sx={{ width: "100%", maxWidth: 600, textAlign: "center", p: 3, fontSize: "1.1rem" }}>
                    <AlertTitle sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                        ⚠️ Session Expired
                    </AlertTitle>
                    Your session has expired. Redirecting to login page...
                </Alert>
            </Container>
        );
    }

    return (
        <DashboardLayout>
            {showExpiryAlert && (
                <Container sx={{ position: "fixed", top: 20, width: "100%", zIndex: 999 }}>
                    <Alert severity="warning" sx={{ maxWidth: 600, margin: "auto", borderRadius: 2 }}>
                        <AlertTitle sx={{ fontWeight: "bold" }}>⚠️ Token Expiry Alert</AlertTitle>
                        Your session will expire in <b>{countdown} seconds</b>. Please save your work.
                        <Box sx={{ mt: 1 }}>
                            <LinearProgress variant="determinate" value={(countdown / 60) * 100} />
                        </Box>
                    </Alert>
                </Container>
            )}

            <Routes>
                <Route path="/" element={<Dashboard user={userData} />} />
                <Route path="/lead" element={<LeadCard />} />
                <Route path="/lead/leadtourform" element={<LeadCreationFlow />} />
                <Route path="/lead/leadeditform" element={<LeadEditForm />} />
                <Route path="/hotel" element={<HotelCard />} />
                <Route path="/hotelform" element={<HotelForm />} />
                <Route path="/hotel/edit/:id" element={<HotelEditForm />} />
                <Route path="/tourpackage" element={<PackageCard />} />
                <Route path="/packageform" element={<MultiStepPackageForm />} />
                <Route path="/tourpackage/packageeditform/:id" element={<PackageEditForm />} />
                <Route path="/associates" element={<AssociatesCard />} />
                <Route path="/associatesform" element={<AssociatesForm />} />
                <Route path="/associates/associateseditform" element={<AssociatesEditFrom />} />
                <Route path="/staff" element={<StaffCard />} />
                <Route path="/staffform" element={<StaffForm />} />
                <Route path="/payments" element={<PaymentsCard />} />
                <Route path="/payments-form" element={<PaymentsForm />} />
                <Route path="/invoice-view" element={<InvoiceView />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/quotation" element={<QuotationCard />} />
                <Route path="/vehiclequotation" element={<VehicleQuotation />} />
                <Route path="/hotelquotation" element={<HotelQuotation />} />
                <Route path="/flightquotation" element={<FlightQuotation />} />
                <Route path="/quickquotation" element={<QuickQuotation />} />
                <Route path="/fullquotation" element={<FullQuotation />} />
                <Route path="/customquotation" element={<CustomQuotation />} />
                <Route path="/flightfinalize/:id" element={<FlightFinalize />} />
                <Route path="/vehiclefinalize/:id" element={<VehicleFinalize />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </DashboardLayout>
    );
};

export default MainRoute;
