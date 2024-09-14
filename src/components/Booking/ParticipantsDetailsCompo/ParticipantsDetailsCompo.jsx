import {Typography } from '@mui/material';
import React, { Component } from 'react';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CallIcon from '@material-ui/icons/Call';
import PersonIcon from '@mui/icons-material/Person';

export default class PaymentDetailsCompo extends Component {
    render() {
        const { data } = this.props
        return (
            <div 
                style={{ 
                    width: "100%",
                    display: "flex"
                }}
            >
                {/*  Payment-Details-card::start*/}
                <div className="card-main">
                    <div className="content-header">
                        <div
                            className="inner-card-title"
                        >
                            <Typography
                                className="card-title"
                                variant="h5"
                            >
                                Participants Details
                            </Typography>
                        </div>
                    </div>
                    <div className="details-main-section">
                        <div className="card-details">
                            <div className="icon-and-details-main">
                                <div className="icon-main">
                                    <Typography 
                                        className='small-text name-icon' 
                                        variant='p'
                                    >
                                        <PersonIcon className='details-icon' />
                                        Name:
                                    </Typography>
                                </div>
                                <Typography 
                                    className='small-text'
                                    variant='p'
                                >
                                    {
                                        data?.placeParticipants[0]?.userName ? 
                                            data?.placeParticipants[0]?.userName 
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
                                        <CallIcon className='details-icon'/> 
                                        Number :
                                    </Typography>
                                </div>
                                <Typography 
                                    className='small-text'
                                    variant='p'
                                >
                                    {
                                        data?.placeParticipants[0]?.contactNumber ? 
                                            data?.placeParticipants[0]?.contactNumber 
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
                                        <VerifiedUserIcon className='details-icon ' />
                                        Is registered :
                                    </Typography>
                                </div>
                                <Typography
                                    className='small-text'
                                    variant='p'
                                >
                                    {data?.placeParticipants[0]?.isRegistered ? "True" : "False"}
                                </Typography>
                            </div>
                            <span className='span-line'></span>
                        </div>
                        {
                            data?.placeParticipants[0]?.isRegistered &&
                            <div className="card-details">
                                <div className="icon-and-details-main">
                                    <div className="icon-main">
                                        <Typography
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <VerifiedUserIcon className='details-icon'/>
                                            UserId :
                                        </Typography>
                                    </div>
                                    <Typography
                                        className='small-text'
                                        variant='p'
                                    >
                                        {
                                            data?.placeParticipants[0]?.userId ? 
                                                data?.placeParticipants[0]?.userId 
                                            : 
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                        }
                    </div>
                </div>
                {/*  Payment-Details-card::End*/}
            </div>
        )
    }
}
