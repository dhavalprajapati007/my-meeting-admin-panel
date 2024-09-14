import { Autocomplete, TextField, Typography } from "@mui/material";
import React, { Component } from "react";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DetailsIcon from "@mui/icons-material/Details";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import BadgeIcon from "@mui/icons-material/Badge";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import StarIcon from '@mui/icons-material/Star';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Country, State, City } from "country-state-city";
import { Grid, Button } from "@material-ui/core";
import {
  editPersonalData,
  editVendorDetails,
} from "../../../services/userService";
import { withRouter } from "react-router-dom";
import { toastAlert } from "../../../helpers/toastAlert";
import { Box } from "@mui/system";
import { getServiceCategory } from "../../../services/serviceCategoryService";
import { getLanguages } from "../../../services/languageService";

let stateData;
class PersonalInformation extends Component {
  constructor(props) {
    console.log(props, "AllProps");
    super(props);
    this.state = {
      error: [],
      firstName: "",
      lastName: "",
      mobile: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      physicalSilverFees: "",
      virtualGoldFees: "",
      virtualSilverFees: "",
      instruction: "",
      bio: "",
      service: "",
      languages: "",
      editPersonalInfoModal: false,
      editDetailInfoModal: false,
      cityDropDown: [],
      serviceData: [],
      allServiceData: [],
      languageData: [],
      userId: "",
      isAvailable : "",
      availableData : [
        {
          label : "True",
          value : true
        },
        {
          label : "False",
          value : false
        }
      ]
    };
  }

  getAllServices = async () => {
    try {
      let services = await getServiceCategory(this.props);
      // passed props to getServiceCategory function so it can redirect this props to clearCookie() function

      if (services && services?.statusCode == 200) {
        this.setState({
          serviceData: services.data,
        });
        let allServiceData = [];
        this.state.serviceData.map((parentData) => {
          if (parentData?.childs?.length > 0) {
            allServiceData.push(parentData);
            parentData?.childs?.map((childData) => {
              allServiceData.push(childData);
            });
          } else {
            allServiceData.push(parentData);
          }
        });
        this.setState({ allServiceData });
      } else {
        // error
        console.log("error fetching languages : ", services, services.message);
        let message =
          services && services.message !== undefined
            ? services.message
            : "Problem Fetching Records.";
        toastAlert(message, "error");
      }
    } catch (error) {
      console.log("error catch block", error);
      toastAlert("Please check Internet Connection.", "error");
    }
  };

  getAllLang = async () => {
    try {
      let languages = await getLanguages(this.props);
      // passed props to getLanguages function so it can redirect this props to clearCookie() function

      if (languages && languages?.statusCode == 200) {
        this.setState({
          languageData: languages.data,
        });
      } else {
        // error
        console.log(
          "error fetching languages : ",
          languages,
          languages.message
        );
        let message =
          languages && languages.message !== undefined ?
            languages.message
          : 
            "Problem Fetching Records.";
        toastAlert(message, "error");
      }
    } catch (error) {
      console.log("error catch block", error);
      toastAlert("Please check Internet Connection.", "error");
    }
  };

  componentDidMount = () => {
    stateData = State.getStatesOfCountry("IN");
    this.getAllServices();
    this.getAllLang();
  };

  getState = (state) => {
    stateData.map((data) => {
      if (
        data?.name?.toLowerCase() === state.toLowerCase() ||
        data.isoCode.toLowerCase() === state.toLowerCase()
      ) {
        this.setState(
          {
            state: data,
          },
          () => this.getCity(this?.props?.data?.vendorDetails?.address?.city)
        );
      }
    });
  };

  getCity = (city) => {
    let cityData = City.getCitiesOfState("IN", this.state.state?.isoCode);
    this.setState({ cityDropDown : cityData })
    cityData?.map((data) => {
      if (data?.name?.toLowerCase() === city?.toLowerCase()) {
        this.setState(
          {
            city: data,
          },
          () => this.classify()
        );
      }
    });
  };

