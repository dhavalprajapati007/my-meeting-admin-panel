import { CircularProgress, Grid} from '@mui/material'
import React, { Component } from 'react';
import BookingInfo from '../BookingInfo/BookingInfo';
import PaymentDetailsCompo from '../PaymentDetailsCompo/PaymentDetailsCompo';
import UserDetailsCompo from '../UserDetailsCompo/UserDetailsCompo';
import OfficeInfo from '../../Offices/OfficeInfo/OfficeInfo';
import BookingCabinDetailsCompo from "../BookingCabinDetailsCompo/BookingCabinDetailsCompo";
import ParticipantsDetailsCompo from "../ParticipantsDetailsCompo/ParticipantsDetailsCompo";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BreadcrumbComp from '../../CommonComponents/Breadcrumb/Breadcrumb';
import { getBookingDetails } from '../../../services/bookingService';
import { toastAlert } from '../../../helpers/toastAlert';
import VendorInfo from '../VendorInfo/VendorInfo';

class BookingDetailsCompo extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            data: {}
        }
    }

    getBookingDetails = async () => {
        try {
            let bookingData = await getBookingDetails(
                { bookingId: this.props.match.params.id },
                this.props
            );

            if (bookingData && bookingData.statusCode == 200) {
                this.setState({
                    data: bookingData.data,
                    loading: false,
                })
            } else {
                // error
                console.log('error booking details : ', bookingData, bookingData.message);
                let message = bookingData && bookingData.message !== undefined ? bookingData.message : "Problem Fetching Records.";
                toastAlert(message, "error");
                this.setState({ loading: false });
            }
        } catch (error) {
            console.log('error catch block', error);
            toastAlert("Please check Internet Connection.", "error");
            this.setState({ loading: false });
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        this.getBookingDetails();
    }

    itemArray = () => {
        const { data } = this.state;
        let serviceType = data?.serviceType;
        return (
            [
                {
                    name: "All Bookings",
                    active: false,
                    link: "/booking"
                },
                {
                    name: `${serviceType === 1 ? "Physical Place" : serviceType === 2 ? "Physical Place With Service" : serviceType === 3 && "Virtual"} Booking Details Page`,
                    active: true,
                    link: ""
                }
            ]
        )
    }

    render() {
        const { loading, data } = this.state
        return (
            <div>
                {
                    loading ?
                        <CircularProgress 
                            style={{ color: "#5F5BA8" }} 
                            size={50} 
                        />
                    :
                        <Grid container spacing={2}>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                <BreadcrumbComp 
                                    items={this.itemArray()}
                                />
                            </Grid>
                            {/* User-details-section::start */}
                            {
                                data?.hasOwnProperty("bookingUser") &&
                                data?.bookingUser?.length > 0 &&
                                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ display: "flex" }} >
                                        <UserDetailsCompo 
                                            data={data}
                                        />
                                    </Grid>
                            }
                            {/* User-details-section::End */}
                            {/* Vendor-details-section::start */}
                            {
                                data?.hasOwnProperty("serviceType") &&
                                (data?.serviceType === 3 || data?.serviceType === 2) &&
                                data?.hasOwnProperty("serviceProvider") &&
                                data?.serviceProvider?.length > 0 &&
                                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ display: "flex" }} >
                                        <VendorInfo 
                                            data={data}
                                        />
                                    </Grid>
                            }
                            {/* Vendor-details-section::End */}
                            {/* booking-details-section::start */}
                            <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ display: "flex" }} >
                                <BookingInfo 
                                    data={data}
                                    getBookingDetails={this.getBookingDetails}
                                />
                            </Grid>
                            {/* booking-details-section::End */}
                            {/* Office-details::start */}
                            {
                                data?.hasOwnProperty("office") &&
                                data?.office?.length > 0 &&
                                    <Grid item lg={6} md={6} sm={12} xs={12} style={{ display: "flex" }} >
                                        <OfficeInfo
                                            data={data.office[0]}
                                        />
                                    </Grid>
                            }
                            {/* Office-details::start */}
                            {/* payment-details-section::start */}
                            {
                                data?.hasOwnProperty("paymentDetails") &&
                                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ display: "flex" }}>
                                        <PaymentDetailsCompo
                                            data={data}
                                            getBookingDetails={this.getBookingDetails}
                                        />
                                    </Grid>
                            }
                            {/* payment-details-section::End */}
                            {/* booking-cabin-details-section::start */}
                            {
                                data?.hasOwnProperty("serviceType") &&
                                (data?.serviceType === 1 || data?.serviceType === 2) &&
                                data?.hasOwnProperty("cabin") &&
                                data?.cabin?.length > 0 &&
                                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ display: "flex" }} >
                                        <BookingCabinDetailsCompo
                                            data={data}
                                        />
                                    </Grid>
                            }
                            {/* booking-cabin-details-section::End */}
                            {/* participants-details-section::start */}
                            {
                                data?.hasOwnProperty("serviceType") &&
                                (data?.serviceType === 1 || data?.serviceType === 2) &&
                                data?.hasOwnProperty("placeParticipants") &&
                                data?.placeParticipants?.length > 0 &&
                                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} style={{ display: "flex" }}>
                                        <ParticipantsDetailsCompo 
                                            data={data}
                                        />
                                    </Grid>
                            }
                            {/* participants-details-section::End */}
                        </Grid>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(BookingDetailsCompo))
