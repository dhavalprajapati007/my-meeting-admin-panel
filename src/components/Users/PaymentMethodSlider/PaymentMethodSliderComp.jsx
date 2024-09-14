import { Typography, Grid } from '@mui/material';
import React, { Component } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import DialpadIcon from '@mui/icons-material/Dialpad';
import BadgeIcon from '@mui/icons-material/Badge';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class PaymentMethodSliderComp extends Component {
    render() {
        let settings = {
            dots: true,
            arrows: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };
        const { paymentMethods } = this.props;
        return (
            <div className="card-main">
                <div className="content-header">
                    <div className="inner-card-title">
                        <Typography className='card-title' variant='h5'>
                            Payment Method Details
                        </Typography>
                    </div>
                </div>
                <Grid container spacing={5}>
                    <Grid item lg={12} sm={12} md={12} xs={12}>
                        <Slider {...settings} >
                            {
                              paymentMethods?.map((method) => (
                                <div className="details-main-section">
                                    <div className="card-details">
                                        <div className="icon-and-details-main">
                                            <div className="icon-main">
                                                <Typography 
                                                    className='small-text name-icon'
                                                    variant='p'
                                                >
                                                    <AdminPanelSettingsIcon className='details-icon' />
                                                    Type :
                                                </Typography>
                                            </div>
                                            <Typography 
                                                className='small-text'
                                                variant='p'
                                            >
                                                {method?.type === "upi" ? "UPI" : "Bank"}
                                            </Typography>
                                        </div>  
                                        <span className='span-line'></span>
                                    </div>
                                    {
                                        method?.type === "upi" ?
                                            <div className="card-details">
                                                <div className="icon-and-details-main">
                                                    <div className="icon-main">
                                                        <Typography 
                                                            className='small-text name-icon'
                                                            variant='p'
                                                        >
                                                            <ScreenshotIcon className='details-icon' />
                                                            UPI ID :
                                                        </Typography>
                                                    </div>
                                                    <Typography 
                                                        className='small-text'
                                                        variant='p'
                                                    >
                                                        {method?.upiId}
                                                    </Typography>
                                                </div>
                                                <span className='span-line'></span>
                                            </div>
                                        :
                                            <>
                                                <div className="card-details">
                                                    <div className="icon-and-details-main">
                                                        <div className="icon-main">
                                                            <Typography 
                                                                className='small-text name-icon'
                                                                variant='p'
                                                            >
                                                                <AccountBalanceIcon className='details-icon' />
                                                                Bank Name :
                                                            </Typography>
                                                        </div>
                                                        <Typography 
                                                            className='small-text'
                                                            variant='p'
                                                        >
                                                            {method?.bankName}
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
                                                                <AccountCircleIcon className='details-icon' />
                                                                Holder Name :
                                                            </Typography>
                                                        </div>
                                                        <Typography 
                                                            className='small-text'
                                                            variant='p'
                                                        >
                                                            {method?.holderName}
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
                                                                <DialpadIcon className='details-icon' />
                                                                A/C No. :
                                                            </Typography>
                                                        </div>
                                                        <Typography 
                                                            className='small-text'
                                                            variant='p'
                                                        >
                                                            {method?.acNumber}
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
                                                                <BadgeIcon className='details-icon' />
                                                                A/C Type :
                                                            </Typography>
                                                        </div>
                                                        <Typography 
                                                            className='small-text'
                                                            variant='p'
                                                        >
                                                            {method?.accountType}
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
                                                                <ClosedCaptionIcon className='details-icon' />
                                                                IFSC Code :
                                                            </Typography>
                                                        </div>
                                                        <Typography 
                                                            className='small-text'
                                                            variant='p'
                                                        >
                                                            {method?.ifscCode}
                                                        </Typography>
                                                    </div>
                                                    <span className='span-line'></span>
                                                </div>
                                            </>
                                    }
                                </div>
                              ))  
                            }
                        </Slider>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(PaymentMethodSliderComp));