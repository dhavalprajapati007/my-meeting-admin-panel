import { Grid, Typography, Autocomplete, TextField } from '@mui/material';
import React, { Component } from 'react';
import EventIcon from '@material-ui/icons/Event';
import BadgeIcon from '@mui/icons-material/Badge';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PersonIcon from '@mui/icons-material/Person';
import { Button } from 'react-bootstrap';
import { Box } from "@mui/system";
import { editBookingDetails } from '../../../services/bookingService';
import { toastAlert } from '../../../helpers/toastAlert';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
class BookingInfo extends Component {
    constructor() {
        super();
        this.state = {
            modal: false,
            uniqueName : "",
            password : "",
            instructionAnswer : "",
            webKey : "",
            serviceType : "",
            serviceTypeData: [
                {
                    label: "Physical Place",
                    value: 1
                },
                {
                    label: "Physical Place With Service",
                    value: 2,
                },
                {
                    label: "Virtual Service",
                    value: 3,
                }
            ],
            status : "",
            statusData : [
                {
                    label: "Upcoming Booking",
                    value: "Upcoming"
                },
                {
                    label: "Unattended Booking",
                    value: "Unattended",
                },
                {
                    label: "Cancelled Booking",
                    value: "Cancelled",
                },
                {
                    label: "Completed Booking",
                    value: "Completed",
                },
                {
                    label: "In-progress Booking",
                    value: "In-Progress",
                }
            ],
            isPlaceVerified : "",
            placeVerificationData : [
                {
                    label: "True",
                    value: true
                },
                {
                    label: "False",
                    value: false,
                }
            ],
            virtualServiceType : "",
            virtualServiceTypeData : [
                {
                    label: "Virtual Silver",
                    value: 1
                },
                {
                    label: "Virtual Gold",
                    value: 2,
                }
            ],
            category : "",
            categoryData : [
                {
                    label: "Personal",
                    value: 1
                },
                {
                    label: "Official",
                    value: 2,
                },
                {
                    label: "Personal & Official Both",
                    value: 3,
                }
            ],
            physicalType : "",
            physicalTypeData : [
                {
                    label: "Express",
                    value: 1
                },
                {
                    label: "Scheduled",
                    value: 2,
                }
            ],
            placeVerificationCode : "",
            serviceVerificationCode : "",
            totalParticipants : "",
            error : []
        }
    }

    getService = (val) => {
        if(val) {
            this.state?.serviceTypeData?.map((data,idx) => {
                if(data.value === val) {
                    this.setState({
                        serviceType : data
                    })
                }
            })
        }
    }

