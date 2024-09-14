import { Grid, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BarChartIcon from '@material-ui/icons/BarChart';
import PieChartIcon from '@material-ui/icons/PieChart';
import "./style.css"
import { getBookingData } from '../../../services/dashboardService';
import { toastAlert } from '../../../helpers/toastAlert';
import Chart from 'react-apexcharts';
import noData from "../../../assets/images/no-data.png"

class BookingData extends Component {
  constructor() {
    super();
    this.state = {
      bookingData: {},
      loading: false,
      graphType: "pie"
    }
  }

  getTotalBookingData = async () => {
    try {
      let bookingData = await getBookingData(this.props);
      if (bookingData && bookingData?.statusCode == 200) {
        this.setState({
          bookingData: bookingData?.data,
          loading: false
        })
      } else {
        // error
        console.log('error fetching booking data : ', bookingData, bookingData.message);
        let message = bookingData && bookingData?.message !== undefined ? bookingData.message : "Problem Fetching Records.";
        toastAlert(message, "error");
        this.setState({ loading: false })
      }
    } catch (error) {
      console.log('error catch block', error);
      toastAlert("Please check Internet Connection.", "error");
      this.setState({ loading: false })
    }
  }

  getSeriesData = () => {
    const { bookingData } = this.state;
    return ([
      bookingData?.hasOwnProperty("totalUpcomingBookings") && bookingData?.totalUpcomingBookings ?
        parseInt(bookingData?.totalUpcomingBookings) : 0,
      bookingData?.hasOwnProperty("totalCompletedBookings") && bookingData?.totalCompletedBookings ?
        parseInt(bookingData?.totalCompletedBookings) : 0,
      bookingData?.hasOwnProperty("totalInProgressBookings") && bookingData?.totalInProgressBookings ?
        parseInt(bookingData?.totalInProgressBookings) : 0,
      bookingData?.hasOwnProperty("totalCancelBookings") && bookingData?.totalCancelBookings ?
        parseInt(bookingData?.totalCancelBookings) : 0,
      bookingData?.hasOwnProperty("totalUnattendedBookings") && bookingData?.totalUnattendedBookings ?
        parseInt(bookingData?.totalUnattendedBookings) : 0
    ])
  }

  changeGraphType = (type) => {
    const { graphType } = this.state;
    if (graphType !== type) {
      this.setState({
        graphType: type
      })
    }
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    this.getTotalBookingData();
  }

  render() {
    const { bookingData, graphType } = this.state;

    let barChartForBookingData = {
      options: {
        chart: {
          id: 'apexchart-example'
        },
        theme: {
          monochrome: {
            enabled: false
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: "100%"
              },
              legend: {
                show: false
              }
            }
          }
        ],
        xaxis: {
          categories: ["Upcoming", "Completed", "InProgress", "Cancelled", "Unattended"],
          // colors: ['#FFC70E',"#55B67E","#00A6BF","#F76F72","#E88422"],
        },
        fill: {
          colors: ['#5F5BA8']
        }
      },
      series: [{
        name: 'Total Bookings',
        data: this.getSeriesData()
      }]
    }

    let pieChartForBookingData = {
      options: {
        labels: ["Upcoming", "Completed", "InProgress", "Cancelled", "Unattended"],
        colors: ['#FFC70E', "#55B67E", "#00A6BF", "#F76F72", "#E88422"],
        theme: {
          monochrome: {
            enabled: false
          }
        },
        legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center'
        },
        fill: {
          colors: ['#FFC70E', "#55B67E", "#00A6BF", "#F76F72", "#E88422"],
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: "100%"
              },
              legend: {
                show: false
              }
            }
          }
        ],
        chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => {
              console.log(config.w.config.labels[config.dataPointIndex]);
            }
          }
        }
      },
      series: this.getSeriesData()
    }

    return (
      <div>
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <div className="card-main">
              <div className="content-header">
                <Typography className="card-title" variant="h5">
                  Booking Data
                </Typography>
              </div>
              <div className="content-body-main">
                <div className="details-main-section">
                  <div className="card-details">
                    <div className="card-top-content-main">
                      <div className="card-content">
                        <h5>
                          Total Bookings:
                          {
                            bookingData?.hasOwnProperty("totalBookings") && bookingData?.totalBookings ?
                              bookingData?.totalBookings
                              :
                              "No Data Available"
                          }
                        </h5>
                      </div>
                      <div className="booking-data-card-top-icon">
                        <div className="booking-data-icon">
                          <BarChartIcon
                            onClick={() => this.changeGraphType("bar")}
                            style={{ fontSize: "30px" }}
                            className={(graphType === "bar" && "active-graph")}
                          />
                        </div>
                        <div className="booking-data-icon">
                          <PieChartIcon
                            onClick={() => this.changeGraphType("pie")}
                            style={{ fontSize: "30px" }}
                            className={(graphType === "pie" && "active-graph")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="booking-data-card-chart-main">
                      <Grid container spacing={1}>
                        <Grid item lg={4} md={6} sm={12} xs={12}>
                          <div className="all-booking-card-content">
                            <Grid container spacing={2}>
                              <Grid item lg={6} md={4} sm={2} xs={4}>
                                <div className="chart-content-details">
                                  <div className="booking-total-number book upcoming">
                                    <div className='booking-total-content'>
                                      <p className='small-text-white'>
                                        {
                                          bookingData?.hasOwnProperty("totalUpcomingBookings") && bookingData?.totalUpcomingBookings ?
                                            bookingData?.totalUpcomingBookings
                                            :
                                            0
                                        }
                                      </p>
                                      <p className='small-text-white'>
                                        Upcoming
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Grid>
                              <Grid item lg={6} md={4} sm={2} xs={4}>
                                <div className="chart-content-details">
                                  <div className="booking-total-number book completed">
                                    <div className='booking-total-content'>
                                      <p className='small-text-white'>
                                        {
                                          bookingData?.hasOwnProperty("totalCompletedBookings") && bookingData?.totalCompletedBookings ?
                                            bookingData?.totalCompletedBookings
                                            :
                                            0
                                        }
                                      </p>
                                      <p className='small-text-white'>
                                        Completed
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Grid>
                              <Grid item lg={6} md={4} sm={2} xs={4}>
                                <div className="chart-content-details">
                                  <div className="booking-total-number book inprocess">
                                    <div className='booking-total-content'>
                                      <p className='small-text-white'>
                                        {
                                          bookingData?.hasOwnProperty("totalInProgressBookings") && bookingData?.totalInProgressBookings ?
                                            bookingData?.totalInProgressBookings
                                            :
                                            0
                                        }
                                      </p>
                                      <p className='small-text-white'>
                                        In-Progress
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Grid>
                              <Grid item lg={6} md={4} sm={2} xs={4}>
                                <div className="chart-content-details">
                                  <div className="booking-total-number book cancel">
                                    <div className='booking-total-content'>
                                      <p className='small-text-white'>
                                        {
                                          bookingData?.hasOwnProperty("totalCancelBookings") && bookingData?.totalCancelBookings ?
                                            bookingData?.totalCancelBookings
                                            :
                                            0
                                        }
                                      </p>
                                      <p className='small-text-white'>
                                        Cancelled
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Grid>
                              <Grid item lg={6} md={4} sm={2} xs={4}>
                                <div className="chart-content-details">
                                  <div className="booking-total-number book unattended">
                                    <div className='booking-total-content'>
                                      <p className='small-text-white'>
                                        {
                                          bookingData?.hasOwnProperty("totalUnattendedBookings") && bookingData?.totalUnattendedBookings ?
                                            bookingData?.totalUnattendedBookings
                                            :
                                            0
                                        }
                                      </p>
                                      <p className='small-text-white'>
                                        Unattended
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                        </Grid>
                        <Grid item lg={8} md={6} sm={12} xs={12}>
                          <div className="apex-chart-main">
                            <p className='small-text'>
                              {
                                graphType === "bar" &&
                                (
                                  barChartForBookingData?.series?.every((val) => val === 0) ?
                                    <div className='no-data-found-image'>
                                      <img 
                                        src={noData}
                                        alt="No data found"
                                      />
                                      <p className='small-text-gray'>
                                        No data found
                                      </p>
                                    </div>
                                  :
                                    <Chart
                                      options={barChartForBookingData?.options}
                                      series={barChartForBookingData?.series}
                                      type="bar"
                                      width={500}
                                      height={320}
                                    />
                                )
                              }
                              {
                                graphType === "pie" &&
                                (
                                  pieChartForBookingData?.series?.every((val) => val === 0) ?
                                    <div className='no-data-found-image'>
                                      <img
                                        src={noData}
                                        alt="No data found"
                                      />
                                      <p className='small-text-gray'>
                                        No data found
                                      </p>
                                    </div>
                                  :
                                    <Chart
                                      options={pieChartForBookingData?.options}
                                      series={pieChartForBookingData?.series}
                                      type="pie"
                                      width={500}
                                      height={320}
                                    />
                                )
                              }
                            </p>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(BookingData))