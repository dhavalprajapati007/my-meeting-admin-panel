import { Typography, Grid } from '@mui/material';
import React, { Component } from 'react';
import PeopleIcon from '@material-ui/icons/People';
import BookingCabinSlider from "../BookingCabinSlider/BookingCabinSlider";
import { getAmenities } from '../../../services/amenityService';
import { toastAlert } from '../../../helpers/toastAlert';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class BookingCabinDetailsCompo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amenityData: [],
            amenities: []
        }
    }

    getAllAmenities = async () => {
        try {
            let amenities = await getAmenities(this.props);
            // passeD props to getAmenities function so it can redirect this props to clearCookie() function

            if (amenities && amenities?.statusCode == 200) {
                this.setState({
                    amenityData: amenities.data,
                    // loading: false
                },() => this.getAmenities())
            } else {
                // error
                console.log('error fetching languages : ', amenities, amenities.message);
                let message = amenities && amenities?.message !== undefined ? amenities.message : "Problem Fetching Records.";
                // toastAlert(message, "error");
            }
        } catch (error) {
            console.log('error catch block', error);
            toastAlert("Please check Internet Connection.", "error");
        }
    }

    getAmenities = () => {
        const { data } = this.props;
        let amenityArr = [];
        (data?.hasOwnProperty("cabin") && data?.cabin?.length > 0 && data?.cabin[0]?.hasOwnProperty("amenitieIds") &&
            data?.cabin[0]?.amenitieIds && data?.cabin[0]?.amenitieIds?.length > 0) &&
            data?.cabin[0]?.amenitieIds?.map((amenity) => {
                console.log(amenity, "AllAmenityInProps")
                this.state.amenityData?.map((data) => {
                    if (data?._id === amenity) {
                        amenityArr.push(data);
                    }
                });
            });
        this.setState({
            amenities: amenityArr,
        });
    }

    componentDidMount = () => {
        this.getAllAmenities();
    }

    render() {
        const { data, amenities } = this.props;
        return (
            <div className="card-main">
                <div className="content-header">
                    <div className="inner-card-title">
                        <Typography className='card-title' variant='h5'>
                            Cabin Details
                        </Typography>
                    </div>
                </div>
                <Grid container spacing={5}>
                    <Grid item lg={12} sm={12} md={12} xs={12}>
                        <div className="details-main-section">
                            <div className="card-details">
                                <div className="icon-and-details-main">
                                    <div className="icon-main">
                                        <Typography 
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <PeopleIcon className='details-icon' />
                                            Capacity :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text'
                                        variant='p'
                                    >
                                        {
                                            data?.hasOwnProperty("cabin") &&
                                            data?.cabin?.length > 0 &&
                                            data?.cabin[0]?.hasOwnProperty("capacity") &&
                                                (data?.cabin?.length > 0 && data?.cabin[0]?.capacity) ?
                                                    data?.cabin[0]?.capacity
                                                :
                                                    "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            <div className="card-details">
                                <div className="icon-and-details-main">
                                    <div className="icon-main">
                                        <Typography 
                                            className='small-text name-icon' 
                                            variant='p'
                                        >
                                            <PeopleIcon className='details-icon' />
                                            Preferences :
                                        </Typography>
                                    </div>
                                    <Typography className='small-text ' variant='p'>
                                        {
                                            data?.hasOwnProperty("cabin") &&
                                            data?.cabin?.length > 0 &&
                                            data?.cabin[0]?.hasOwnProperty("prefrences") &&
                                                (data?.cabin?.length > 0 && data?.cabin[0]?.prefrences) ?
                                                data?.cabin[0]?.prefrences
                                            :
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            {
                                amenities?.length > 0 && amenities?.map((amenity, idx) => (
                                    <div className="card-details">
                                        <div className="icon-and-details-main">
                                            <div className="icon-main">
                                                <Typography 
                                                    className='small-text name-icon' 
                                                    variant='p'
                                                >
                                                    <PeopleIcon className='details-icon' />
                                                    Amenities:
                                                </Typography>
                                            </div>
                                            <Typography className='small-text ' variant='p'>
                                                {amenity}
                                            </Typography>
                                        </div>
                                        <span className='span-line'></span>
                                    </div>
                                ))
                            }
                        </div>
                    </Grid>
                    {
                        data?.hasOwnProperty("cabin") &&
                        data?.cabin?.length > 0 &&
                        data?.cabin[0]?.hasOwnProperty("images") &&
                        data?.cabin[0]?.images?.length > 0 &&
                            <Grid item lg={12} sm={12} md={12} xs={12}>
                                <BookingCabinSlider 
                                    data={data?.cabin[0]?.images} 
                                />
                            </Grid>
                    }
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(BookingCabinDetailsCompo))
