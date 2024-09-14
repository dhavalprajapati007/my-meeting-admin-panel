import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import BookingData from '../BookingData/BookingData'
import TotalDatainfo from '../TotalDataInfo/TotalDatainfo';
import BreadcrumbComp from '../../CommonComponents/Breadcrumb/Breadcrumb';
import { Grid } from '@mui/material';
import DashboardMap from '../DashboardMap/DashboardMap';

class DashboardComp extends Component {

  itemArray = () => {
    return (
      [
        {
          name: "Dashboard",
          active: true,
          link: ""
        }
      ]
    )
  }

  render() {
    return (
      <div>
        <Grid container>
          {/* breadcrumb-section::start */}
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <BreadcrumbComp items={this.itemArray()} />
          </Grid>
          {/* breadcrumb-section::end */}

          {/* total-data-info-section::start */}
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <TotalDatainfo />
          </Grid>
          {/* total-data-info-section::end */}

          {/* booking-data-section::start */}
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <BookingData />
          </Grid>
          {/* booking-data-section::end */}

          {/* dashboard-map-section::start */}
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <DashboardMap />
          </Grid>
          {/* dashboard-map-section::end */}
        </Grid>

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(DashboardComp))