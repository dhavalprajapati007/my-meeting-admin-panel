import { Button, CircularProgress, Grid, TextField } from '@mui/material';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import BreadcrumbComp from '../../CommonComponents/Breadcrumb/Breadcrumb';
import { withRouter } from 'react-router-dom';
import { toggleModal } from '../../../services/languageService';
import { toastAlert } from '../../../helpers/toastAlert';
import Datatable from '../../CommonComponents/Datatable/Datatable';
import { connect } from 'react-redux';
import { Autocomplete } from '@mui/material';
import { Box } from "@mui/system";
import { getAllVerifiedVendors } from '../../../services/userService';
import { bookingPaymentHistoryData } from '../../../helpers/renderData';
import { bookingPaymentsHistory } from '../../../services/paymentService';

class BookingPaymentHistoryComp extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            modal: false,
            page : 1,
            rowsPerPage : 10,
            error: [],
            tableData: {},
            selectedStatus : [],
            options : [
                {
                    label: "Payment",
                    value: "payment"
                },
                {
                    label: "Refund",
                    value: "refund"
                }
            ],
            selectedVendor : {},
            vendorData : [],
            vendorName : "",
            paymentType : [],
            data : []
        }
    }

    componentDidMount() {
        this.setState({
            modal: true,
            loading: true
        },() => this.getAllVerifiedVendors())
    }

    getAllVerifiedVendors = async() => {
        try {
          let verifiedVendors = await getAllVerifiedVendors(this.props);
    
          if (verifiedVendors && verifiedVendors.statusCode == 200) {
            this.setState({
                vendorData : verifiedVendors.data,
                loading: false,
                modal : true
            })
          } else {
            // error
            console.log('error fetching vendors : ', verifiedVendors, verifiedVendors.message);
            let message = verifiedVendors && verifiedVendors.message !== undefined ? verifiedVendors.message : "Problem Fetching Records.";
            toastAlert(message, "error");
            this.setState({ loading: false });
          }
        } catch (error) {
          console.log('error catch block', error);
          toastAlert("Please check Internet Connection.", "error");
          this.setState({ loading: false });
        }
    }

    closeModal = () => {
        this.setState({
            modal : false,
            error : []
        })
    }

    handleSearch = () => {
        let error = [];
        const { selectedStatus, selectedVendor } = this.state;
        if(!selectedStatus || !selectedStatus.length) {
            error.push("statusError");
        }
        if(!selectedVendor || !selectedVendor.hasOwnProperty("_id")) {
            error.push("vendorError");
        }

        if(error.length > 0) {
            this.setState({
                error,
            });
        }else {
            this.setState({
                error: [],
                page : 1
            },() => this.getBookingPaymentHistory(this.state.page,this.state.rowsPerPage));
        }
    }

    changePage = (page,rowsPerPage) => {
        this.setState({
            loading: true,
            rowsPerPage
        },() => this.getBookingPaymentHistory(page,rowsPerPage));
    };

    handleDropDownChange = (e, val, type) => {
        if(type === "vendor") {
          this.setState({
            selectedVendor : val,
          })
        } else {
          this.setState({
            selectedStatus: val,
          })
        }
    }

    itemArray = () => {
        return (
            [
                {
                    name: "Payment History",
                    active: false,
                    link: ""
                },
                {
                    name: "Booking Payment History",
                    active: true,
                    link: ""
                }
            ]
        )
    }

    openModal = () => {
        this.setState({
            modal : true,
            error : [],
            selectedStatus : [],
            selectedVendor : {},
        })
    }

    getBookingPaymentHistory = async (page,rowsPerPage) => {
        try {
            let bookingPayments = await bookingPaymentsHistory({
                page: page,
                limit: rowsPerPage ? rowsPerPage : 10,
                status: this.state.selectedStatus.map((data) => data.value),
                vendorId : this.state.selectedVendor._id
            }, this.props);
            console.log('bookingPaymentsHistory ', bookingPayments);
            if (bookingPayments && bookingPayments.statusCode == 200) {
                this.setState({
                    count: bookingPayments?.data?.totalRecords[0]?.count,
                    page: page
                })
                let tableData = await bookingPaymentHistoryData(bookingPayments.data.data, this);
                this.setState({
                    data : bookingPayments.data.data,
                    tableData,
                    loading: false,
                    vendorName : this.state.selectedVendor,
                    paymentType : this.state.selectedStatus
                });
                this.closeModal();
            } else {
                // error
                console.log('error fetching Booking Payment history : ', bookingPayments, bookingPayments.message);
                let message = bookingPayments && bookingPayments.response.data.message !== undefined ? bookingPayments.response.data.message : "Problem Fetching Booking Payment History.";
                toastAlert(message, "error");
                this.closeModal();
                this.setState({
                    loading: false,
                    tableData : {},
                    vendorName : this.state.selectedVendor,
                    paymentType : this.state.selectedStatus
                });
            }
        } catch (error) {
            console.log('error catch block', error);
            toastAlert("Please check Internet Connection.", "error");
            this.setState({ 
                loading: false,
                vendorName : this.state.selectedVendor,
                paymentType : this.state.selectedStatus
            });
            this.closeModal();
        }
      }

    render() {
        const {
            error,
            data,
            tableData,
            modal,
            loading,
            selectedStatus,
            options,
            vendorData,
            selectedVendor,
            vendorName,
            paymentType
        } = this.state
        return (
            <div>
                {/* Breadcrumb component :: start  */}
                <BreadcrumbComp items={this.itemArray()} />
                {/* Breadcrumb component :: end  */}

                <Grid container style={{ marginTop: "30px" }} spacing={2}>
                    <Grid item lg={6} sm={6} md={6} xs={6} xl={6} style={{ textAlign : "start"}}>
                        <p>Vendor Name : {vendorName.firstName && vendorName.firstName} {vendorName.lastName && vendorName.lastName}</p>
                        <p>Payment type : {paymentType.map((data) => data.label).join(", ")}</p>
                    </Grid>
                    <Grid item lg={6} sm={6} md={6} xs={6} xl={6} style={{ textAlign : "end"}}> 
                        <Button 
                            className='btn btn-colored' 
                            onClick={() => this.openModal()}
                        >
                            Search By Vendor
                        </Button>
                    </Grid>
                </Grid>
                {/* Search Vendor wise booking payment history modal : start */}
                <div>
                    <Modal 
                        className='all-modals'
                        isOpen={modal}
                    >
                        <ModalHeader className='card-title'>
                            Search Booking Payment History By Vendor
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <Autocomplete
                                        name="selectedVendor"
                                        value={selectedVendor}
                                        options={vendorData}
                                        autoHighlight
                                        onChange={(e, val) => this.handleDropDownChange(e,val,"vendor")}
                                        getOptionLabel={(option) => `${option?.firstName ? option?.firstName : ""} ${option?.lastName ? option?.lastName : ""}`}
                                        renderOption={(props, option) => (
                                            <Box
                                                component="li"
                                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                                {...props}
                                                key={option?._id}
                                            >
                                                {option?.firstName ? option?.firstName : ""} {option?.lastName ? option?.lastName : ""} ({option.email ? option.email : ""})
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                className="country-dropdown"
                                                {...params}
                                                label="Vendor Name"
                                                placeholder="select vendor"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: "new-password", // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                    {error.includes("vendorError") &&
                                        <p className="error-message">
                                            Vendor is required!
                                        </p>
                                    }
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <div>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            value={selectedStatus}
                                            options={options}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(e, val) => this.handleDropDownChange(e, val,"status")}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Payment Status"
                                                    placeholder="Choose status"
                                                    className='small-text'
                                                />
                                            )}
                                        />
                                        {error.includes("statusError") &&
                                            <p className="error-message">
                                                Status is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                className='btn btn-colored small-text-white'
                                onClick={() => this.handleSearch()}
                            >
                                Search
                            </Button>
                            <Button 
                                className='btn btn-border small-text-color'
                                onClick={() => this.closeModal()}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
                {/* Search Vendor wise booking payment history modal : end */}
                <div className='data-table-main'>
                    <Grid container>
                        <Grid item lg={12} sm={12} md={12} xs={12}>
                            <div 
                                className="card-main" 
                                style={{ width: "100%" }}
                            >
                                {
                                    loading ?
                                        <CircularProgress 
                                            style={{ color: "#5F5BA8" }} 
                                            size={50} 
                                        />
                                    :                                        
                                        data.length ? <Datatable props={tableData} title={"Booking Payment History"} /> : null
                                }
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(BookingPaymentHistoryComp))