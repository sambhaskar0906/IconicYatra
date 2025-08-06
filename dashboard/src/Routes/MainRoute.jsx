import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../Pages/Admin/Dashboard';

import DashboardLayout from '../Layout/DashboardLayout';
import LeadCard from '../Pages/Admin/Lead/LeadCard';
import LeadForm from '../Pages/Admin/Lead/Form/LeadForm';
import LeadTourForm from "../Pages/Admin/Lead/Form/LeadTourForm";
import LeadCreationFlow from "../Pages/Admin/Lead/Form/LeadCreationFlow"
import LeadEditForm from '../Pages/Admin/Lead/Form/LeadEditForm'
import HotelCard from '../Pages/Admin/Hotel/HotelCard'
import HotelForm from '../Pages/Admin/Hotel/Form/HotelForm';
import HotelEditForm from '../Pages/Admin/Hotel/Form/HotelEditForm';
import PackageCard from '../Pages/Admin/TourPackage/PackageCard';
import PackageForm from '../Pages/Admin/TourPackage/Form/PackageForm';
import PackageEditForm from '../Pages/Admin/TourPackage/Form/PackagrEditForm';
import AssociatesCard from '../Pages/Admin/Associates/AssociatesCard';
import AssociatesForm from '../Pages/Admin/Associates/Form/AssociatesForm';
import AssociatesEditFrom from '../Pages/Admin/Associates/Form/AssociatesEditFrom';
import StaffCard from "../Pages/Admin/Staff/StaffCard";
import StaffForm from "../Pages/Admin/Staff/Form/StaffForm";
import PaymentsCard from '../Pages/Admin/Payments/PaymentsCard';
import PaymentsForm from '../Pages/Admin/Payments/Form/PaymentsForm';
import InvoiceView from '../Components/InvoiceView';
const MainRoute = () => {
    const isAuthenticated = true;

    return isAuthenticated ? (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />

                {/* Lead Routing */}
                <Route path="/lead" element={<LeadCard />} />
                <Route path="/lead/leadtourform" element={<LeadCreationFlow />} />
                <Route path="/lead/leadeditform" element={<LeadEditForm />} />

                {/*Hotel Routing */}
                <Route path='/hotel' element={<HotelCard />} />
                <Route path='/hotelform' element={<HotelForm />} />
                <Route path='/hotel/hoteleditform' element={<HotelEditForm />} />

                {/* Package Routing */}
                <Route path='/tourpackage' element={<PackageCard />} />
                <Route path='/packageform' element={<PackageForm />} />
                <Route path='/tourpackage/packageeditform' element={<PackageEditForm />} />


                {/* Associates Route */}
                <Route path='/associates' element={<AssociatesCard />} />
                <Route path='/associatesform' element={<AssociatesForm />} />
                <Route path='/associates/associateseditform' element={<AssociatesEditFrom />} />

                {/* Staff Routes */}
                <Route path="/staff" element={<StaffCard />} />
                <Route path="/staffform" element={<StaffForm />} />

                {/* Payments Routes */}
                <Route path="/payments" element={<PaymentsCard />} />
                <Route path="/payments-form" element={<PaymentsForm />} />

                {/* Invoice Routes */}
                <Route path="/invoice-view" element={<InvoiceView />} />


            </Routes>
        </DashboardLayout>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainRoute;
