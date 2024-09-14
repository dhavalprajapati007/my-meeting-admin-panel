import { CircularProgress, Grid, Typography } from '@material-ui/core';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toastAlert } from '../../../helpers/toastAlert';
import { getAllOfficeLocations } from '../../../services/dashboardService';
import MapContainer from '../../CommonComponents/Map/Map'

class DashboardMap extends Component {
    constructor(){
        super();
        this.state = {
            locations : [],
            loading : false
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        this.getOfficeLocations();
    }

    getOfficeLocations = async () => {
        try {
            let officeLocation = await getAllOfficeLocations(this.props);
            if (officeLocation && officeLocation?.statusCode == 200) {
                this.setState({
                    locations : officeLocation?.data,
                    loading : false
                })
            } else {
                // error
                console.log('error fetching booking data : ', officeLocation, officeLocation.message);
                let message = officeLocation && officeLocation?.message !== undefined ? officeLocation.message : "Problem Fetching Records.";
                toastAlert(message, "error");
                this.setState({ loading : false })
            }
        } catch (error) {
            console.log('error catch block', error);
            toastAlert("Please check Internet Connection.", "error");
            this.setState({ loading : false })
        }
    }

    render() {
        const { locations, loading } = this.state;
        console.log('locations : ', locations);
        return (
            <div>
                {
                    loading ?
                        <CircularProgress 
                            style={{ color: "#5F5BA8" }} 
                            size={50} 
                        />
                    :   
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
                                            All Office Locations
                                        </Typography>
                                    </div>
                                    <div 
                                        className="office-map" 
                                        style={{ marginTop: "20px" }}
                                    >
                                        <MapContainer
                                            location={locations}
                                            mapType={"dashboardMap"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Grid>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})
  
export default withRouter(connect(mapStateToProps)(DashboardMap))