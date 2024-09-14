import React, { Component } from 'react';
import "./style.css"
import Document from "../Document/Document";
import { Grid, CircularProgress, Typography } from '@mui/material';
import BreadcrumbComp from '../../CommonComponents/Breadcrumb/Breadcrumb';
import { getVendorDetails } from '../../../services/userService';
import { toastAlert } from '../../../helpers/toastAlert';
import { withRouter } from 'react-router-dom';
import PersonalInformation from '../PersonalInformation/PersonalInformation';
import TimeSlot from '../TimeSlot/TimeSlot';
import { connect } from 'react-redux';
import Time from "../../../assets/images/Time.png"
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';
import PaymentMethodSliderComp from '../PaymentMethodSlider/PaymentMethodSliderComp';


class VendorDetailsComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            editPersonalInfoModal: false,
            editVendorPersonalinfoModal: false,
            editTimeSlotsModal: false,
            timeSlots: [],
            editedTimeSlots: [],
            value: 0,
            editValue: 0,
            sessionTime: 0,
            intervalTime: 0,
            error: []
        }
    }

    getVendorData = async () => {
        try {
            var vendorData = await getVendorDetails({ userId: this.props.match.params.id }, this.props);

            if (vendorData && vendorData.statusCode == 200) {
                this.setState({
                    data: vendorData.data,
                    loading: false,
                })
            } else {
                // error
                console.log('error vendor details : ', vendorData, vendorData.message);
                let message = vendorData && vendorData.message !== undefined ? vendorData.message : "Problem Fetching Records.";
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
        this.getVendorData();
    }


    itemArray = () => {
        const { data } = this.state;
        const { location } = this.props;
        let stateData = location?.status?.label;
        return (
            [
                {
                    name: "Users",
                    active: false,
                    link: ""
                },
                {
                    name: "Vendors",
                    active: false,
                    link: ""
                },
                {
                    name: stateData === "Verified" ? "Verified Vendors" : "Pending Vendors",
                    active: false,
                    link: "/vendors"
                },
                {
                    name: data?.vendorDetails?.providerType === 1 ? "Place Vendors" :
                        data?.vendorDetails?.providerType === 2 ? "Service Vendors" :
                        data?.vendorDetails?.providerType === 3 && "Place & Service Vendors",
                    active: true,
                    link: ""
                }
            ]
        )
    }

    render() {
        const { data, loading } = this.state
        return (
            <div>
                <Grid container spacing={2}>

                    <Grid item lg={12} xl={12} md={12} sm={12} xs={12} style={{ display: "flex" }}>
                        <BreadcrumbComp items={this.itemArray()} />
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item lg={3} md={6} sm={6} xs={12}>
                            <div className="card-main">
                                <div className="dashboard-card-main">
                                    <div className="dashboard-card-icon">
                                        <CurrencyRupeeIcon 
                                            style={{ 
                                                fontSize: "40px", 
                                                color:"white" 
                                            }} 
                                        />
                                    </div>
                                    <div className="dashboard-card-content">
                                        <Typography
                                            variant="h3"
                                            className="sub-title-text"
                                        >
                                            Total Revenue
                                        </Typography>
                                        <h4>
                                            {
                                                data?.vendorDetails?.hasOwnProperty("balance") && data?.vendorDetails?.balance?.hasOwnProperty("totalRevenue") && data?.vendorDetails?.balance?.totalRevenue ?
                                                    data?.vendorDetails?.balance?.totalRevenue
                                                :
                                                    "0"
                                            }
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={3} md={6} sm={6} xs={12}>
                            <div className="card-main">
                                <div className="dashboard-card-main">
                                    <div className="dashboard-card-icon">
                                        <CreditScoreRoundedIcon 
                                            style={{
                                                fontSize: "40px",
                                                color:"white" 
                                            }}
                                        />
                                    </div>
                                    <div className="dashboard-card-content">
                                        <Typography
                                            variant="h3"
                                            className="sub-title-text"
                                        >
                                            Total Payout
                                        </Typography>
                                        <h4>
                                            {
                                                data?.vendorDetails?.hasOwnProperty("balance") && data?.vendorDetails?.balance?.hasOwnProperty("totalPayout") && data?.vendorDetails?.balance?.totalPayout ?
                                                    data?.vendorDetails?.balance?.totalPayout
                                                :
                                                    "0"
                                            }
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={3} md={6} sm={6} xs={12}>
                            <div className="card-main">
                                <div className="dashboard-card-main">
                                    <div className="dashboard-card-icon">
                                        <AccountBalanceWalletIcon 
                                            style={{ 
                                                fontSize: "40px",
                                                color:"white" 
                                            }}
                                        />
                                    </div>
                                    <div className="dashboard-card-content">
                                        <Typography
                                            variant="h3"
                                            className="sub-title-text"
                                        >
                                            Available Balance
                                        </Typography>
                                        <h4>
                                            {
                                                data?.vendorDetails?.hasOwnProperty("balance") && data?.vendorDetails?.balance?.hasOwnProperty("availableBalance") && data?.vendorDetails?.balance?.availableBalance ?
                                                    data?.vendorDetails?.balance?.availableBalance
                                                :
                                                    "0"
                                            }
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={3} md={6} sm={6} xs={12}>
                            <div className="card-main">
                                <div className="dashboard-card-main">
                                    <div className="dashboard-card-icon">
                                        <PaymentsIcon
                                            style={{ 
                                                fontSize: "40px",
                                                color:"white"
                                            }} 
                                        />
                                    </div>
                                    <div className="dashboard-card-content">
                                        <Typography
                                            variant="h3"
                                            className="sub-title-text"
                                        >
                                            Withdrawable Balance
                                        </Typography>
                                        <h4>
                                            {
                                                data?.vendorDetails?.hasOwnProperty("balance") && data?.vendorDetails?.balance?.hasOwnProperty("withdrawableBalance") && data?.vendorDetails?.balance?.withdrawableBalance ?
                                                    data?.vendorDetails?.balance?.withdrawableBalance
                                                :
                                                    "0"
                                            }
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                    <Grid item lg={6} xl={6} md={12} sm={12} xs={12} style={{ display: "flex" }}>
                        <div 
                            style={{
                                width: "100%",
                                display: "flex"
                            }}
                            className='personalInformation'
                        >
                            {/* Personal_Information_card::Start */}
                            <PersonalInformation
                                data={data}
                                getVendorData={this.getVendorData} 
                            />
                            {/* Personal_Information_card::End */}
                        </div>
                    </Grid>


                    {/* Payment_Method_Slider::Start */}
                    {
                        data?.vendorDetails?.hasOwnProperty("paymentMethods") && data?.vendorDetails?.paymentMethods?.length ?                
                            <Grid item lg={6} xl={6} md={12} sm={12} xs={12} style={{ display: "flex" }}>
                                <PaymentMethodSliderComp 
                                    paymentMethods={data?.vendorDetails?.paymentMethods}
                                />
                            </Grid>
                        : null
                    }
                    {/* Payment_Method_Slider::End */}

                    {/* Document_card::Start */}
                    <Grid item lg={6} xl={6} md={12} sm={12} xs={12} style={{ display: "flex" }}>
                        {
                            loading ?
                                <CircularProgress 
                                    style={{ color: "#5F5BA8" }}
                                    size={50} 
                                /> 
                            :
                                <Document 
                                    data={{
                                        id : data?._id,
                                        idProofDetails : data?.vendorDetails?.idProofDetails,
                                        certificates : data?.vendorService?.certificates 
                                    }}
                                    getVendorData={this.getVendorData} 
                                />
                        }
                    </Grid>
                    {/* Document_card::End */}

                    {/* Time_slot::Start */}
                    {
                        (data?.vendorDetails?.providerType === 2 || data?.vendorDetails?.providerType === 3) && 
                        (data?.vendorService?.prefrence === 1 || data?.vendorService?.prefrence === 3) ?
                            <Grid item lg={12} xl={12} md={12} sm={12} xs={12} style={{ display: "flex" }}>
                                <TimeSlot 
                                    data={data} 
                                    getVendorData={this.getVendorData} 
                                />
                            </Grid>
                        :
                            <Grid item lg={12} xl={12} md={12} sm={12} xs={12} style={{ display: "flex" }}>
                                <div
                                    className="card-main time-not-available"
                                >
                                    <div className='time-not-available-main'>
                                        <img 
                                            src={Time}
                                            alt="time-slot-image"
                                        />
                                    </div>
                                    <Typography
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: "10px",
                                        }}
                                        className="card-title"
                                        variant="h5"
                                    >
                                        Timeslots Not Available
                                    </Typography>
                                </div>
                            </Grid>
                    }
                    {/* Time_slot::End */}
                </Grid>
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(VendorDetailsComp))