import { Typography } from '@mui/material';
import React, { Component } from 'react';
import ProfileImage from "../../../assets/images/profile.jpg";
import PersonIcon from '@mui/icons-material/Person';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

export default class VendorInfo extends Component {
    render() {
        const { data } = this.props
        return (
            <div 
                style={{ 
                    width: "100%",
                    display: "flex" 
                }}
            >
                <div className="card-main">
                    <div className="inner-card-title">
                        <Typography
                            className='card-title'
                            variant='h5'
                        >
                            Vendor Details
                        </Typography>
                    </div>
                    <div className="vendor-main">
                        <div className="avatar-main">
                            <img 
                                src={
                                    data?.serviceProvider?.length > 0 && data?.serviceProvider[0]?.avatar ? 
                                        data?.serviceProvider[0]?.avatar 
                                    : 
                                        ProfileImage
                                } 
                                alt="profileImage" 
                            />
                        </div>
                        <div className="details-main-section">
                            <div className="card-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography 
                                            card-details 
                                            className='small-text name-icon' 
                                            variant='p'
                                        >
                                            <PersonIcon className='details-icon'/>
                                            Name :
                                        </Typography>
                                    </div>
                                    <Typography
                                        className='small-text card-details'
                                        variant='p'
                                    >
                                        {data?.serviceProvider?.length > 0 && data?.serviceProvider[0]?.firstName} 
                                        {data?.serviceProvider?.length > 0 && data?.serviceProvider[0]?.lastName}
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            <div className="card-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography
                                            card-details
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <LocalPhoneIcon className='details-icon'/>
                                            Mobile :
                                        </Typography>
                                    </div>
                                    <Typography
                                        className='small-text card-details'
                                        variant='p'
                                    >
                                        {
                                            data?.serviceProvider?.length > 0 && data?.serviceProvider[0]?.mobile ? 
                                                data?.serviceProvider[0]?.mobile 
                                            : 
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            <div className="card-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography 
                                            card-details 
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <EmailIcon className='details-icon'/>
                                            Email :
                                        </Typography>
                                    </div>
                                    <Typography
                                        className='small-text card-details'
                                        variant='p'
                                    >
                                        {
                                            data?.serviceProvider?.length > 0 && data?.serviceProvider[0]?.email ?
                                                data?.serviceProvider[0]?.email 
                                            : 
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            <div className="card-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography 
                                            card-details 
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <MiscellaneousServicesIcon className='details-icon'/>
                                            Service name :
                                        </Typography>
                                    </div>
                                    <Typography
                                        className='small-text card-details'
                                        variant='p'
                                    >
                                        {
                                            data?.hasOwnProperty("service") && 
                                            data?.service?.length > 0 && 
                                            data?.service[0]?.hasOwnProperty("name") ?
                                                data?.service[0]?.name
                                            :
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Vendor_Details_card::End */}
            </div>
        )
    }
}
