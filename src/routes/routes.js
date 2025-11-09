import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/auth/login";
import Dashboard from "../components/home/dashboard";
import Property from "../components/property/property";
import PrivateRoute from "./PrivateRoute";
import PropertyDetails from "../components/property/property_details";
import Seller from "../components/seller/seller";
import AllUsers from "../components/users/AllUsers";
import Notification from "../components/notification/notification";
import ReportUser from "../components/users/reportUser";
import ReportAd from "../components/property/reportAd";
import Countries from "../components/country/countries";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/property"
                    element={
                        <PrivateRoute>
                            <Property />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/property_details"
                    element={
                        <PrivateRoute>
                            <PropertyDetails />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/seller"
                    element={
                        <PrivateRoute>
                            <Seller />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/all_users"
                    element={
                        <PrivateRoute>
                            <AllUsers />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notification"
                    element={
                        <PrivateRoute>
                            <Notification />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/report_user"
                    element={
                        <PrivateRoute>
                            <ReportUser />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/report_ad"
                    element={
                        <PrivateRoute>
                            <ReportAd />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/countries"
                    element={
                        <PrivateRoute>
                            <Countries />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
