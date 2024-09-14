import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import React, { Component } from 'react';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PeopleIcon from '@material-ui/icons/People';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { withRouter } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import { dateFormater } from '../../../helpers/dateFormater';
import { toastAlert } from '../../../helpers/toastAlert';
import { editCabinDetails } from '../../../services/officeService';
import { connect } from 'react-redux';

class Cabins extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modal: false,
            capacity: "",
            price: "",
            preference: "",
            status: "",
            id: "",
            preferenceTypeData: [
                {
                    label: "Personal",
                    value: 1,
                },
                {
                    label: "Official",
                    value: 2
                },
                {
                    label: "Personal & Official Both",
                    value: 3
                }
            ],
            statusData : [
                {
                    label : "Available",
                    value : true
                },
                {
                    label : "Unavailable",
                    value : false
                }
            ],
            error : []
        }
    }

    closeModal = () => {
        this.setState({
            modal: false,
            error : []
        })
    }
    
    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }

    handleDropDownChange = (event, val, type) => {
        if(type === "preference") {
            this.setState({
                preference: val,
            });
        }else if(type === "status") {
            this.setState({
                status: val,
            });
        }
    }

    getStatus = (val) => {
        this.state?.statusData?.map((status) => {
            if(val === status.value) {
                this.setState({
                    status
                })
            }
        })
    }

    getPreference = (val) => {
        this.state?.preferenceTypeData?.map((preference) => {
            if(val === preference?.value) {
                this.setState({
                    preference 
                })
            }
        })
    }

    openModal = () => {
        let { data } = this.props;
        this.getStatus(data?.isAvailable);
        this.getPreference(data?.prefrences);
        this.setState({
            id : data?._id,
            capacity : data?.capacity,
            price : data?.price,
            modal : true
        })
    }

    validateUpdateCabinInfo = () => {
        let error = [];
        const {
            capacity,
            price,
            preference,
            status
        } = this.state;

        if(!capacity.toString().trim()) {
            error.push("capacityError");
        }
        if(parseInt(capacity) <= 0) {
            !error.includes("capacityError") && error.push("capacityInvalidError");
        }
        if(!price.toString().trim()) {
            error.push("priceError");
        }
        if(parseInt(price) <= 0) {
            !error.includes("priceError") && error.push("priceInvalidError");
        }
        if(!preference?.label?.trim() || !preference) {
            error.push("preferenceError");
        }
        if(!status?.label?.trim() || !status) {
            error.push("statusError");
        }
        if(error.length > 0) {
            this.setState({
                error,
            });
        }else {
            this.setState({
                error: [],
            });
            this.updateCabinInfo();
        }
    }

    updateCabinInfo = async() => {
        const {
            capacity,
            price,
            preference,
            status
        } = this.state;
        try {
            const formData = new FormData();
            formData.append('id', this.props?.data?._id);
            formData.append('price', parseInt(price));
            formData.append('capacity', parseInt(capacity));
            formData.append('prefrences', parseInt(preference?.value));
            formData.append('isAvailable', status?.value);
            
            let res = await editCabinDetails(formData, this.props);
            // passed formdata as payLoad to function
            
            if(res && res?.statusCode == 200) {
                toastAlert(
                    res?.message
                    ? res?.message
                    : "Cabin details updated successfully"
                    );
                    this.closeModal();
                    this?.props?.getOfficeData();
            }else {
                // error
                console.log("error updating cabin details : ", res, res.message);
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

    render() {
        const { data } = this.props;
        const {
            capacity,
            preferenceTypeData,
            status,
            price,
            preference,
            statusData,
            error,
            modal
        } = this.state;
        return (
            <div>
                <div className="content-header">
                    <div className="inner-card-title">
                        <Typography 
                            className='card-title'
                            variant='h5'
                        >
                            Cabin Details
                        </Typography>
                        <Button 
                            className='white-border-btn modal-title-btn'
                            onClick={() => this.openModal()}
                        >
                            Edit
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
                                    <MeetingRoomIcon className='details-icon'/> 
                                    ID (internal use) :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text vendor-detail-value'
                                variant='p'
                            >
                                {data?._id}
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
                                    <PeopleIcon className='details-icon'/>
                                    Capacity :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text'
                                variant='p'
                            >
                                {data?.capacity}
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
                                    Price :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text vendor-detail-value'
                                variant='p'
                            >
                                {data?.price}
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
                                    <LocalPhoneIcon className='details-icon'/>
                                    Preference :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text vendor-detail-value'
                                variant='p'
                            >
                                {
                                    data?.prefrences == 1 ? 
                                        "Personal" 
                                    : data?.prefrences == 2 ? 
                                        "Official" 
                                    : 
                                        "Both"
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
                                    <EqualizerIcon className='details-icon'/>
                                    Available Status :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text vendor-detail-value'
                                variant='p'
                            >
                                {data?.isAvailable ? "Available" : "Unavailable"}
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
                                    <EqualizerIcon className='details-icon'/>
                                    Last Updation :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text vendor-detail-value'
                                variant='p'
                            >
                                {
                                    (data?.updatedAt && data?.updatedAt?.trim()) ?
                                        `${dateFormater(data?.updatedAt.split("T")[0])},${data?.updatedAt.split("T")[1].split(".")[0]}`
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
                                    <EqualizerIcon className='details-icon'/>
                                    Created On :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text vendor-detail-value'
                                variant='p'
                            >
                                {
                                    (data?.createdAt && data?.createdAt?.trim()) ?
                                        `${dateFormater(data?.createdAt.split("T")[0])},${data?.createdAt.split("T")[1].split(".")[0]}`
                                    :
                                        "NA"
                                }
                            </Typography>
                        </div>
                        <span className='span-line'></span>
                    </div>
                </div>


                {/* Cabin Details-modal:: start */}
                <div>
                    <Modal
                        size='lg'
                        className='all-modals'
                        isOpen={modal}
                    >
                        <ModalHeader>
                            Edit Cabin Details
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={6} xs={12} sm={12} md={6}>
                                    <div>
                                        <p className='small-text'>
                                            Capacity :
                                        </p>
                                        <input
                                            className="input-main"
                                            type="number"
                                            placeholder="Capacity"
                                            name="capacity"
                                            value={capacity}
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                        {error?.includes("capacityError") &&
                                            <p className="error-message">
                                                Capacity is required
                                            </p>
                                        }
                                        {error?.includes("capacityInvalidError") &&
                                            <p className="error-message">
                                                Invalid capacity params!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={6} xs={12} sm={12} md={6}>
                                    <p className='small-text'>
                                        Price :
                                    </p>
                                    <input
                                        className="input-main"
                                        type="number"
                                        placeholder="Price"
                                        name="price"
                                        value={price}
                                        onChange={(e) => this.handleChange(e)}
                                    />
                                    {error.includes("priceError") &&
                                        <p className="error-message">
                                            Price is required
                                        </p>
                                    }
                                    {error.includes("priceInvalidError") &&
                                        <p className="error-message">
                                            Invalid price params!
                                        </p>
                                    }
                                </Grid>
                                
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Preference :
                                        </p>
                                        <Autocomplete
                                            id="country-select-demo"
                                            name="preference"
                                            value={preference}
                                            options={preferenceTypeData}
                                            autoHighlight
                                            onChange={(e, val) =>
                                                this.handleDropDownChange(e, val, "preference")
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
                                                    label="Preference type"
                                                    placeholder="Choose type"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-password", // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                        {error.includes("preferenceError") &&
                                            <p className="error-message">
                                                Preference is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Status :
                                        </p>
                                        <Autocomplete
                                            id="country-select-demo"
                                            name="status"
                                            value={status}
                                            options={statusData}
                                            autoHighlight
                                            onChange={(e, val) =>
                                                this.handleDropDownChange(e, val, "status")
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
                                                    label="Status"
                                                    placeholder="Choose status"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-password", // disable autocomplete and autofill
                                                    }}
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
                            <div className="update-btn">
                                <Button
                                    className='btn btn-colored small-text-white'
                                    onClick={() => this.validateUpdateCabinInfo()}
                                >
                                    Update
                                </Button>
                                <Button
                                    className='btn-border'
                                    onClick={() => this.closeModal()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </ModalFooter>
                    </Modal>
                </div>
                {/* Cabin Details-modal:: End */}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(Cabins))