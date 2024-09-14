import { Grid, Typography } from '@material-ui/core'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import "./style.css";
import { getOfficeAndCabinData, getUsersAndVendorsData } from '../../../services/dashboardService';
import { toastAlert } from '../../../helpers/toastAlert';
import { CircularProgress } from '@mui/material';

class TotalDatainfo extends Component {
  constructor() {
    super();
    this.state = {
      officeData : {},
      usersData : {},
      loading : false
    }
  }

  getOfficeAndCabinTotal = async () => {
    try {
        let officeData = await getOfficeAndCabinData(this.props);
        if (officeData && officeData?.statusCode == 200) {
            this.setState({
                officeData : officeData?.data
            })
        } else {
            // error
            console.log('error fetching office data : ', officeData, officeData.message);
            let message = officeData && officeData?.message !== undefined ? officeData?.message : "Problem Fetching Records.";
            toastAlert(message, "error");
        }
    } catch (error) {
        console.log('error catch block', error);
        toastAlert("Please check Internet Connection.", "error");
    }
  }

  getUsersAndVendorsTotal = async () => {
    try {
        let usersData = await getUsersAndVendorsData(this.props);
        if (usersData && usersData?.statusCode == 200) {
            this.setState({
                usersData : usersData?.data
            })
        } else {
            // error
            console.log('error fetching users data : ', usersData, usersData.message);
            let message = usersData && usersData?.message !== undefined ? usersData.message : "Problem Fetching Records.";
            toastAlert(message, "error");
        }
    } catch (error) {
        console.log('error catch block', error);
        toastAlert("Please check Internet Connection.", "error");
    }
  }


  componentDidMount() {
    this.setState({
        loading: true
    })

    let promises = [];

    promises.push(this.getOfficeAndCabinTotal());
    promises.push(this.getUsersAndVendorsTotal());

    Promise.all(promises).then((res) => {
        console.log("set the loader to false");
        this.setState({ loading: false })
    }).catch(err => {
        this.setState({ loading: false })
        console.log(err,"err")
    })
  }

  render() {
    const { loading, officeData, usersData } = this.state;
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
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <div className="card-main">
                <div className="dashboard-card-main">
                  <div className="dashboard-card-icon">
                    <FileCopyIcon 
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
                      Total Offices
                    </Typography>
                    <h4>
                      {
                        officeData?.hasOwnProperty("totalOffices") && officeData?.totalOffices ?
                          officeData?.totalOffices
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
                    <MeetingRoomIcon 
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
                      Total Cabins
                    </Typography>
                      <h4>
                        {
                          officeData?.hasOwnProperty("totalCabins") && officeData?.totalCabins ?
                            officeData?.totalCabins
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
                    <PersonAddIcon 
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
                      Total Users
                    </Typography>
                    <h4>
                      {
                        usersData?.hasOwnProperty("totalUsers") && usersData?.totalUsers ?
                          usersData?.totalUsers
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
                    <AccessibilityNewIcon 
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
                      Total Vendors
                    </Typography>
                    <h4>
                      {
                        usersData?.hasOwnProperty("totalVendors") && usersData?.totalVendors ?
                          usersData?.totalVendors
                        :
                          "0"
                      }
                    </h4>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(TotalDatainfo))