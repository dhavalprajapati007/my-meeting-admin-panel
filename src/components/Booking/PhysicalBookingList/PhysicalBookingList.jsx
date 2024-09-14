import { Button, CircularProgress, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { physicalBookingsListData } from '../../../helpers/renderData';
import { toastAlert } from '../../../helpers/toastAlert';
import { getBookings } from '../../../services/bookingService';
import Datatable from '../../CommonComponents/Datatable/Datatable';
import "./style.css"
class PhysicalBookingList extends Component {
    constructor() {
        super();
        this.state = {
            tabValue: [],
            option: [
                {
                    label: "All Bookings",
                    value: "All"
                },
                {
                    label: "Completed Bookings",
                    value: "Completed"
                },
                {
                    label: "Cancelled Bookings",
                    value: "Cancelled"
                },
                {
                    label: "Upcoming Bookings",
                    value: "Upcoming"
                },
                {
                    label: "In-Progress Bookings",
                    value: "In-Progress"
                },
                {
                    label: "Unattended Bookings",
                    value: "Unattended"
                }
            ],
            loading: false,
            error: [],
            tableData: {},
            page: 1,
            rowsPerPage : 10,
            count: 1,
            selectedServiceType : [],
            serviceTypes : [
                {
                    label: "Physical Place",
                    value: 1
                },
                {
                    label: "Physical Place with Service",
                    value: 2
                },
                {
                    label: "Virtual",
                    value: 3
                }
            ]
        }
    }

    handleSubmit = () => {
        const { selectedServiceType, tabValue } = this.state;
        let error = [];
        if (!tabValue?.length || !tabValue) {
            error.push("bookingError")
        }
        if (!selectedServiceType.length || !selectedServiceType) {
            error.push("serviceError")
        }
        if (error.length > 0) {
            this.setState({
                error,
            });
        } else {
            this.setState({
                error: [],
                loading: true,
                page : 1
            }, () => this.getBookings(this.state.page,this.state.rowsPerPage));
        }
    }

    handleDropDownChange = (e, val, name) => {
        if(name === "booking") {
            if(val[val.length - 1]?.value === "All") {
                let onlyAllArr = val.filter((valData) => valData?.value === "All")
                this.setState({
                    tabValue: onlyAllArr,
                }, () => this.handleSubmit())
            } else {
                let exceptAllArr = val.filter((valData) => valData?.value !== "All")
                this.setState({
                    tabValue: exceptAllArr,
                }, () => this.handleSubmit())
            }
        }
        if(name === "service") {
            this.setState({
                selectedServiceType: val,
            }, () => this.handleSubmit())
        }
    }

    componentDidMount() {
        this.setState({
            tabValue: [{
                label: "All Bookings",
                value: "All"
            }],
            selectedServiceType : this.state.serviceTypes,
            loading: true
        })
        this.getBookings(this.state.page,this.state.rowsPerPage);
    }

    createPayload = () => {
        let arr = [];
        this.state.tabValue.map((val) => {
            if (val.value === "All") {
                arr = ["Completed", "Cancelled", "Upcoming", "In-Progress", "Unattended"]
            } else {
                arr.push(val.value)
            }
        })
        return arr
    }

    changePage = (page,rowsPerPage) => {
        this.setState({
            loading: true,
            rowsPerPage
        });
        this.getBookings(page,rowsPerPage)
    };

    getBookings = async (page,rowsPerPage) => {
        try {
            let bookings = await getBookings({
                page: page,
                limit: rowsPerPage ? rowsPerPage : 10,
                serviceStatus: this.createPayload(),
                serviceType: this.state.selectedServiceType?.map((data) => data.value)
            }, this.props);
            console.log('bookings ', bookings);
            if (bookings && bookings.statusCode == 200) {
                this.setState({
                    count: bookings.totalCount,
                    page: page
                })
                let tableData = await physicalBookingsListData(bookings.data, this);
                this.setState({
                    tableData,
                    loading: false,
                })
            } else {
                // error
                console.log('error fetching booking data : ', bookings, bookings.message);
                let message = bookings && bookings.message !== undefined ? bookings.message : "Problem Fetching Booking Records.";
                toastAlert(message, "error");
                this.setState({ loading: false });
            }
        } catch (error) {
            console.log('error catch block', error);
            toastAlert("Please check Internet Connection.", "error");
            this.setState({ loading: false });
        }
    }

    render() {
        const {
            tabValue,
            loading,
            option,
            error,
            tableData,
            selectedServiceType,
            serviceTypes
        } = this.state
        return (
            <div>
                <Grid container style={{ marginTop: "30px" }} spacing={2}>
                    <Grid item lg={6} xs={12} sm={6} md={6} xl={6}>
                        <div>
                            <Autocomplete
                                multiple
                                className='booking-auto'
                                id="tags-outlined"
                                value={tabValue}
                                options={option}
                                getOptionLabel={(option) => option.label}
                                onChange={(e, val) =>
                                    this.handleDropDownChange(e, val, "booking")
                                }
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Bookings Type"
                                        placeholder="Choose booking type"
                                        className='small-text'
                                    />
                                )}
                            />
                            {error.includes("bookingError") &&
                                <p className="error-message">
                                    Booking type is required!
                                </p>
                            }
                        </div>
                    </Grid>
                    <Grid item lg={6} xs={12} sm={6} md={6} xl={6}>
                        <div>
                            <Autocomplete
                                multiple
                                className='booking-auto'
                                id="tags-outlined"
                                value={selectedServiceType}
                                options={serviceTypes}
                                getOptionLabel={(option) => option.label}
                                onChange={(e, val) =>
                                    this.handleDropDownChange(e, val, "service")
                                }
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Service Type"
                                        placeholder="Choose service type"
                                        className='small-text'
                                    />
                                )}
                            />
                            {error.includes("serviceError") &&
                                <p className="error-message">
                                    Service type is required!
                                </p>
                            }
                        </div>
                    </Grid>
                    {/* <Grid item lg={2} xs={4} sm={2} md={2} xl={2}>
                        <Button 
                            style={{ 
                                width: "100%" 
                     
                            }}
                            className={"tab-btn small-text-color tab-color submit-btn-auto"} 
                            onClick={() => this.handleSubmit()}
                        >
                            Submit
                        </Button>
                    </Grid> */}
                </Grid>
                <Grid container spacing={2} className="data-table-main">
                    <Grid item lg={12} sm={12} md={12} xs={12}>
                        <div className="card-main">
                            {
                                loading ?
                                    <CircularProgress 
                                        style={{ color: "#5F5BA8" }}
                                        size={50}
                                    />
                                :
                                    <Datatable
                                        props={tableData}
                                        title={"Bookings"}
                                    />
                            }
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

export default withRouter(connect(mapStateToProps)(PhysicalBookingList))