import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Typography, TextField, Autocomplete } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import ContactsIcon from '@mui/icons-material/Contacts';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { Button } from 'reactstrap';
import { Box } from "@mui/system";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Country, State, City } from "country-state-city";
import { editOfficeDetails } from '../../../services/officeService';
import { toastAlert } from '../../../helpers/toastAlert';
import { connect } from 'react-redux';

let stateData;

class OfficeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            error: [],
            officeName: "",
            officeNumber: "",
            representativeName: "",
            representativeNumber: "",
            totalCabins: "",
            officeType: "",
            isVerified: "",
            totalCabins: "",
            addressLine1: "",
            addressLine2: "",
            state: "",
            pincode: "",
            city: "",
            editWorkingDays: [],
            cityDropDown: [],
            statusData: [
                {
                    label: "Verified",
                    value: true
                },
                {
                    label: "Pending",
                    value: false,
                }
            ],
            officeTypeData: [
                {
                    label: "Schedule",
                    value: "schedule",
                },
                {
                    label: "Express",
                    value: "express"
                },
                {
                    label: "Schedule & Express Both",
                    value: "both"
                }
            ],
            id : "",
            userId : ""
        }
    }

    getStatus = (value) => {
        this.state.statusData.map((data) => {
            if (data.value === value) {
                this.setState({
                    isVerified: data
                })
            }
        })
    }

    getOfficeType = (value) => {
        this.state.officeTypeData.map((data) => {
            if (data.value === value) {
                this.setState({
                    officeType: data
                })
            }
        })
    }

    getState = (state) => {
        stateData?.map((data) => {
            if(
                data?.name?.toLowerCase() === state?.toLowerCase() ||
                data?.isoCode?.toLowerCase() === state?.toLowerCase()
            ) {
                this.setState(
                    {
                        state: data,
                    },
                    () => this.getCity(this?.props?.data?.address?.city)
                );
            }
        });
    };

    getCity = (city) => {
        let cityData = City.getCitiesOfState("IN", this.state.state?.isoCode);
        this.setState({ cityDropDown : cityData })
        cityData.map((data) => {
            if(data?.name?.toLowerCase() === city.toLowerCase()) {
                this.setState({
                    city: data,
                },() => this.classify());
            }
        });
    };

    openModal = () => {
        const { data } = this.props;
        this.getStatus(data?.isKycCompleted)
        this.getOfficeType(data?.officeType)
        this.getState(data?.address?.state)
        this.setState({
            officeName: data?.name,
            officeNumber: data?.officeContactNumber,
            representativeName: data?.representativeDetails?.name,
            representativeNumber: data?.representativeDetails?.number,
            id : data?._id,
            userId : data?.userId,
            addressLine1: data?.address?.line1,
            addressLine2: data?.address?.line2,
            pincode: data?.address?.pincode,
            editWorkingDays: data?.workingDays,
            modal: true
        })
    }

    componentDidMount = () => {
        stateData = State.getStatesOfCountry("IN");
    }

    closeModal = () => {
        this.setState({
            modal: false
        })
    }

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }

    handleDropDownChange = (event, val, type) => {
        if(type === "status") {
            this.setState({
                isVerified: val,
            });
        }else if(type === "officeType") {
            this.setState({
                officeType: val,
            });
        }if(type === "state") {
            this.setState({
                state: val,
                city: null,
            },
            () => this.classify()
            );
        }else if(type === "city") {
            this.setState({
                city: val,
            });
        }
    }

    classify = () => {
        let cityDropDown = City.getCitiesOfState("IN", this.state.state?.isoCode);
        this.setState({ cityDropDown });
    };

    changeActiveStatus = (index) => {
        // 1. Make a shallow copy of the items
        let items = [...this.state.editWorkingDays];
        console.log(items,"copyOfArray")
        // 2. Make a shallow copy of the item you want to mutate
        let item = items[index];
        console.log(item,"singleElem")
        // 3. Replace the property you're intested in
        item = !item;
        console.log(item,"changedVal")
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        items[index] = item;
        console.log(items, "changedArr")
        // 5. Set the state to our new copy
        this.setState({
            editWorkingDays: items
        });
    }

    validateUpdateofficeDetails = () => {
        let error = [];
        const {
            officeName,
            representativeName,
            officeNumber,
            representativeNumber,
            isVerified,
            officeType,
            addressLine1,
            city,
            state,
            pincode
        } = this.state;
        if (!officeName?.trim()) {
            error.push("officeNameError");
        }
        if (!representativeName?.trim()) {
            error.push("representativeNameError");
        }
        if (!officeNumber?.toString()?.trim()) {
            error.push("officeNumberError");
        }
        if (parseInt(officeNumber) <= 0 || officeNumber?.toString()?.length !== 10) {
            !error.includes("officeNumberError") && error.push("officeNumberInvalidError");
        }
        if (!representativeNumber?.toString()?.trim()) {
            error.push("representativeNumberError");
        }
        if (parseInt(representativeNumber) <= 0 || representativeNumber?.toString()?.length !== 10) {
            !error.includes("representativeNumberError") && error.push("representativeNumberInvalidError");
        }
        if (!isVerified?.label?.trim() || !isVerified) {
            error.push("isVerifiedError");
        }
        if (!officeType?.label?.trim() || !officeType) {
            error.push("officeTypeError");
        }
        if (!addressLine1?.trim()) {
            error.push("addressLine1Error");
        }
        if (!city?.name?.trim() || !city) {
            error.push("cityError");
        }
        if (!state?.name?.trim() || !state) {
            error.push("stateError");
        }
        if (!pincode?.toString()?.trim()) {
            error.push("pinError");
        }
        if (parseInt(pincode) <= 0) {
            !error.includes("pinError") && error.push("pinInvalidError");
        }
        if (pincode?.toString()?.trim()?.length !== 6) {
            !error.includes("pinError") && error.push("pinInvalidError");
        }
        if (error.length > 0) {
            this.setState({
                error,
            });
        } else {
            this.setState({
                error: [],
            });
            this.updateofficeDetails();
        }
    }

    updateofficeDetails = async() => {
        try {
            let res = await editOfficeDetails(this.state, this.props);
            // passed stateData as props to function so it can prepare payload from this data

            if (res && res?.statusCode == 200) {
            toastAlert(
                res?.message
                ? res?.message
                : "Office details updated successfully"
            );
            this.setState({
                modal: false,
            });
            this.props.getOfficeData();
            } else {
            // error
            console.log("error updating personal info : ", res, res.message);
            let message =
                res && res.message !== undefined
                ? res.message
                : "Problem while updating Records.";
            toastAlert(message, "error");
            this.setState({ modal: false });
            }
        } catch (error) {
            console.log("error catch block", error);
            toastAlert("Please check Internet Connection.", "error");
            this.setState({ modal: false });
        }
    }


    render() {
        const { data, type } = this.props
        const { 
            officeName,
            officeNumber,
            representativeName,
            representativeNumber,
            officeType,
            addressLine1,
            addressLine2,
            state,
            pincode,
            city,
            editWorkingDays,
            isVerified,
            statusData,
            officeTypeData,
            cityDropDown,
            error,
            modal
        } = this.state
        return (
            <div className="card-main">
                <div className="content-header">
                    <div className="inner-card-title">
                        <Typography
                            className='card-title'
                            variant='h5'
                        >
                            Office Details
                        </Typography>
                        {
                            type === "officeDetail" &&
                            <Button
                                className='white-border-btn modal-title-btn'
                                onClick={() => this.openModal()}
                            >
                                Edit
                            </Button>
                        }
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
                                    <BusinessIcon className='details-icon'/>
                                    Office Name:
                                </Typography>
                            </div>
                            <Typography
                                className='small-text' 
                                variant='p'
                            >
                                {data?.name}
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
                                    <ContactsIcon className='details-icon'/>
                                    Office Address:
                                </Typography>
                            </div>
                            <Typography
                                className='small-text'
                                variant='p'
                            >
                                {data?.address?.line1 + ", " + data?.address?.line2 + ", " + data?.address?.city + ", " + data?.address?.state + " - " + data?.address?.pincode}
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
                                    Office Number :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text'
                                variant='p'
                            >
                                {data?.officeContactNumber}
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
                                    <PersonIcon className='details-icon'/>
                                    Representative Name :
                                </Typography>
                            </div>
                            <Typography 
                                className='small-text'
                                variant='p'
                            >
                                {data?.representativeDetails?.name}
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
                                    Representative Number :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text' 
                                variant='p'
                            >
                                {data?.representativeDetails?.number}
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
                                    <VerifiedUserIcon className='details-icon'/>
                                    Verified Status :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text'
                                variant='p'
                            >
                                {data?.isKycCompleted ? "Verified" : "Pending"}
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
                                    <EqualizerIcon
                                        className='details-icon'
                                    />
                                    Office Type :
                                </Typography>
                            </div>
                            <Typography 
                                className='small-text'
                                variant='p'
                            >
                                {data?.officeType}
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
                                    <MeetingRoomIcon className='details-icon'/>
                                    Total Cabins :
                                </Typography>
                            </div>
                            <Typography
                                className='small-text'
                                variant='p'
                            >
                                {data?.cabins ? data.cabins.length : 0}
                            </Typography>
                        </div>
                        <span className='span-line'></span>
                    </div>
                    <div 
                        className="title-main office-card-title" 
                        style={{ marginTop: "20px" }}
                    >
                        <Typography 
                            className='card-title'
                            variant='h5'
                        >
                                Working Days
                        </Typography>
                    </div>
                    <div
                        className="working-days-main" 
                        style={{ marginTop: "20px" }}
                    >
                        <div className="working-days-span-div">
                            {
                                data?.workingDays && data?.workingDays?.length ? 
                                    data?.workingDays?.map((day, i) => (
                                        <span 
                                            className={
                                                day ? 
                                                    "working-days-span small-text" 
                                                : 
                                                    "outline working-days-span small-text"
                                            }
                                        > 
                                            {
                                                i === 0 ? 
                                                    "Monday" 
                                                : i === 1 ? 
                                                    "Tuesday" 
                                                : i === 2 ? 
                                                    "Wednesday" 
                                                : i === 3 ? 
                                                    "Thursday" 
                                                : i === 4 ?
                                                    "Friday" 
                                                : i === 5 ?
                                                    "Saturday" 
                                                : 
                                                    "Sunday"
                                            } 
                                        </span>
                                    )) 
                                : 
                                    "N/A"
                            }
                        </div>
                    </div>
                </div>
                {/* Office Details-modal:: start */}
                <div>
                    <Modal
                        size='lg'
                        className='all-modals'
                        isOpen={modal}
                    >
                        <ModalHeader>
                            Edit Office Details
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={6} xs={12} sm={12} md={6}>
                                    <div>
                                        <p className="small-text">
                                            Office Name :
                                        </p>
                                        <input
                                            className="input-main "
                                            type="text"
                                            placeholder="Office Name"
                                            name="officeName"
                                            value={officeName}
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                        {error.includes("officeNameError") &&
                                            <p className="error-message">
                                                Office name is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={6} xs={12} sm={12} md={6}>
                                    <div>
                                        <p className="small-text">
                                            Office Number :
                                        </p>
                                        <input
                                            className="input-main "
                                            type="number"
                                            placeholder="Office Number"
                                            name="officeNumber"
                                            value={officeNumber}
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                        {error.includes("officeNumberError") &&
                                            <p className="error-message">
                                                Office number is required
                                            </p>
                                        }
                                        {error.includes("officeNumberInvalidError") &&
                                            <p className="error-message">
                                                Office number is invalid!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={6} xs={12} sm={12} md={6}>
                                    <div>
                                        <p className="small-text">
                                            Representative Name :
                                        </p>
                                        <input
                                            className="input-main"
                                            type="text"
                                            placeholder="Representative Name"
                                            name="representativeName"
                                            value={representativeName}
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                        {error.includes("representativeNameError") &&
                                            <p className="error-message">
                                                Representative name is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={6} xs={12} sm={12} md={6}>
                                    <div>
                                        <p className="small-text">
                                            Representative Number :
                                        </p>
                                        <input
                                            className="input-main"
                                            type="number"
                                            placeholder="Representative Number"
                                            name="representativeNumber"
                                            value={representativeNumber}
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                        {error.includes("representativeNumberError") &&
                                            <p className="error-message">
                                                Representative number is required
                                            </p>
                                        }
                                        {error.includes("representativeNumberInvalidError") &&
                                            <p className="error-message">
                                                Representative number is invalid!
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
                                            name="Status"
                                            value={isVerified}
                                            options={statusData}
                                            autoHighlight
                                            onChange={(e, val) =>
                                                this.handleDropDownChange(e, val, "status")
                                            }
                                            getOptionLabel={(option) => option.label}
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
                                                    label="Verified Status"
                                                    placeholder="Choose status"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-password", // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                        {error.includes("isVerifiedError") &&
                                            <p className="error-message">
                                                Status is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Office Type :
                                        </p>
                                        <Autocomplete
                                            id="country-select-demo"
                                            name="Office Type"
                                            value={officeType}
                                            options={officeTypeData}
                                            autoHighlight
                                            onChange={(e, val) =>
                                                this.handleDropDownChange(e, val, "officeType")
                                            }
                                            getOptionLabel={(option) => option.label}
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
                                                    label="Office type"
                                                    placeholder="Choose office type"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-password", // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                        {error?.includes("officeTypeError") &&
                                            <p className="error-message">
                                                Office type is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Address line1 :
                                        </p>
                                        <input
                                            className="input-main"
                                            type="text"
                                            name="addressLine1"
                                            value={addressLine1}
                                            onChange={(e) => this.handleChange(e)}
                                            placeholder="Building number / Name"
                                        />
                                        {error.includes("addressLine1Error") &&
                                            <p className="error-message">
                                                AddressLine1 is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Address line2 :
                                        </p>
                                        <input
                                            className="input-main"
                                            type="text"
                                            name="addressLine2"
                                            value={addressLine2}
                                            onChange={(e) => this.handleChange(e)}
                                            placeholder="street"
                                        />
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            State :
                                        </p>
                                        <Autocomplete
                                            id="country-select-demo"
                                            name="state"
                                            value={state}
                                            options={stateData}
                                            autoHighlight
                                            onChange={(e, val) =>
                                                this.handleDropDownChange(e, val, "state")
                                            }
                                            getOptionLabel={(option) => option.name}
                                            renderOption={(props, option) => (
                                                <Box
                                                    component="li"
                                                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                                    {...props}
                                                >
                                                    {option.name} ({option.isoCode})
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    className="country-dropdown"
                                                    {...params}
                                                    label="State"
                                                    placeholder="Choose a state"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-password", // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                        {error.includes("stateError") &&
                                            <p className="error-message">
                                                State is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            City :
                                        </p>
                                        <Autocomplete
                                            loading="lazy"
                                            id="country-select-demo"
                                            options={cityDropDown}
                                            disabled={!state}
                                            value={city}
                                            autoHighlight
                                            onChange={(e, newVal) =>
                                                this.handleDropDownChange(e, newVal, "city")
                                            }
                                            getOptionLabel={(option) => option.name}
                                            renderOption={(props, option) => (
                                                <Box
                                                    component="li"
                                                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                                    {...props}
                                                >
                                                    {option.name}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="City"
                                                    placeholder="Choose a city"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-password", // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                        {error.includes("cityError") &&
                                            <p className="error-message">
                                                City is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Postal code :
                                        </p>
                                        <input
                                            className="input-main"
                                            type="number"
                                            name="pincode"
                                            value={pincode}
                                            onChange={(e) => this.handleChange(e)}
                                            placeholder="Postal Code"
                                        />
                                        {error.includes("pinError") &&
                                            <p className="error-message">
                                                Pincode is required!
                                            </p>
                                        }
                                        {error.includes("pinInvalidError") &&
                                            <p className="error-message">
                                                Pincode is invalid
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <div>
                                        <p>
                                            Working Days
                                        </p>
                                        {
                                            editWorkingDays?.length > 0 ?
                                                editWorkingDays?.map((day, i) => (
                                                    <span
                                                        className={
                                                            day ? 
                                                                "working-days-span small-text"
                                                            : 
                                                                "outline working-days-span small-text"
                                                        }
                                                        onClick={() => this.changeActiveStatus(i)}
                                                    >
                                                        {
                                                            i === 0 ? 
                                                                "Monday" 
                                                            : i === 1 ? 
                                                                "Tuesday" 
                                                            : i === 2 ?
                                                                "Wednesday" 
                                                            : i === 3 ? 
                                                                "Thursday" 
                                                            : i === 4 ?
                                                                "Friday" 
                                                            : i === 5 ? 
                                                                "Saturday" 
                                                            : "Sunday"
                                                        }
                                                    </span>
                                                )) 
                                            : 
                                                "N/A"
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <div className="update-btn">
                                <Button
                                    className='btn btn-colored small-text-white'
                                    onClick={() => this.validateUpdateofficeDetails()}
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
                {/* Office Details-modal:: End */}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(OfficeInfo))