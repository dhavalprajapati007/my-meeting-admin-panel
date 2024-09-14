import { Grid, Typography, CircularProgress } from '@mui/material';
import React, { Component } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slidercompo from "../Slidercompo/Slidercompo";
import "./style.css"
import { getOfficeDetail } from '../../../services/officeService';
import { toastAlert } from '../../../helpers/toastAlert';
import { withRouter } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import ReviewSlider from '../ReviewSlider/ReviewSlider';
import OfficeVendorDetailsComp from '../OfficeVendorDetails/OfficeVendorDetailsComp';
import OfficeInfo from '../OfficeInfo/OfficeInfo';
import BreadcrumbComp from '../../CommonComponents/Breadcrumb/Breadcrumb';
import MapContainer from '../../CommonComponents/Map/Map'

class OfficeDetailsComp extends Component {
    constructor(props) {
        super(props);
        console.log('Props ======>>>>>', props);
        this.state = {
            data: [],
            loading: true,
            editOfficeModal: false,
            editCabinModal: false
        }
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal,
        })
    }

    getOfficeData = async () => {
        try {
            const { match } = this.props;
            console.log(match.params.id);
            var officeData = await getOfficeDetail(match.params.id, this.props);
            console.log('office Data', officeData);

            if (officeData && officeData.statusCode == 200) {
                this.setState({
                    data: officeData.data,
                    loading: false,
                })
            } else {
                // error
                console.log('error vendor details : ', officeData, officeData.message);
                let message = officeData && officeData.message !== undefined ? officeData.message : "Unexpected Problem Fetching Records.";
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
        this.getOfficeData();
    }

    itemArray = () => {
        let stateData = this?.props?.location?.thisEvt?.state;
        return (
            [
                {
                    name: "All Offices",
                    active: false,
                    link: "/offices"
                },
                {
                    name: `${stateData?.tabValue === "verified" ? "Verified" : "Pending"} Offices`,
                    active: false,
                    link: ""
                },
                {
                    name: `${stateData?.tabValue === "verified" ? "Verified" : "Pending"} Office Detail Page`,
                    active: true,
                    link: ""
                }
            ]
        )
    }

    render() {
        const { data, loading, modal } = this.state
        return (
            <div>
                <Grid container spacing={2}>
                    {
                        loading ?
                            <CircularProgress 
                                style={{ color: "#5F5BA8" }}
                                size={30}
                            />
                        :
                            <>
                                {/* vendor-details :: start */}
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <BreadcrumbComp items={this.itemArray()} />
                                </Grid>
                                <Grid
                                    item lg={6} md={6} sm={12} xs={12}
                                    style={{
                                        display: "flex"
                                    }}
                                >
                                    <OfficeVendorDetailsComp 
                                        data={data} 
                                    />
                                </Grid>
                                {/* vendor-details :: end */}

                                {/* review-slider::Start */}
                                {/* <Grid
                                    item lg={6} md={6} sm={12} xs={12}
                                    style={{ display: "flex" }}
                                >
                                    <ReviewSlider />
                                </Grid> */}
                                {/* review-slider::Start */}

                                {/* Office-details::start */}
                                <Grid item lg={6} md={6} sm={12} xs={12} style={{ display: "flex" }} >
                                    <OfficeInfo 
                                        data={data}
                                        getOfficeData={this.getOfficeData} 
                                        type={"officeDetail"} 
                                    />
                                </Grid>
                                {/* Office-details::start */}

                                {/* Office-map::start */}
                                <Grid 
                                    item lg={12} md={12} sm={12} xs={12} 
                                    style={{ display: "flex" }} 
                                    className="map-main-grid"
                                >
                                    <div className="card-main">
                                        <div className="content-header">
                                            <div className="inner-card-title">
                                                <Typography
                                                    className='card-title'
                                                    variant='h5'
                                                >
                                                    Office Map
                                                </Typography>
                                            </div>
                                            <div 
                                                className="office-map" 
                                                style={{ marginTop: "20px" }}
                                            >
                                                <MapContainer 
                                                    location={{
                                                        coordinates : data?.addressCordinater?.coordinates,
                                                        address : data?.address
                                                    }}
                                                    mapType={"officeMap"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>

                                {/* cabin-slider-section::start */}
                                <Grid item lg={12} md={12} xl={12} >
                                    <div className="card-main">
                                        <Slidercompo 
                                            data={data?.cabins}
                                            getOfficeData={this.getOfficeData}
                                        />
                                    </div>
                                </Grid>
                                {/* cabin-slider-section::End */}
                            </>
                    }
                </Grid>
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(OfficeDetailsComp))