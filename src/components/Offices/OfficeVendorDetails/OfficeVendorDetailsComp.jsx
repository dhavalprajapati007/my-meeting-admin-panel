import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import ProfileImage from "../../../assets/images/profile.jpg";

class OfficeVendorDetailsComp extends Component {
  render() {
    const { data } = this.props;
    return (
      <div 
        className="card-main"
        style={{ width: "100%" }}
      >
        <div className="booking-content-title">
          <div className="vendor-title title-main">
            <div
              className="inner-card-title"
            >
              <Typography
                className='card-title'
                variant='h5'
              >
                Vendor Details
              </Typography>
            </div>
          </div>
        </div>
        <div className="vendor-main">
          <div className="avatar-main">
            <img 
              src={
                    data?.vendor?.avatar ? 
                      data?.vendor?.avatar 
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
                    className='small-text name-icon'
                    variant='p'
                  >
                    <PersonIcon className='details-icon'/>
                    Name :
                  </Typography>
                </div>
                <Typography
                  className='small-text vendor-detail-value'
                  variant='p'
                >
                  {
                    data?.vendor?.firstName && data?.vendor?.lastName ? 
                      data?.vendor?.firstName + " " + data?.vendor?.lastName 
                    : 
                      "N/A"
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
                    <LocalPhoneIcon className='details-icon'/>
                    Mobile :
                  </Typography>
                </div>
                <Typography
                  className='small-text vendor-detail-value'
                  variant='p'
                >
                  {
                    data?.vendor?.mobile ? 
                      data?.vendor?.mobile 
                    : 
                      "N/A"
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
                    <EmailIcon className='details-icon' />
                    Email :
                  </Typography>
                </div>
                <Typography
                  className='small-text vendor-detail-value'
                  variant='p'
                >
                  {
                    data?.vendor?.email ?
                      data?.vendor?.email 
                    : 
                      "N/A"
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
                    <BusinessIcon className='details-icon' />
                    Total Offices :
                  </Typography>
                </div>
                <Typography
                  className='small-text vendor-detail-value'
                  variant='p'
                >
                  N/A
                </Typography>
              </div>
              <span className='span-line'></span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(OfficeVendorDetailsComp)