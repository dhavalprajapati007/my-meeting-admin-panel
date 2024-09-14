import React, { Component } from 'react';
import { Box, Button } from '@material-ui/core';
import { Autocomplete, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { withRouter } from 'react-router-dom';
import { getVendors, sendMail } from "../../services/userService";
import { toastAlert } from "../../helpers/toastAlert";
import BreadcrumbComp from '../CommonComponents/Breadcrumb/Breadcrumb';
import { connect } from 'react-redux';

class MailComp extends Component {
  constructor() {
    super();
    this.state = {
      sendMailLoader: false,
      count: 1,
      vendorCategory : [
        {
          label : "Place Vendors",
          value : 1
        },
        {
          label : "Service Vendors",
          value : 2
        },
        {
          label : "Place & Service Vendors",
          value : 3
        },
        {
          label : "Non-Provider",
          value : 0
        }
      ],
      vendorStatus : [
        {
          label : "Verified",
          value : true
        },
        {
          label : "Pending",
          value : false
        }
      ],
      error : [],
      selectedCategory : [],
      selectedStatus : {},
      vendorData : [],
      selectedEmail : [],
      subject : '',
      message : ''
    }
  }

  itemArray = () => {
    return (
      [
        {
            name: "Mail",
            active: false,
            link: ""
        },
        {
            name: "Send Mail",
            active: true,
            link: ""
        }
      ]
    )
  }

  handleDropDownChange = (e, val, type) => {
    if(type === "category" ) {
      this.setState({
        selectedCategory: val,
      },() => this.validateInput())
    } else if(type === "status") {
      this.setState({
        selectedStatus: val
      },() => this.validateInput())
    } else if(type === "email") {
      this.setState({
        selectedEmail: val
      })
    }
  }

  validateInput = () => {
    let error = [];
    if (!this.state?.selectedCategory?.length || !this.state?.selectedCategory) {
      error.push("categoryError")
    }
    if(!this.state.selectedStatus || !this.state.selectedStatus.hasOwnProperty("value")) {
      error.push("statusError")
    }
    if(error.length > 0) {
      this.setState({
        error,
      });
    } else {
      this.setState({
          error: [],
      },() => this.getVendors())
    }
  }

  validateMailDetails = () => {
    const { selectedEmail, subject, message } = this.state;
    let error = [];
    if (!selectedEmail?.length || !selectedEmail) {
      error.push("emailError");
    }
    if(!subject || !subject.trim()) {
      error.push("subjectError");
    }
    if(!message || !message.trim()) {
      error.push("messageError");
    }
    if(error.length > 0) {
      this.setState({
        error,
      });
    } else {
      this.setState({
        error: [],
        sendMailLoader : true
      } ,() => this.sendMail())
    }
  }

  sendMail = async () => {
    try {
      const { selectedEmail, subject, message} = this.state;
      let body = {
        email : selectedEmail?.map((data) => data.email),
        subject : subject.trim(),
        message : message.trim()
      }
      let res = await sendMail(body, this.props);
      if (res && res?.statusCode == 200) {
        toastAlert(
          res?.message
            ? res?.message
            : "Email sent successfully"
        );
        this.setState({ sendMailLoader : false });
      } else {
        // error
        console.log("error while send mail : ", res, res.message);
        let message =
          res && res.message !== undefined
            ? res.message
            : "Problem while send mail.";
        toastAlert(message, "error");
        this.setState({ sendMailLoader : false });
      }
    } catch (error) {
      console.log("error catch block", error);
      toastAlert("Please check Internet Connection.", "error");
      this.setState({ sendMailLoader : false });
    }
  }

  getVendors = async() => {
    const { selectedStatus, selectedCategory } = this.state;
    try {
      if (selectedCategory.length === 1 && selectedCategory[0].value === 1 && selectedStatus?.value === false) {
        toastAlert("Place vendor will be always verified.", "warning");
        return;
      }

      if (selectedCategory.length === 1 && selectedCategory[0].value === 0 && selectedStatus?.value === true) {
        toastAlert("Non-Provider Vendor can't be verified.", "warning");
        return;
      }

      let vendors = await getVendors({
        verified: selectedStatus.hasOwnProperty("value") ? selectedStatus.value : false,
        providerType: selectedCategory?.map((data) => data.value)
      }, this.props);
      
      if (vendors && vendors.statusCode == 200) {
        this.setState({
          vendorData : vendors?.data?.length ? vendors?.data : []
        })
      } else {
        // error
        console.log('error fetching vendors : ', vendors, vendors.message);
        let message = vendors && vendors.message !== undefined ? vendors.message : "Problem Fetching Records.";
        toastAlert(message, "error");
      }
    } catch (error) {
      console.log('error catch block', error);
      toastAlert("Please check Internet Connection.", "error");
    }
  }

  componentDidMount() {
    this.setState({
      selectedCategory : this.state.vendorCategory,
      selectedStatus : this.state.vendorStatus[0]
    },() => this.getVendors())
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { sendMailLoader, vendorCategory, vendorStatus, error, selectedStatus, selectedCategory, selectedEmail, vendorData, subject, message } = this.state
    return (
      <div>
        <BreadcrumbComp items={this.itemArray()} />

        <Grid container style={{ marginTop: "30px" }} spacing={2}>
          <Grid item lg={8} xs={12} sm={8} md={8} xl={8}>
            <div>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    value={selectedCategory}
                    options={vendorCategory}
                    getOptionLabel={(option) => option.label ? option.label : "" }
                    onChange={(e, val) =>
                      this.handleDropDownChange(e, val, "category")
                    }
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Vendor Category"
                            placeholder="select category"
                            className='small-text'
                        />
                    )}
                />
                {error.includes("categoryError") &&
                  <p className="error-message">
                    Vendor category is required!
                  </p>
                }
            </div>
          </Grid>
          <Grid item lg={4} xs={12} sm={4} md={4} xl={4}>
            <div>
              <Autocomplete
                  id="tags-outlined"
                  value={selectedStatus}
                  options={vendorStatus}
                  getOptionLabel={(option) => option?.label ? option?.label : ""}
                  onChange={(e, val) =>
                    this.handleDropDownChange(e,val,"status")
                  }
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vendor Status"
                      placeholder="select status"
                      className='small-text'
                    />
                  )}
              />
              {error.includes("statusError") &&
                <p className="error-message">
                  Vendor status is required!
                </p>
              }
            </div>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: "20px" }} spacing={2}>
          <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
            <div>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    value={selectedEmail}
                    options={vendorData}
                    getOptionLabel={(option) => option.email ? option.email : "" }
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...props}
                        key={option._id}
                      >
                        {option.email ? option.email : ""} -- {option?.firstName ? option?.firstName : ""} {option?.lastName ? option?.lastName : ""}
                      </Box>
                    )}
                    onChange={(e, val) =>
                      this.handleDropDownChange(e, val, "email")
                    }
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Email Id"
                            placeholder="Recipients"
                            className='small-text'
                        />
                    )}
                />
                {error.includes("emailError") &&
                  <p className="error-message">
                    Recipient mail is required!
                  </p>
                }
            </div>
          </Grid>
          <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
            <div>
              <textarea
                className="input-main"
                type="text"
                name="subject"
                value={subject}
                onChange={(e) => this.handleChange(e)}
                placeholder="Subject"
              />
              {error.includes("subjectError") &&
                <p className="error-message">
                  Subject is required!
                </p>
              }
            </div>
          </Grid>
          <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
            <div>
              <textarea
                className="input-main"
                type="text"
                name="message"
                value={message}
                onChange={(e) => this.handleChange(e)}
                placeholder="Message"
              />
              {error.includes("messageError") &&
                <p className="error-message">
                  Message is required!
                </p>
              }
            </div>
          </Grid>
          <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
            <div>
              <Button
                className="btn btn-colored small-text-white"
                onClick={() => this.validateMailDetails()}
              >
                {
                  sendMailLoader ?
                      <CircularProgress 
                        style={{ color: "white" }} 
                        size={20} 
                      />
                    :
                      "Send Mail"
                }
              </Button>
            </div>
          </Grid>
        </Grid>
      </div >
    );
  }
}

const mapStateToProps = (state) => ({
  authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(MailComp))