    updateBookingDetails = async () => {
        const { data } = this.props;
        const {
            status,
            virtualServiceType,
            totalParticipants,
            password,
            uniqueName,
            webKey,
            instructionAnswer,
            physicalType,
            category,
            serviceType,
            isPlaceVerified
        } = this.state
        let error = [];
        let serviceCategoryType = data?.serviceType;
        if (!status?.label?.trim() || !status) {
            error.push("statusError");
        }
        if (serviceCategoryType === 3) {
            if (!virtualServiceType?.label?.trim() || !virtualServiceType) {
                error.push("virtualServiceTypeError");
            }
            if (!totalParticipants?.toString().trim()) {
                error.push("totalParticipantsError");
            }
            if (parseInt(totalParticipants?.toString()?.trim()) <= 0) {
                !error.includes("totalParticipantsError") && error.push("totalParticipantsInvalidError");
            }
            if (!password?.toString().trim()) {
                error.push("passwordError");
            }
            if (parseInt(password?.toString()?.trim()) <= 0) {
                !error.includes("passwordError") && error.push("passwordInvalidError");
            }
            if (!uniqueName?.toString().trim()) {
                error.push("uniqueNameError");
            }
            // if (parseInt(this?.state?.uniqueName) <= 0) {
            //     !error.includes("uniqueNameError") && error.push("uniqueNameInvalidError");
            // }
            if (!webKey.trim()) {
                error.push("webKeyError");
            }
            if (!instructionAnswer.trim()) {
                error.push("instructionAnswerError");
            }
        }

        if (serviceCategoryType === 1 || serviceCategoryType === 2) {
            if (!physicalType?.label?.trim() || !physicalType) {
                error.push("physicalTypeError");
            }
            if (!category?.label?.trim() || !category) {
                error.push("categoryError");
            }
            if (!serviceType?.label?.trim() || !serviceType) {
                error.push("serviceTypeError");
            }
            if (!isPlaceVerified?.label?.trim() || !isPlaceVerified) {
                error.push("isPlaceVerifiedError");
            }
            // if (!this.state.placeVerificationCode.toString()?.trim()) {
            //     error.push("placeVerificationCodeError");
            // }
            // if (parseInt(this?.state?.placeVerificationCode?.toString()?.trim()) <= 0) {
            //     !error.includes("placeVerificationCodeError") && error.push("placeVerificationCodeInvalidError");
            // }
            // if(serviceType === 2) {
            //     if (!this.state.serviceVerificationCode.toString().trim()) {
            //         error.push("serviceVerificationCodeError");
            //     }
            //     if (parseInt(this?.state?.serviceVerificationCode?.toString()?.trim()) <= 0) {
            //         !error.includes("serviceVerificationCodeError") && error.push("serviceVerificationCodeInvalidError");
            //     }   
            // }
        }

        if(error?.length > 0) {
            this.setState({
              error
            });
        } else {
            this.setState({
              error: [],
            });
            try {
                let body = {};
                if(serviceType === 1) {
                    body = {
                        "_id" : data?._id,
                        "isCompleted" : status?.value,
                        "serviceType" : serviceType?.value,
                        "isPlaceVerified" : isPlaceVerified?.value,
                        "physicalType" : physicalType?.value,
                        "category" : category?.value,
                        // "placeVerificationCode" : this?.state?.placeVerificationCode,
                    }
                } else if(serviceType === 2) {
                    body = {
                        "_id" : data?._id,
                        "isCompleted" : status?.value,
                        "serviceType" : serviceType?.value,
                        "isPlaceVerified" : isPlaceVerified?.value,
                        "physicalType" : physicalType?.value,
                        "category" : category?.value,
                        // "placeVerificationCode" : this?.state?.placeVerificationCode,
                        // "serviceVerificationCode" : this?.state?.serviceVerificationCode
                    }
                } else if(serviceType === 3) {
                    body = {
                        "_id" : data?._id,
                        "isCompleted" : status?.value,
                        "virtualServiceType" : virtualServiceType?.value,
                        "uniqueName" : uniqueName?.toString(),
                        "password" : password,
                        "instrucationAnswer" : instructionAnswer,
                        "webKey" : webKey,
                        "totalParticipants" : totalParticipants
                    }
                }
                let res = await editBookingDetails(body, this.props);
                // passed payload as props to function so it can passed payload from this props
        
                if (res && res?.statusCode == 200) {
                  toastAlert(
                    res?.message
                      ? res?.message
                      : "Booking details updated successfully"
                  );
                  this.closeModal();
                  this?.props?.getBookingDetails();
                } else {
                  // error
                  console.log("error updating booking details : ", res, res.message);
                  let message = res && res.message !== undefined
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

    getStatus = (val) => {
        if(val) {
            this.state?.statusData?.map((data,idx) => {
                if(data.value === val) {
                    this.setState({
                        status : data
                    })
                }
            })
        }
    }

    getPhysicalService = (val) => {
        if(val) {
            this.state?.physicalTypeData?.map((data,idx) => {
                if(data.value === val) {
                    this.setState({
                        physicalType : data
                    })
                }
            })
        }
    }

    getVirtualService = (val) => {
        if(val) {
            this.state?.virtualServiceTypeData?.map((data,idx) => {
                if(data.value === val) {
                    this.setState({
                        virtualServiceType : data
                    })
                }
            })
        }
    }

    getCategory = (val) => {
        if(val) {
            this.state?.categoryData?.map((data,idx) => {
                if(data.value === val) {
                    this.setState({
                        category : data
                    })
                }
            })
        }
    }

    getPlaceStatus = (val) => {
        this.state?.placeVerificationData?.map((data,idx) => {
            if(data.value === val) {
                this.setState({
                    isPlaceVerified : data
                })
            }
        })
    }

    openModal = () => {
        const { data } = this?.props;
        this.getService(data?.serviceType);
        this.getStatus(data?.isCompleted);
        this.getPlaceStatus(data?.isPlaceVerified);
        this.getVirtualService(data?.virtualService[0]?.virtualServiceType);
        this.getPhysicalService(data?.physicalType);
        this.getCategory(data?.category);
        this.setState({
            uniqueName : data?.hasOwnProperty("virtualService") && data?.virtualService[0]?.uniqueName ? data?.virtualService[0]?.uniqueName : "",
            password : data?.hasOwnProperty("virtualService") && data?.virtualService[0]?.password ? data?.virtualService[0]?.password : "",
            instructionAnswer : data?.hasOwnProperty("virtualService") && data?.virtualService[0]?.instrucationAnswer ? data?.virtualService[0]?.instrucationAnswer : "",
            webKey : data?.virtualService[0]?.webinar?.webKey ? data?.virtualService[0]?.webinar?.webKey : "",
            placeVerificationCode : data?.placeVerificationCode ? data?.placeVerificationCode : "",
            serviceVerificationCode : data?.serviceVerificationCode ? data?.serviceVerificationCode : "",
            totalParticipants : data?.hasOwnProperty("virtualService") && data?.virtualService[0]?.totalParticipants ? data?.virtualService[0]?.totalParticipants : "",
            modal : true,
        })
    }


    closeModal = () => {
        this.setState({
            modal: false,
            error : []
        })
    }

    handleDropDownChange = (event, val, type) => {
        if(type === "service") {
            this.setState({
                serviceType : val,
            })
        } else if(type === "status") {
            this.setState({
                status : val,
            })
        } else if(type === "placeData") {
            this.setState({
                isPlaceVerified : val,
            })
        } else if(type === "physicalService") {
            this.setState({
                physicalType : val,
            })
        } else if(type === "virtualService") {
            this.setState({
                virtualServiceType : val,
            })
        } else if(type === "category") {
            this.setState({
                category : val,
            })
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
            uniqueName,
            password,
            instructionAnswer,
            webKey,
            serviceTypeData,
            serviceType,
            statusData,
            status,
            isPlaceVerified,
            placeVerificationData,
            placeVerificationCode,
            serviceVerificationCode,
            totalParticipants,
            physicalTypeData,
            physicalType,
            categoryData,
            category,
            virtualServiceType,
            virtualServiceTypeData,
            error,
            modal
        } = this.state;
        return (
            <div className="card-main">
                <div className="content-header">
                    <div className="inner-card-title">
                        <Typography 
                            className='card-title'
                            variant='h5'
                        >
                            Booking Details
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
                                    <PersonIcon className='details-icon' /> 
                                    ID :
                                </Typography>
                            </div>
                            <Typography 
                                className='small-text'
                                variant='p'
                            >
                                {data?._id ? data?._id : "NA"}
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
                                    <EventIcon className='details-icon' />
                                    Duration :
                                </Typography>
                            </div>
                            <Typography 
                                className='small-text'
                                variant='p'
                            >
                                {data?.date &&  data?.date.split("T")[0]}, {data?.duration && data?.duration?.startTime && data?.duration?.startTime.split("T")[1].split(".")[0]
                                }-{data?.duration && data?.duration?.endTime && data?.duration?.endTime.split("T")[1].split(".")[0]}
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
                                    <VerifiedUserIcon className='details-icon' />
                                    Status :
                                </Typography>
                            </div>
                            <Typography 
                                className='small-text'
                                variant='p'
                            >
                                {data?.isCompleted ? data?.isCompleted : "NA"}
                            </Typography>
                        </div>
                        <span className='span-line'></span>
                    </div>
                    {
                        (data?.serviceType === 1 || data?.serviceType === 2) &&
                        <>
                            <div className="card-details">
                                <div className="icon-and-details-main">
                                    <div className="icon-main">
                                        <Typography 
                                            className='small-text name-icon' 
                                            variant='p'
                                        >
                                            <BadgeIcon className='details-icon' />
                                            Place Verification Status :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text' 
                                        variant='p'
                                    >
                                        {
                                            data?.isPlaceVerified === true ? 
                                                "True" 
                                            : 
                                            data?.isPlaceVerified === false ?
                                                "False"
                                            :
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            {
                                data?.isPlaceVerified &&
                                <div className="card-details">
                                    <div className="icon-and-details-main">
                                        <div className="icon-main">
                                            <Typography
                                                className='small-text name-icon'
                                                variant='p'
                                            >
                                                <BadgeIcon className='details-icon' />
                                                Place Verification Code :
                                            </Typography>
                                        </div>
                                        <Typography 
                                            className='small-text' 
                                            variant='p'
                                        >
                                            {data?.placeVerificationCode ? data?.placeVerificationCode : "NA"}
                                        </Typography>
                                    </div>
                                    <span className='span-line'></span>
                                </div>
                            }
                            {
                                data?.serviceType === 2 && 
                                <div className="card-details">
                                    <div className="icon-and-details-main">
                                        <div className="icon-main">
                                            <Typography 
                                                className='small-text name-icon' 
                                                variant='p'
                                            >
                                                <BadgeIcon className='details-icon' />
                                                Service Verification Code :
                                            </Typography>
                                        </div>
                                        <Typography 
                                            className='small-text'
                                            variant='p'
                                        >
                                            {data?.serviceVerificationCode ? data?.serviceVerificationCode : "NA"}
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
                                            <ManageAccountsIcon className='details-icon' />
                                            Service type :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text' 
                                        variant='p'
                                    >
                                        {
                                            data?.serviceType === 1 ? 
                                                "Physical Place" 
                                            : data?.serviceType === 2 ? 
                                                "Physical Place With Service" 
                                            : data?.serviceType === 3 ? 
                                                "Virtual Service" 
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
                                            <ManageAccountsIcon className='details-icon' />
                                            Physical type :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text'
                                        variant='p'
                                    >
                                        {
                                            data?.physicalType === 1 ? 
                                                "Express" 
                                            : data?.physicalType === 2 ? 
                                                "Scheduled" 
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
                                            <ManageAccountsIcon className='details-icon' />
                                            Category :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text' 
                                        variant='p'
                                    >
                                        {
                                            data?.category === 1 ? 
                                                "Personal" 
                                            : data?.category === 2 ? 
                                                "Official" 
                                            : data?.category === 3 ? 
                                                "Personal & official Both"
                                            : 
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                        </>
                    }
                    {
                        data?.serviceType === 3 &&
                        <>
                            <div className="card-details">
                                <div className="icon-and-details-main">
                                    <div className="icon-main">
                                        <Typography
                                            className='small-text name-icon'
                                            variant='p'
                                        >
                                            <BadgeIcon className='details-icon' />
                                            Unique Name :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text'
                                        variant='p'
                                    >
                                        {
                                            data?.hasOwnProperty("virtualService") && 
                                            data?.virtualService[0]?.uniqueName ? 
                                                data?.virtualService[0]?.uniqueName 
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
                                            <LockIcon className='details-icon' />
                                            Password :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text' 
                                        variant='p'
                                    >
                                        {  
                                            data?.hasOwnProperty("virtualService") && 
                                            data?.virtualService[0]?.password ? 
                                                data?.virtualService[0]?.password 
                                            : 
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                            {
                                data?.hasOwnProperty("virtualService") &&
                                data?.virtualService[0]?.hasOwnProperty("webinar") &&
                                data?.virtualService[0]?.webinar?.hasOwnProperty("webKey") &&
                                data?.virtualService[0]?.webinar?.webKey &&
                                <div className="card-details">
                                    <div className="icon-and-details-main">
                                        <div className="icon-main">
                                            <Typography 
                                                className='small-text name-icon'
                                                variant='p'
                                            >
                                                <KeyIcon className='details-icon' />
                                                Web Key:
                                            </Typography>
                                        </div>
                                        <Typography
                                            className='small-text'
                                            variant='p'
                                        >
                                            {  
                                                data?.virtualService[0]?.webinar &&
                                                data?.virtualService[0]?.webinar.hasOwnProperty("webKey") ?
                                                    data?.virtualService[0]?.webinar?.webKey 
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
                                            <AccessibilityIcon className='details-icon' />
                                            Total Participants :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text'
                                        variant='p'
                                    >
                                        {  
                                            (data?.hasOwnProperty("virtualService") && 
                                            data?.virtualService[0]?.totalParticipants) ? 
                                                data?.virtualService[0]?.totalParticipants 
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
                                            <ManageAccountsIcon className='details-icon'/>
                                            Virtual service type :
                                        </Typography>
                                    </div>
                                    <Typography 
                                        className='small-text'
                                        variant='p'
                                    >
                                        {
                                            data?.hasOwnProperty("virtualService") &&
                                            data?.virtualService?.length > 0 &&
                                            data?.virtualService[0]?.hasOwnProperty("virtualServiceType") &&
                                                (data?.virtualService?.length > 0 &&
                                                data?.virtualService[0]?.virtualServiceType) === 1 ? 
                                                    "Virtual Silver"  
                                                :
                                                (data?.virtualService?.length > 0 &&
                                                data?.virtualService[0]?.virtualServiceType) === 2 ? 
                                                    "Virtual Gold"
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
                                            <QuestionAnswerIcon className='details-icon'/>
                                            Instruction answer:
                                        </Typography>
                                    </div>
                                    <Typography
                                        className='small-text'
                                        variant='p'
                                    >
                                        {
                                            data?.hasOwnProperty("virtualService") && 
                                            data?.virtualService[0]?.instrucationAnswer ? 
                                                data?.virtualService[0]?.instrucationAnswer 
                                            : 
                                                "NA"
                                        }
                                    </Typography>
                                </div>
                                <span className='span-line'></span>
                            </div>
                        </>
                    }
                </div>


                {/* booking-details-modal:: start */}
                <div>
                    <Modal 
                        size='lg'
                        className='all-modals'
                        isOpen={modal}
                    >
                        <ModalHeader className='card-title'>
                            {
                                data?.serviceType === 1 ? 
                                    "Edit physical place booking details" 
                                : 
                                data?.serviceType === 2 ? 
                                    "Edit physical place with service booking details"
                                :
                                data?.serviceType === 3 && 
                                    "Edit virtual booking details"
                            }
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
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
                                {
                                    data?.serviceType === 3 &&
                                    <>
                                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                            <div>
                                                <p className="small-text">
                                                    Virtual service type :
                                                </p>
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    name="virtualServiceType"
                                                    value={virtualServiceType}
                                                    options={virtualServiceTypeData}
                                                    autoHighlight
                                                    onChange={(e, val) =>
                                                        this.handleDropDownChange(e, val, "virtualService")
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
                                                            label="Virtual service type"
                                                            placeholder="Choose type"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: "new-password", // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {error?.includes("virtualServiceTypeError") && 
                                                    <p className="error-message">
                                                        Virtual service type is required!
                                                    </p>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                                            <div>
                                                <p className="small-text">
                                                    Unique name :
                                                </p>
                                                <input
                                                    className="input-main"
                                                    type="text"
                                                    name="uniqueName"
                                                    value={uniqueName}
                                                    onChange={(e) => this.handleChange(e)}
                                                    placeholder="Unique name"
                                                />
                                                {error?.includes("uniqueNameError") && 
                                                    <p className="error-message">
                                                        Unique name is required
                                                    </p>
                                                }
                                                {/* {error.includes("uniqueNameInvalidError") && (
                                                    <p className="error-message">
                                                        Unique name is invalid!
                                                    </p>
                                                )} */}
                                            </div>
                                        </Grid>
                                        <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                                            <div>
                                                <p className="small-text">
                                                    Password :
                                                </p>
                                                <input
                                                    className="input-main"
                                                    type="number"
                                                    name="password"
                                                    value={password}
                                                    onChange={(e) => this.handleChange(e)}
                                                    placeholder="Password"
                                                />
                                                {error?.includes("passwordError") &&
                                                    <p className="error-message">
                                                        Password is required
                                                    </p>
                                                }
                                                {error.includes("passwordInvalidError") && (
                                                    <p className="error-message">
                                                        Password is invalid!
                                                    </p>
                                                )}
                                            </div>
                                        </Grid>
                                        <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                                            <div>
                                                <p className="small-text">
                                                    Instruction answer :
                                                </p>
                                                <input
                                                    className="input-main"
                                                    type="text"
                                                    name="instructionAnswer"
                                                    value={instructionAnswer}
                                                    onChange={(e) => this.handleChange(e)}
                                                    placeholder="Instruction answer"
                                                />
                                                {error?.includes("instructionAnswerError") && 
                                                    <p className="error-message">
                                                        Instruction answer is required
                                                    </p>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                                            <div>
                                                <p className="small-text">
                                                    Web key :
                                                </p>
                                                <input
                                                    className="input-main"
                                                    type="text"
                                                    name="webKey"
                                                    value={webKey}
                                                    onChange={(e) => this.handleChange(e)}
                                                    placeholder="Web key"
                                                />
                                                {error?.includes("webKeyError") && 
                                                    <p className="error-message">
                                                        Webkey is required
                                                    </p>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                                            <div>
                                                <p className="small-text">
                                                    Total Participants :
                                                </p>
                                                <input
                                                    className="input-main"
                                                    type="number"
                                                    name="totalParticipants"
                                                    value={totalParticipants}
                                                    onChange={(e) => this.handleChange(e)}
                                                    placeholder="Total participants"
                                                />
                                                {error?.includes("totalParticipantsError") &&
                                                    <p className="error-message">
                                                        Total participants is required
                                                    </p>
                                                }
                                                {error.includes("totalParticipantsInvalidError") &&
                                                    <p className="error-message">
                                                        Total participants is invalid!
                                                    </p>
                                                }
                                            </div>
                                        </Grid>
                                    </>
                                }
                                {
                                    (data?.serviceType === 1 || data?.serviceType === 2) &&
                                    <>                                
                                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                            <div>
                                                <p className="small-text">
                                                    Service Type :
                                                </p>
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    name="serviceType"
                                                    value={serviceType}
                                                    options={serviceTypeData}
                                                    autoHighlight
                                                    onChange={(e, val) =>
                                                        this.handleDropDownChange(e, val, "service")
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
                                                            label="Service type"
                                                            placeholder="Choose type"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: "new-password", // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {error.includes("serviceTypeError") &&
                                                    <p className="error-message">
                                                        Service type is required!
                                                    </p>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                            <div>
                                                <p className="small-text">
                                                    Place Verification Status :
                                                </p>
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    name="isPlaceVerified"
                                                    value={isPlaceVerified}
                                                    options={placeVerificationData}
                                                    autoHighlight
                                                    onChange={(e, val) =>
                                                        this.handleDropDownChange(e, val, "placeData")
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
                                                            label="Place verification status"
                                                            placeholder="Choose status"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: "new-password", // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {error.includes("isPlaceVerifiedError") &&
                                                    <p className="error-message">
                                                        Place verification type is required!
                                                    </p>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                            <div>
                                                <p className="small-text">
                                                    Physical service type :
                                                </p>
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    name="physicalType"
                                                    value={physicalType}
                                                    options={physicalTypeData}
                                                    autoHighlight
                                                    onChange={(e, val) =>
                                                        this.handleDropDownChange(e, val, "physicalService")
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
                                                            label="Physical service type"
                                                            placeholder="Choose type"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: "new-password", // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {error.includes("physicalTypeError") &&
                                                    <p className="error-message">
                                                        Physical service type is required!
                                                    </p>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                            <div>
                                                <p className="small-text">
                                                    Category :
                                                </p>
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    name="category"
                                                    value={category}
                                                    options={categoryData}
                                                    autoHighlight
                                                    onChange={(e, val) =>
                                                        this.handleDropDownChange(e, val, "category")
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
                                                            label="Category"
                                                            placeholder="Choose category"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: "new-password", // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {error.includes("categoryError") &&
                                                    <p className="error-message">
                                                        Category is required!
                                                    </p>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                            <div>
                                                <p className="small-text">
                                                    Place verification code :
                                                </p>
                                                <input
                                                    className="input-main"
                                                    type="number"
                                                    name="placeVerificationCode"
                                                    value={placeVerificationCode}
                                                    onChange={(e) => this.handleChange(e)}
                                                    placeholder="Place Verification code"
                                                    disabled={true}
                                                />
                                                {error?.includes("placeVerificationCodeError") && (
                                                    <p className="error-message">
                                                        Place verification code is required
                                                    </p>
                                                )}
                                                {error.includes("placeVerificationCodeInvalidError") && (
                                                    <p className="error-message">
                                                        Place verification code is invalid!
                                                    </p>
                                                )}
                                            </div>
                                        </Grid>
                                        {
                                            data?.serviceType === 2 &&
                                            <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                                <div>
                                                    <p className="small-text">Service verification code : </p>
                                                    <input
                                                        className="input-main"
                                                        type="number"
                                                        name="serviceVerificationCode"
                                                        value={serviceVerificationCode}
                                                        onChange={(e) => this.handleChange(e)}
                                                        placeholder="Service Verification code"
                                                        disabled={true}
                                                    />
                                                    {error?.includes("serviceVerificationCodeError") &&
                                                        <p className="error-message">
                                                            Service verification code is required
                                                        </p>
                                                    }
                                                    {error.includes("serviceVerificationCodeInvalidError") &&
                                                        <p className="error-message">
                                                            Service verification code is invalid!
                                                        </p>
                                                    }
                                                </div>
                                            </Grid>
                                        }
                                    </>
                                }
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                className='btn-colored'
                                onClick={() => this.updateBookingDetails()}
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
                {/* booking-details-modal:: End */}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(BookingInfo))