  getService = (service) => {
    const { allServiceData } = this.state;
    allServiceData?.map((data) => {
      if (data?._id === service[0]._id) {
        this.setState({
          service: data,
        });
      }
    });
  };

  getLanguages = (languages) => {
    const { languageData } = this.state;
    let langArr = [];
    languages?.length > 0 &&
      languages.map((lang) => {
        languageData?.map((data) => {
          if(data?._id === lang?._id) {
            langArr.push(data);
          }
        });
      });
    this.setState({
      languages: langArr,
    });
  };

  getAvailableStatus = (available) => {
    const { availableData } = this.state;
    availableData?.length > 0 ? 
      availableData?.map((data) => {
        if(data.value === available) {
          this.setState({
            isAvailable : data
          })
        }
      }) 
    :
      this.setState({
        isAvailable : ""
      })
  }

  handleDropDownChange = (event, val, type) => {
    if (type === "state") {
      this.setState(
        {
          state: val,
          city: null,
        },
        () => this.classify()
      );
    } else if (type === "city") {
      this.setState({
        city: val,
      });
    } else if (type === "service") {
      this.setState({
        service: val,
      });
    } else if (type === "languages") {
      this.setState({
        languages: val,
      });
    } else if (type === "available") {
      this.setState({
        isAvailable: val,
      });
    }
  };

  classify = () => {
    let cityDropDown = City.getCitiesOfState("IN", this.state.state?.isoCode);
    this.setState({ cityDropDown });
  };

  closeModal = (name) => {
    if (name === "personalInfo") {
      this.setState({
        error: [],
        editPersonalInfoModal: false,
      });
    } else if (name === "detailInfo") {
      this.setState({
        error: [],
        editDetailInfoModal: false,
      });
    }
  };

