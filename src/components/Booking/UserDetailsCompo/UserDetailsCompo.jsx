import { Typography } from '@mui/material';
import React, { Component } from 'react';
import UserImage from "../../../assets/images/user.jpg";
import PersonIcon from '@mui/icons-material/Person';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';

export default class UserDetailsCompo extends Component {
    render() {
        const { data } = this.props
        return (
            <div 
                style={{ 
                    width: "100%",
                    display: "flex"
                }}
            >
                {/* User_Details_card::Start */}
                <div className="card-main">
                    <div className="inner-card-title">
                        <Typography
                            className='card-title'
                            variant='h5'
                        >
                            User Details
                        </Typography>
                    </div>
                    <div>
                        <div className="avatar-main">
                            <img 
                                src={
                                        data?.bookingUser?.length > 0 && data?.bookingUser[0]?.avatar ? 
                                            data?.bookingUser[0]?.avatar 
                                        : 
                                            UserImage
                                    } 
                                alt="userImage" 
                            />
                        </div>
                        <div className="details-main-section">
                            <div className="card-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography 
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <PersonIcon className='details-icon' /> 
                                            Name :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text'
                                        variant='p'
                                    >
                                        {
                                            data?.bookingUser?.length > 0 && data?.bookingUser[0]?.firstName} {data?.bookingUser?.length > 0 && data?.bookingUser[0]?.lastName
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            <div className="card-details">
                                <div className='icon-and-details-main'>
                                    <div className="icon-main">
                                        <Typography 
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <LocalPhoneIcon className='details-icon' />
                                            Mobile :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text'
                                        variant='p'
                                    >
                                        {
                                            data?.bookingUser?.length > 0 && data?.bookingUser[0]?.mobile ? 
                                                data?.bookingUser[0]?.mobile 
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
                                            style={{ 
                                                display: "flex",
                                                alignItems: "center" 
                                            }} 
                                            className='small-text name-icon' 
                                            variant='p'
                                        >
                                            <EmailIcon className='details-icon'/>
                                            Email :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text'
                                        variant='p'
                                    >
                                        {   
                                            data?.bookingUser?.length > 0 && data?.bookingUser[0]?.email ? 
                                                data?.bookingUser[0]?.email 
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
                {/* User_Details_card::End */}
            </div>
        )
    }
}
