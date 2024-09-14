import { Grid, Typography, Autocomplete, TextField } from '@mui/material';
import React, { Component } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { Button } from 'react-bootstrap';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Box } from "@mui/system";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { editBookingDetails } from '../../../services/bookingService';
import { toastAlert } from '../../../helpers/toastAlert';

class PaymentDetailsCompo extends Component {

    constructor() {
        super();
        this.state = {
            modal: false,
            error : [],
            totalAmount : "",
            serviceVendorAmount : "",
            placeVendorAmount : "",
            platformFee : "",
            transactionType : "",
            transactionTypeData: 
            [
                {
                    label: "Card",
                    value: "Card"
                },
                {
                    label: "Cash",
                    value: "Cash",
                }
            ],
        }
    }

    getTransactionType = (type) => new Promise((resolve, reject) => {
        if(type && type.trim()) {
            this.state?.transactionTypeData.map((data) => {
                if (data?.value?.toLowerCase() === type.toLowerCase()) {
                    this.setState({
                        transactionType : data
                    })
                }
            })
        } else {
            this.setState({
                transactionType : ""
            })
        }
        resolve()
    })

    openModal = () => {
        let data = this?.props?.data?.paymentDetails;
        this.getTransactionType(data?.transactionType).then(() => {
            this.setState({
                totalAmount : data?.totalAmount ? data?.totalAmount : "",
                serviceVendorAmount : data?.serviceVendorAmount ? data?.serviceVendorAmount : "",
                placeVendorAmount : data?.placeVendorAmount ? data?.placeVendorAmount : "",
                platformFee : data?.platformFee ? data?.platformFee : "",
                error : [],
                modal: true,
            })
        });
    }

    closeModal = () => {
        this.setState({
            error : [],
            modal: false,
        })
    }

    handleDropDownChange = (event, val) => {
        this.setState({
            transactionType : val,
        })
    }