  openModal = (name) => {
    const { data } = this.props;
    if (name === "personalInfo") {
      this.getState(data?.vendorDetails?.address?.state);
      this.setState({
        error: [],
        firstName: data?.firstName,
        lastName: data?.lastName,
        mobile: data?.mobile,
        addressLine1: data?.vendorDetails?.address?.line1,
        addressLine2: data?.vendorDetails?.address?.line2,
        pincode: data?.vendorDetails?.address?.pincode,
        editPersonalInfoModal: true,
        userId: data?._id,
      });
    } else if (name === "detailInfo") {
      this.getService(data?.vendorService?.service);
      this.getLanguages(data?.vendorService?.languages);
      this.getAvailableStatus(data?.vendorService?.available);
      this.setState({
        error: [],
        userId: data?._id,
        physicalSilverFees: data?.vendorService?.fees?.physicalSilver,
        virtualGoldFees: data?.vendorService?.fees?.virtualGold,
        virtualSilverFees: data?.vendorService?.fees?.virtualSilver,
        instruction: data?.vendorService?.instruction,
        bio: data?.vendorService?.bio,
        editDetailInfoModal: true,
      });
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  validateEditPersonalInfo = () => {
    let error = [];
    const {
      firstName,
      pincode,
      state,
      city,
      addressLine1,
      mobile,
      lastName,
    } = this.state;
    if(!firstName.trim()) {
      error.push("firstNameError");
    }
    if(!lastName.trim()) {
      error.push("lastNameError");
    }
    if(!mobile?.toString().trim()) {
      error.push("mobileError");
    }
    if(parseInt(mobile) <= 0 || mobile?.length !== 10) {
      error.push("mobileInvalidError");
    }
    if(!addressLine1?.trim()) {
      error.push("addressLine1Error");
    }
    if(!city?.name?.trim() || !city) {
      error.push("cityError");
    }
    if(!state?.name?.trim() || !state) {
      error.push("stateError");
    }
    if(!pincode.toString().trim()) {
      error.push("pinError");
    }
    if(parseInt(pincode) <= 0) {
      error.push("pinInvalidError");
    }
    if(pincode.toString()?.length !== 6) {
      error.push("pinInvalidError");
    }
    if (error?.length > 0) {
      this.setState({
        error,
      });
    } else {
      this.setState({
        error: [],
      });
      this.editPersonalInfo();
    }
  };

  editPersonalInfo = async () => {
    try {
      let res = await editPersonalData(this.state, this.props);
      // passed stateData as props to editPersonalData function so it can prepare payload from this data

      if (res && res?.statusCode == 200) {
        toastAlert(
          res?.message
            ? res?.message
            : "Personal information updated successfully"
        );
        this.setState({
          editPersonalInfoModal: false,
        });
        this?.props?.getVendorData();
      } else {
        // error
        console.log("error updating personal info : ", res, res.message);
        let message =
          res && res.message !== undefined
            ? res.message
            : "Problem while updating Records.";
        toastAlert(message, "error");
        this.setState({ editPersonalInfoModal: false });
      }
    } catch (error) {
      console.log("error catch block", error);
      toastAlert("Please check Internet Connection.", "error");
      this.setState({ editPersonalInfoModal: false });
    }
  }

  validateEditDetailInfo = () => {
    let error = [];
    const {
      physicalSilverFees,
      virtualGoldFees,
      virtualSilverFees,
      service,
      languages,
      instruction,
      bio,
      isAvailable
    } = this.state;
    if(!physicalSilverFees.toString()?.trim()) {
      error.push("physicalSilverError");
    }
    if(parseInt(physicalSilverFees) < 0) {
      error.push("physicalSilverInvalidError");
    }
    if(!virtualGoldFees.toString()?.trim()) {
      error.push("virtualGoldError");
    }
    if(parseInt(virtualGoldFees) < 0) {
      error.push("virtualGoldInvalidError");
    }
    if(!virtualSilverFees?.toString()?.trim()) {
      error.push("virtualSilverError");
    }
    if(parseInt(virtualSilverFees) < 0) {
      error.push("virtualSilverInvalidError");
    }
    if(!service?.name?.trim() || !service) {
      error.push("serviceError");
    }
    if(!languages?.length || !languages) {
      error.push("languagesError");
    }
    if(!isAvailable?.label?.trim() || !isAvailable) {
      error.push("availableError");
    }
    if(!instruction?.trim()) {
      error.push("instructionError");
    }
    if(!bio?.trim()) {
      error.push("bioError");
    }
    if(error.length > 0) {
      this.setState({
        error,
      });
    } else {
      this.setState({
        error: [],
      });
      this.editDetailInfo();
    }
  };

  editDetailInfo = async () => {
    try {
      let res = await editVendorDetails(this.state, this.props);
      // passed stateData as props to function so it can prepare payload from this data
      if (res && res?.statusCode == 200) {
        toastAlert(
          res?.message
            ? res?.message
            : "Vendor details information updated successfully"
        );
        this.setState({
          editDetailInfoModal: false,
        });
        this.props.getVendorData();
      } else {
        // error
        console.log("error adding language : ", res, res.message);
        let message =
          res && res.message !== undefined
            ? res.message
            : "Problem while updating Records.";
        toastAlert(message, "error");
        this.setState({ editDetailInfoModal: false });
      }
    } catch (error) {
      console.log("error catch block", error);
      toastAlert("Please check Internet Connection.", "error");
      this.setState({ editDetailInfoModal: false });
    }
  }

  getAddress = () => {
    const {data} = this.props;
    const addressObj = data?.vendorDetails?.address;
    console.log(addressObj,"addressObj")
    if(addressObj) {
      if(Object.values(addressObj).every((val) => val === "" || val === undefined || val === null)) {
        return "NA"
      }else {
        return `${addressObj?.line1}, ${addressObj.line2}, ${addressObj?.city}, ${addressObj?.state}-${addressObj?.pincode}`
      }
    }
  }

  render() {
    const { data } = this.props;
    const {
      error,
      firstName,
      lastName,
      mobile,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      editPersonalInfoModal,
      editDetailInfoModal,
      physicalSilverFees,
      virtualGoldFees,
      virtualSilverFees,
      service,
      languages,
      instruction,
      bio,
      languageData,
      cityDropDown,
      allServiceData,
      isAvailable,
      availableData
    } = this.state;
    return (
      <div className="card-main">
        <div className="content-header">
          <div className="inner-card-title">
            <Typography className="card-title" variant="h5">
              {" "}
              Vendor Personal Information{" "}
            </Typography>
            <Button
              className="white-border-btn  modal-title-btn"
              onClick={() => this.openModal("personalInfo")}
            >
              Edit
            </Button>
          </div>
        </div>
        <div className="content-body-main">
          <div className="details-main-section">
            <div className="card-details">
              <div className="icon-and-details-main">
                <div className="icon-main">
                  <Typography 
                    className="small-text name-icon"
                    variant="p"
                  >
                    <BadgeIcon className="details-icon" />
                      Full Name:
                  </Typography>
                </div>

                <Typography
                  className="small-text vendor-detail-value"
                  variant="p"
                >
                  {
                    data?.firstName && data?.lastName ? 
                      data?.firstName + " " + data?.lastName
                    : 
                      "NA"
                  }
                </Typography>
              </div>
              <span className="span-line"></span>
            </div>
            <div className="card-details">
              <div className="icon-and-details-main">
                <div className="icon-main">
                  <Typography
                    className="small-text name-icon"
                    variant="p"
                  >
                    <EmailIcon className="details-icon" />
                    Email:
                  </Typography>
                </div>
                <Typography
                  className="small-text vendor-detail-value"
                  variant="p"
                >
                  {data?.email ? data?.email : "NA"}
                </Typography>
              </div>
              <span className="span-line"></span>
            </div>
            <div className="card-details">
              <div className="icon-and-details-main">
                <div className="icon-main">
                  <Typography 
                    className="small-text name-icon"
                    variant="p"
                  >
                    <LocalPhoneIcon className="details-icon" />
                    Mobile :
                  </Typography>
                </div>
                <Typography
                  className="small-text vendor-detail-value"
                  variant="p"
                >
                  {data?.mobile ? data?.mobile : "NA"}
                </Typography>
              </div>
              <span className="span-line"></span>
            </div>
            <div className="card-details">
              <div className="icon-and-details-main">
                <div className="icon-main">
                  <Typography
                    className="small-text name-icon"
                    variant="p"
                  >
                    <BadgeIcon className="details-icon"/>
                    Address :
                  </Typography>
                </div>
                <Typography
                  className="small-text vendor-detail-value"
                  variant="p"
                >
                  {this.getAddress()}
                </Typography>
              </div>
              <span className="span-line"></span>
            </div>
          </div>

          {(data?.vendorDetails?.providerType === 2 || data?.vendorDetails?.providerType === 3) &&
            <div>
              <div className="content-header" style={{ marginTop: "50px" }}>
                <div className="inner-card-title">
                  <Typography className="card-title" variant="h5">
                    {" "}
                    Vendor Detail Information{" "}
                  </Typography>
                  <Button
                    className="white-border-btn modal-title-btn"
                    onClick={() => this.openModal("detailInfo")}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography 
                      className="small-text name-icon"
                      variant="p"
                    >
                      <MonetizationOnIcon className="details-icon" />
                      Physical Silver Fees(₹) :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {
                      data?.vendorService?.fees?.physicalSilver ? 
                        `${data?.vendorService?.fees?.physicalSilver} ₹`
                      : 
                        "NA"
                    }
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography 
                      className="small-text name-icon"
                      variant="p"
                    >
                      <MonetizationOnIcon className="details-icon"/>
                      Virtual Gold Fees(₹) :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {
                      data?.vendorService?.fees?.virtualGold ? 
                        `${data?.vendorService?.fees?.virtualGold} ₹`
                      : 
                        "NA"
                    }
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography
                      className="small-text name-icon" 
                      variant="p"
                    >
                      <MonetizationOnIcon className="details-icon" />
                      Virtual Silver Fees(₹) :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {
                      data?.vendorService?.fees?.virtualSilver ? 
                        `${data?.vendorService?.fees?.virtualSilver} ₹`
                      : 
                        "NA"
                    }
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography
                      className="small-text name-icon"
                      variant="p"
                    >
                      <DetailsIcon className="details-icon" />
                      Provider Type :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {
                      data?.vendorDetails?.providerType === 2 ?
                        "Service"
                      :
                      data?.vendorDetails?.providerType === 3 ?
                        "Both"
                      : "NA" 
                    }
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography
                      className="small-text name-icon"
                      variant="p"
                    >
                      <RoomPreferencesIcon className="details-icon" />
                      Preference :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {
                      data?.vendorService?.prefrence === 1 ?
                        "Virtual"
                      :
                      data?.vendorService?.prefrence === 2 ?
                        "Physical"
                      :
                      data?.vendorService?.prefrence === 3 ?
                        "Both"
                      : "NA" 
                    }
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography
                      className="small-text name-icon"
                      variant="p"
                    >
                      <IntegrationInstructionsIcon className="details-icon" />
                      Instruction :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {
                      data?.vendorService?.instruction ? 
                        data?.vendorService?.instruction
                      : 
                        "NA"
                    }
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography 
                      className="small-text name-icon"
                      variant="p"
                    >
                      {
                        (data?.vendorService?.available && data?.vendorService?.available === true) ?
                          <EventAvailableIcon className="details-icon" />
                        :
                          <EventBusyIcon className="details-icon" />
                      }
                      Is Available :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {
                      data?.vendorService?.hasOwnProperty("available") ? 
                        data?.vendorService?.available === true ?
                          "True"
                        :
                        data?.vendorService?.available === false &&
                          "False"
                      : 
                        "NA"
                    }
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography 
                      className="small-text name-icon"
                      variant="p"
                    >
                      {
                        (data?.vendorDetails?.hasOwnProperty("isVerified") && data?.vendorDetails?.isVerified) ?
                          <VerifiedUserIcon className="details-icon" />
                        :
                          <GppMaybeIcon className="details-icon" />
                      }
                      Is Verified :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {
                      data?.vendorDetails?.hasOwnProperty("isVerified") ? 
                        data?.vendorDetails?.isVerified === true ?
                          "True"
                        :
                        data?.vendorDetails?.isVerified === false &&
                          "False"
                      : 
                        "NA"
                    }
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography 
                      className="small-text name-icon"
                      variant="p"
                    >
                      <QuestionAnswerIcon className="details-icon" /> 
                      Bio :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {data?.vendorService?.bio ? data?.vendorService?.bio : "NA"}
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography 
                      className="small-text name-icon" 
                      variant="p"
                    >
                      <MiscellaneousServicesIcon className="details-icon" />{" "}
                      Service :
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      className="small-text vendor-detail-value"
                      variant="p"
                    >
                      {
                        data?.vendorService?.service &&
                        data?.vendorService?.service?.length ?
                          data?.vendorService?.service[0].name
                        : 
                          "NA"
                      }
                    </Typography>
                  </div>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography 
                      className="small-text name-icon"
                      variant="p"
                    >
                      <LanguageIcon className="details-icon" />
                      Languages :
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      className="small-text vendor-detail-value"
                      variant="p"
                    >
                      {
                        data?.vendorService?.languages?.length ?
                          data?.vendorService?.languages?.map((lang, i) =>
                            data?.vendorService?.languages?.length - 1 === i ? 
                              lang.name
                            : 
                              `${lang.name + ", "}`
                          )
                        : 
                          "NA"
                      }
                    </Typography>
                  </div>
                </div>
                <span className="span-line"></span>
              </div>
              <div className="card-details">
                <div className="icon-and-details-main">
                  <div className="icon-main">
                    <Typography 
                      className="small-text name-icon"
                      variant="p"
                    >
                      <StarIcon className="details-icon" />
                      Average Rating :
                    </Typography>
                  </div>
                  <Typography
                    className="small-text vendor-detail-value"
                    variant="p"
                  >
                    {
                      (data?.hasOwnProperty("avgRatting") && data.avgRatting !== undefined) ?
                        data?.avgRatting
                      : 
                        "NA"
                    }
                  </Typography>
                </div>
                <span className="span-line"></span>
              </div>
            </div>
          }

          {/* Edit-vendor-personal-info-modal : start */}
          <div>
            <Modal
              size="lg"
              className="all-modals"
              isOpen={editPersonalInfoModal}
            >
              <ModalHeader>
                Edit Personal Information
              </ModalHeader>
              <ModalBody>
                <Grid container>
                  <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                    <form action="">
                      <Grid container spacing={2}>
                        <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                          <div>
                            <p className="small-text">
                              First name :
                            </p>
                            <input
                              className="input-main"
                              type="text"
                              name="firstName"
                              value={firstName}
                              onChange={(e) => this.handleChange(e)}
                              placeholder="First Name"
                            />
                            {error.includes("firstNameError") &&
                              <p className="error-message">
                                Firstname is required!
                              </p>
                            }
                          </div>
                        </Grid>
                        <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                          <div>
                            <p className="small-text">
                              Last name :
                            </p>
                            <input
                              className="input-main"
                              type="text"
                              name="lastName"
                              value={lastName}
                              onChange={(e) => this.handleChange(e)}
                              placeholder="Last Name"
                            />
                            {error.includes("lastNameError") &&
                              <p className="error-message">
                                Lastname is required!
                              </p>
                            }
                          </div>
                        </Grid>
                        <Grid item lg={6} xs={12} sm={12} md={6} xl={6}>
                          <div>
                            <p className="small-text">
                              Mobile number :
                            </p>
                            <input
                              className="input-main"
                              type="number"
                              name="mobile"
                              value={mobile}
                              onChange={(e) => this.handleChange(e)}
                              placeholder="Mobile Number"
                            />
                            {error?.includes("mobileError") &&
                              <p className="error-message">
                                Mobile number is required
                              </p>
                            }
                            {error?.includes("mobileInvalidError") &&
                              <p className="error-message">
                                Mobile number is invalid!
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
                            {error.includes("addressLine2Error") &&
                              <p className="error-message">
                                AddressLine2 is required!
                              </p>
                            }
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
                              getOptionLabel={(option) => option.name ? option.name : ''}
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
                              getOptionLabel={(option) => option.name ? option.name : ''}
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
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="btn btn-colored small-text-white"
                  onClick={() => this.validateEditPersonalInfo()}
                >
                  edit
                </Button>
                <Button
                  className="btn btn-border small-text-color"
                  onClick={() => this.closeModal("personalInfo")}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
          {/*Edit-vendor-personal-info-modal: end */}

          {/* Edit-detail-info-modal : start */}
          <div>
            <Modal
              size="lg"
              className="all-modals"
              isOpen={editDetailInfoModal}
            >
              <ModalHeader>
                Edit Detail Information
              </ModalHeader>
              <ModalBody>
                <Grid container>
                  <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                    <form action="">
                      <Grid container spacing={2}>
                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                          <div>
                            <p className="small-text">
                              Physical silver fees(₹) :
                            </p>
                            <input
                              className="input-main"
                              type="number"
                              name="physicalSilverFees"
                              value={physicalSilverFees}
                              onChange={(e) => this.handleChange(e)}
                              placeholder="Physical silver fees(₹)"
                            />
                            {error.includes("physicalSilverError") &&
                              <p className="error-message">
                                Physical silver fees is required!
                              </p>
                            }
                            {error.includes("physicalSilverInvalidError") &&
                              <p className="error-message">
                                Physical silver fees is invalid
                              </p>
                            }
                          </div>
                        </Grid>
                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                          <div>
                            <p className="small-text">
                              Virtual gold fees(₹) :
                            </p>
                            <input
                              className="input-main"
                              type="number"
                              name="virtualGoldFees"
                              value={virtualGoldFees}
                              onChange={(e) => this.handleChange(e)}
                              placeholder="Virtual gold fees(₹)"
                            />
                            {error.includes("virtualGoldError") &&
                              <p className="error-message">
                                Virtual gold fees is required!
                              </p>
                            }
                            {error.includes("virtualGoldInvalidError") &&
                              <p className="error-message">
                                Virtual gold fees is invalid
                              </p>
                            }
                          </div>
                        </Grid>
                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                          <div>
                            <p className="small-text">
                              Virtual silver fees(₹) :
                            </p>
                            <input
                              className="input-main"
                              type="number"
                              name="virtualSilverFees"
                              value={virtualSilverFees}
                              onChange={(e) => this.handleChange(e)}
                              placeholder="Virtual silver fees(₹)"
                            />
                            {error.includes("virtualSilverError") &&
                              <p className="error-message">
                                Virtual silver fees is required!
                              </p>
                            }
                            {error.includes("virtualSilverInvalidError") &&
                              <p className="error-message">
                                Virtual silver fees is invalid
                              </p>
                            }
                          </div>
                        </Grid>
                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                          <div>
                            <p className="small-text">
                              Service category :
                            </p>
                            <Autocomplete
                              id="country-select-demo"
                              name="service"
                              value={service}
                              options={allServiceData}
                              autoHighlight
                              onChange={(e, val) =>
                                this.handleDropDownChange(e, val, "service")
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
                                  className="country-dropdown"
                                  {...params}
                                  label="Service category"
                                  placeholder="Choose a service category"
                                  inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                  }}
                                />
                              )}
                            />
                            {/* error message to be show for empty/invalid service */}
                            {error.includes("serviceError") &&
                              <p className="error-message">
                                Service category is required!
                              </p>
                            }
                          </div>
                        </Grid>
                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                          <div>
                            <p className="small-text">
                              Languages :
                            </p>
                            <Autocomplete
                              multiple
                              id="tags-outlined"
                              value={languages}
                              options={languageData}
                              getOptionLabel={(option) => option.name}
                              onChange={(e, val) =>
                                this.handleDropDownChange(e, val, "languages")
                              }
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Languages"
                                  className="auto-text"
                                  placeholder="Choose Languages"
                                />
                              )}
                            />
                            {/* error message to be show for empty/invalid language */}
                            {error.includes("languagesError") &&
                              <p className="error-message">
                                Language is required!
                              </p>
                            }
                          </div>
                        </Grid>
                        <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                          <div>
                            <p className="small-text">
                              Instruction :
                            </p>
                            <textarea
                              className="input-main"
                              type="text"
                              name="instruction"
                              value={instruction}
                              onChange={(e) => this.handleChange(e)}
                              placeholder="Instruction"
                            />
                            {error.includes("instructionError") &&
                              <p className="error-message">
                                Instruction is required!
                              </p>
                            }
                          </div>
                        </Grid>
                        <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                          <div>
                            <p className="small-text">
                              Bio :
                            </p>
                            <textarea
                              className="input-main"
                              type="text"
                              name="bio"
                              value={bio}
                              onChange={(e) => this.handleChange(e)}
                              placeholder="Bio"
                            />
                            {error.includes("bioError") &&
                              <p className="error-message">
                                Bio is required!
                              </p>
                            }
                          </div>
                        </Grid>
                        <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                          <div>
                            <p className="small-text">
                              Available :
                            </p>
                            <Autocomplete
                              id="country-select-demo"
                              name="isAvailable"
                              value={isAvailable}
                              options={availableData}
                              autoHighlight
                              onChange={(e, val) =>
                                this.handleDropDownChange(e, val, "available")
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
                                  label="Available"
                                  placeholder="Choose available status"
                                  inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                  }}
                                />
                              )}
                            />
                            {/* error message to be show for empty/invalid available status */}
                            {error?.includes("availableError") &&
                              <p className="error-message">
                                Available status is required!
                              </p>
                            }
                          </div>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="btn btn-colored small-text-white"
                  onClick={() => this.validateEditDetailInfo()}
                >
                  edit
                </Button>
                <Button
                  className="btn btn-border small-text-color"
                  onClick={() => this.closeModal("detailInfo")}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
          {/*Edit-detail-info-modal: end */}
        </div>
      </div>
    );
  }
}

export default withRouter(PersonalInformation);