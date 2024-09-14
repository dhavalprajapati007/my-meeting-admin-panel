import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { PrivateRoute } from "./components/Routing";
import PhysicalBooking from "./pages/Bookings/PhysicalBooking/PhysicalBooking";
import BookingDetailsCompo from "./components/Booking/BookingDetailsCompo/BookingDetailsCompo";
import Login from "./pages/Login/Login";
import VendorList from "./pages/Users/VendorList/VendorList";
import ClientList from "./pages/Users/ClientList/ClientList"
import VendorDetails from "./pages/Users/VendorDetails/VendorDetails"
import OfficesList from "./pages/Offices/OfficesList/OfficesList";
import OfficeDetails from "./pages/Offices/OfficeDetails/OfficeDetails";
import ServiceCategory from "./pages/ServiceCategory/ServiceCategory";
import Amenities from "./pages/Amenities/Amenities";
import Languages from "./pages/Languages/Languages";
import Dashboard from "./pages/Dashboard/Dashboard";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import WithdrawalRequestHistory from "./pages/Payments/WithdrawalRequestHistory";
import BookingPaymentHistory from "./pages/Payments/BookingPaymentHistory";
import Mail from "./pages/Mail/Mail";
import Notification from "./pages/Notification/Notification";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/resetpassword" component={ResetPassword} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/booking" component={PhysicalBooking} />
        <PrivateRoute exact path="/allbooking/:id/:id" component={BookingDetailsCompo} />
        <PrivateRoute exact path="/vendors" component={VendorList} />
        <PrivateRoute exact path="/clients" component={ClientList} />
        <PrivateRoute exact path="/withdrawalRequestHistory" component={WithdrawalRequestHistory} />
        <PrivateRoute exact path="/BookingPaymentHistory" component={BookingPaymentHistory} />
        <PrivateRoute exact path="/vendors/:id" component={VendorDetails} />
        <PrivateRoute exact path="/offices" component={OfficesList} />
        <PrivateRoute exact path="/offices/:id" component={OfficeDetails} />
        <PrivateRoute exact path="/servicecategory" component={ServiceCategory} />
        <PrivateRoute exact path="/amenities" component={Amenities} />
        <PrivateRoute exact path="/languages" component={Languages} />
        <PrivateRoute exact path="/mail" component={Mail} />
        <PrivateRoute exact path="/pushNotification" component={Notification} />
      </Switch>
    </Router>
  );
}
export default Routes;