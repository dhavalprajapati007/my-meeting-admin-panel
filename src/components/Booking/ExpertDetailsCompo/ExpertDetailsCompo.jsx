import { Typography } from '@mui/material';
import React, { Component } from 'react';
import ProfileImage from "../../../assets/images/profile.jpg";
import PersonIcon from '@mui/icons-material/Person';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
export default class ExpertDetailsCompo extends Component {
    render() {
        return (
            <div style={{ width: "100%", display: "flex" }}>
                {/* Expert_details_card::Start */}
                <div className="card-main" style={{ marginTop: "10px", padding: "20px", width: "100%" }}>
                    <div className="booking-content-title">
                        <div className="vendor-title title-main">
                            <Typography className='card-title' variant='h5'>Expert Details</Typography>
                        </div>
                    </div>
                    <div className="vendor-main">
                        <div className="vendor-image detail-image">
                            <img src={ProfileImage} alt="profileImage" />
                        </div>
                        <div className="vendor-details-main">
                            <div className="vendor-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography style={{ display: "flex", alignItems: "center" }} className='small-text icon-name' variant='p'><PersonIcon className='vendor-icon' /> Name :</Typography>
                                    </div>
                                    <Typography className='small-text vendor-detail-value' variant='p'>Dr Hiten Mehta</Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            <div className="vendor-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography style={{ display: "flex", alignItems: "center" }} className='small-text icon-name' variant='p'><LocalPhoneIcon className='vendor-icon' /> Mobile :</Typography>
                                    </div>
                                    <Typography className='small-text vendor-detail-value' variant='p'>8108399694</Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            <div className="vendor-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography style={{ display: "flex", alignItems: "center" }} className='small-text icon-name' variant='p'><EmailIcon className='vendor-icon' />Email :</Typography>
                                    </div>
                                    <Typography className='small-text vendor-detail-value' variant='p'>hitenmehta981@gmail.com</Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            <div className="vendor-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography style={{ display: "flex", alignItems: "center" }} className='small-text icon-name' variant='p'><MiscellaneousServicesIcon className='vendor-icon' />Service :</Typography>
                                    </div>
                                    <Typography className='small-text vendor-detail-value' variant='p'>
                                        abcd</Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            <div className="vendor-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography style={{ display: "flex", alignItems: "center" }} className='small-text icon-name' variant='p'><AccessAlarmIcon className='vendor-icon' />Date and Time:</Typography>
                                    </div>
                                    <Typography className='small-text vendor-detail-value' variant='p'>21st June,2022, 10:00 PM</Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>

                            <div className="vendor-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography style={{ display: "flex", alignItems: "center" }} className='small-text icon-name' variant='p'><VerifiedUserIcon className='vendor-icon' />Verification Code :</Typography>
                                    </div>
                                    <Typography className='small-text vendor-detail-value' variant='p'>
                                        #12346</Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Expert_details_card::End */}
            </div>
        )
    }
}