    updatePaymentDetail = async () => {
        const {
            transactionType,
            totalAmount,
            serviceVendorAmount,
            placeVendorAmount,
            platformFee
        } = this.state
        let error = [];
        let serviceType = this?.props?.data?.serviceType;
        if (!transactionType?.label?.trim() || !transactionType) {
            error.push("transactionTypeError");
        }
        if (!totalAmount?.toString().trim()) {
            error.push("totalAmountError");
        }
        if (parseInt(totalAmount) <= 0) {
            !error.includes("totalAmountError") && error.push("totalAmountInvalidError");
        }
        if(serviceType === 2 || serviceType === 3) {
            if (!serviceVendorAmount?.toString().trim()) {
                error.push("serviceVendorAmountError");
            }
            if (parseInt(serviceVendorAmount?.toString()?.trim()) <= 0) {
                !error.includes("serviceVendorAmountError") && error.push("serviceVendorAmountInvalidError");
            }
        }
        if(serviceType === 2 || serviceType === 1) {
            if (!placeVendorAmount?.toString().trim()) {
                error.push("placeVendorAmountError");
            }
            if (parseInt(placeVendorAmount?.toString()?.trim()) <= 0) {
                !error.includes("placeVendorAmountError") && error.push("placeVendorAmountInvalidError");
            }
        }
        if (!platformFee?.toString().trim()) {
            error.push("platformFeeError");
        }
        if (parseInt(platformFee) <= 0) {
            !error.includes("platformFeeError") && error.push("platformFeeInvalidError");
        }
        if(error?.length > 0) {
            this.setState({
              error,
            });
        } else {
            this.setState({
              error: [],
            });
            try {
                let body = {};
                if(serviceType === 1) {
                    body = {
                        "_id" : this?.props?.data?._id,
                        "totalAmount" : totalAmount,
                        "placeVendorAmount" : placeVendorAmount,
                        "platformFee" : platformFee,
                        "transactionType" : transactionType?.value 
                    }
                } else if(serviceType === 2) {
                    body = {
                        "_id" : this?.props?.data?._id,
                        "totalAmount" : totalAmount,
                        "serviceVendorAmount" : serviceVendorAmount,
                        "placeVendorAmount" : placeVendorAmount,
                        "platformFee" : platformFee,
                        "transactionType" : transactionType?.value
                    }
                } else if(serviceType === 3) {
                    body = {
                        "_id" : this?.props?.data?._id,
                        "totalAmount" : totalAmount,
                        "serviceVendorAmount" : serviceVendorAmount,
                        "platformFee" : platformFee,
                        "transactionType" : transactionType?.value
                    }
                }
                let res = await editBookingDetails(body, this.props);
                // passed payload as props to function so it can passed payload from this props
        
                if (res && res?.statusCode == 200) {
                  toastAlert(
                    res?.message
                      ? res?.message
                      : "Payment details updated successfully"
                  );
                  this.closeModal();
                  this?.props?.getBookingDetails();
                } else {
                  // error
                  console.log("error updating payment details : ", res, res.message);
                  let message =
                    res && res.message !== undefined
                      ? res.message
                      : "Problem while updating Records.";
                  toastAlert(message, "error");
                  this.closeModal();
                }
            } catch (error) {
                console.log("error catch block", error);
                toastAlert("Please check Internet Connection.", "error");
                this.closeModal();
            }
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    render() {
        const { data } = this.props;
        const { 
            error,
            totalAmount,
            serviceVendorAmount,
            platformFee,
            transactionTypeData,
            transactionType,
            placeVendorAmount,
            modal
        } = this.state;
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
                                Payment Details
                            </Typography>
                            <Button
                                className='white-border-btn modal-title-btn'
                                onClick={() => this.openModal()}
                            >
                                Edit
                            </Button>
                            <Button
                                className="white-border-btn modal-title-btn"
                            >
                                <GetAppIcon />
                            </Button>
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
                                        <MonetizationOnIcon className='details-icon'/>
                                        Payment Ref Id:
                                    </Typography>
                                </div>
                                <Typography 
                                    className='small-text'
                                    variant='p'
                                >
                                    {
                                        data?.hasOwnProperty("paymentDetails") &&
                                        data?.paymentDetails?.hasOwnProperty("referenceId") &&
                                        data?.paymentDetails?.referenceId !== undefined ?
                                            `${data?.paymentDetails?.referenceId}`
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
                                        <MonetizationOnIcon className='details-icon'/>
                                        Transaction Type:
                                    </Typography>
                                </div>
                                <Typography 
                                    className='small-text'
                                    variant='p'
                                >
                                    {
                                        data?.hasOwnProperty("paymentDetails") &&
                                        data?.paymentDetails?.hasOwnProperty("transactionType") &&
                                        data?.paymentDetails?.transactionType !== undefined ?
                                            `${data?.paymentDetails?.transactionType}`
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
                                        <MonetizationOnIcon className='details-icon'/>
                                        Total Amount :
                                    </Typography>
                                </div>
                                <Typography
                                    className='small-text'
                                    variant='p'
                                >
                                    {
                                        data?.hasOwnProperty("paymentDetails") &&
                                        data?.paymentDetails?.hasOwnProperty("totalAmount") &&
                                        data?.paymentDetails?.totalAmount !== undefined ?
                                            `${data?.paymentDetails?.totalAmount}`
                                        :
                                            "NA"
                                    }
                                </Typography>
                            </div>
                            <span className='span-line'></span>
                        </div>
                        {
                            (data?.serviceType === 1 || data?.serviceType === 2) &&
                            <div className="card-details">
                                <div className="icon-and-details-main">
                                    <div className="icon-main">
                                        <Typography 
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <MonetizationOnIcon className='details-icon' />
                                            Place vendor amount :
                                        </Typography>
                                    </div>
                                    <Typography
                                        className='small-text'
                                        variant='p'
                                    >
                                        {
                                            data?.hasOwnProperty("paymentDetails") &&
                                            data?.paymentDetails?.hasOwnProperty("placeVendorAmount") &&
                                            data?.paymentDetails?.placeVendorAmount !== undefined ?
                                                `${data?.paymentDetails?.placeVendorAmount}`
                                            :
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                        }
                        {
                            (data?.serviceType === 2 || data?.serviceType === 3) &&
                            <div className="card-details">
                                <div className="icon-and-details-main">
                                    <div className="icon-main">
                                        <Typography
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <MonetizationOnIcon className='details-icon'/>
                                            Service vendor amount :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text' 
                                        variant='p'
                                    >
                                        {
                                            data?.hasOwnProperty("paymentDetails") &&
                                            data?.paymentDetails?.hasOwnProperty("serviceVendorAmount") &&
                                            data?.paymentDetails?.serviceVendorAmount !== undefined ?
                                                `${data?.paymentDetails?.serviceVendorAmount}`
                                            :
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                        }
                        <div className="card-details">
                            <div className="icon-and-details-main">
                                <div className="icon-main">
                                    <Typography
                                        className='small-text name-icon'
                                        variant='p'
                                    >
                                        <MonetizationOnIcon className='details-icon'/>
                                        Platform fee :
                                    </Typography>
                                </div>
                                <Typography 
                                    className='small-text'
                                    variant='p'
                                >
                                    {
                                        data?.hasOwnProperty("paymentDetails") &&
                                        data?.paymentDetails?.hasOwnProperty("platformFee") &&
                                        data?.paymentDetails?.platformFee !== undefined ?
                                            `${data?.paymentDetails?.platformFee}`
                                        :
                                            "NA"
                                    }
                                </Typography>
                            </div>
                            <span className='span-line'></span>
                        </div>
                    </div>
                </div>
                {/*  Payment-Details-card::End*/}

                {/* payment-details-edit-modal::start */}
                <div>
                    <Modal 
                        size='lg'
                        className='all-modals'
                        isOpen={modal}
                    >
                        <ModalHeader className='card-title'>
                            Edit Payment Details
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Transaction Type :
                                        </p>
                                        <Autocomplete
                                            id="country-select-demo"
                                            name="transactionType"
                                            value={transactionType}
                                            options={transactionTypeData}
                                            autoHighlight
                                            onChange={(e, val) =>
                                                this.handleDropDownChange(e, val)
                                            }
                                            getOptionLabel={(option) => option.label ? option.label : ""}
                                            renderOption={(props, option) => (
                                                <Box
                                                    component="li"
                                                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                                    {...props}
                                                >
                                                    {option.label}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    className="country-dropdown"
                                                    {...params}
                                                    label="Transaction type"
                                                    placeholder="Choose type"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-password", // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                        {error.includes("transactionTypeError") &&
                                            <p className="error-message">
                                                Transaction type is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                                    <div>
                                        <p className="small-text">
                                            Total Amount :
                                        </p>
                                        <input
                                            className="input-main"
                                            type="number"
                                            name="totalAmount"
                                            value={totalAmount}
                                            onChange={(e) => this.handleChange(e)}
                                            placeholder="Total amount"
                                        />
                                        {error?.includes("totalAmountError") &&
                                            <p className="error-message">
                                                Total amount is required
                                            </p>
                                        }
                                        {error.includes("totalAmountInvalidError") &&
                                            <p className="error-message">
                                                Total amount is invalid!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                {
                                    (data?.serviceType === 2 || data?.serviceType === 3) &&
                                    <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                                        <div>
                                            <p className="small-text">
                                                Service Vendor Amount :
                                            </p>
                                            <input
                                                className="input-main"
                                                type="number"
                                                name="serviceVendorAmount"
                                                value={serviceVendorAmount}
                                                onChange={(e) => this.handleChange(e)}
                                                placeholder="Service vendor amount"
                                            />
                                            {error?.includes("serviceVendorAmountError") &&
                                                <p className="error-message">
                                                    Service vendor amount is required
                                                </p>
                                            }
                                            {error.includes("serviceVendorAmountInvalidError") &&
                                                <p className="error-message">
                                                    Service vendor amount is invalid!
                                                </p>
                                            }
                                        </div>
                                    </Grid>
                                }
                                {
                                    (data?.serviceType === 1 || data?.serviceType === 2)  &&
                                    <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                                        <div>
                                            <p className="small-text">
                                                Place Vendor Amount :
                                            </p>
                                            <input
                                                className="input-main"
                                                type="number"
                                                name="placeVendorAmount"
                                                value={placeVendorAmount}
                                                onChange={(e) => this.handleChange(e)}
                                                placeholder="Place vendor amount"
                                            />
                                            {error?.includes("placeVendorAmountError") &&
                                                <p className="error-message">
                                                    Place vendor amount is required
                                                </p>
                                            }
                                            {error.includes("placeVendorAmountInvalidError") &&
                                                <p className="error-message">
                                                    Place vendor amount is invalid!
                                                </p>
                                            }
                                        </div>
                                    </Grid>
                                }   
                                <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                                    <div>
                                        <p className="small-text">
                                            Platform fee :
                                        </p>
                                        <input
                                            className="input-main"
                                            type="number"
                                            name="platformFee"
                                            value={platformFee}
                                            onChange={(e) => this.handleChange(e)}
                                            placeholder="Platform fee"
                                        />
                                        {error?.includes("platformFeeError") &&
                                            <p className="error-message">
                                                Platform fee is required
                                            </p>
                                        }
                                        {error.includes("platformFeeInvalidError") &&
                                            <p className="error-message">
                                                Platform fee is invalid!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className='btn-colored'
                                onClick={() => this.updatePaymentDetail()}
                            >
                                Update
                            </Button>
                            <Button
                                className='btn-border'
                                onClick={() => this.closeModal()}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
                {/* payment-details-edit-modal::end */}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(PaymentDetailsCompo))