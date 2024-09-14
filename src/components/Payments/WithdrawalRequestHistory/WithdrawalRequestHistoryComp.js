import { Button, CircularProgress, Grid, TextField, InputAdornment } from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
import { withdrawalRequestHistoryData } from '../../../helpers/renderData';
import { toastAlert } from '../../../helpers/toastAlert';
import { editWithdrawalRequestHistory, getWithdrawalRequestHistory, getWithdrawalRequestHistoryByVendor } from '../../../services/paymentService';
import Datatable from '../../CommonComponents/Datatable/Datatable';
import { Box } from "@mui/system";
import DateTimePicker from 'react-datetime-picker';
import BreadcrumbComp from '../../CommonComponents/Breadcrumb/Breadcrumb';
import { getAllVerifiedVendors } from '../../../services/userService';
import DateRangeIcon from '@mui/icons-material/DateRange';
import moment from "moment";
import "./style.css"

class WithdrawalRequestHistoryComp extends Component {
  constructor() {
    super();
    this.state = {
        status: [],
        options: [
            {
                label: "Requested",
                value: "requested"
            },
            {
                label: "In-Progress",
                value: "in-progress"
            },
            {
                label: "Completed",
                value: "completed"
            },
            {
                label: "Rejected",
                value: "rejected"
            }                
        ],
        loading: false,
        error: [],
        tableData: {},
        page: 1,
        rowsPerPage : 10,
        count: 1,
        modal : false,
        amount : 0,
        transferId : "",
        transferDate : "",
        remarks : "",
        selectedId : "",
        selectedStatus : {},
        vendorData : [],
        selectedVendor: {}
    }
  }

  handleSubmit = () => {
    let error = [];
    if (!this.state?.status?.length || !this.state?.status) {
      error.push("statusError")
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
      },() => this.apiCall(this.state.page,this.state.rowsPerPage))
    }
  }

  apiCall = (page,rowsPerPage) => {
    if(this.state.selectedVendor && this.state.selectedVendor.hasOwnProperty("_id")) {
      this.getWithdrawalRequestHistoryByVendor(page,rowsPerPage)
    }else{
      this.getWithdrawalRequestHistory(page,rowsPerPage)
    }
  }

  handleDropDownChange = (e, val, type) => {
    if(type === "status" ) {
      this.setState({
        status: val,
      },() => this.handleSubmit())
    } else if(type === "vendor") {
      this.setState({
        selectedVendor: val
      },() => this.handleSubmit())
    }
  }

  handleEditDropdownChange = (e,val) => {
    this.setState({
      selectedStatus : val,
    })
  }

  componentDidMount() {
    this.setState({
        status: this.state.options,
        loading: true
    }, () => {  
      let promises = [];
      
      promises.push(this.getWithdrawalRequestHistory(this.state.page,this.state.rowsPerPage));
      promises.push(this.getAllVerifiedVendors());
      
      Promise.all(promises).then((res) => {
        console.log("set the loader to false");
        this.setState({ loading: false })
      }).catch(err => {
        this.setState({ loading: false })
        console.log(err,"err")
      })
    })
  }

  changePage = (page,rowsPerPage) => {
    this.setState({
        loading: true,
        rowsPerPage
    },() => this.apiCall(page,rowsPerPage));
  };

  getAllVerifiedVendors = async() => {
    try {
      let verifiedVendors = await getAllVerifiedVendors(this.props);

      if (verifiedVendors && verifiedVendors.statusCode == 200) {
        this.setState({
            vendorData : verifiedVendors.data,
        })
      } else {
        // error
        console.log('error fetching vendors : ', verifiedVendors, verifiedVendors.message);
        let message = verifiedVendors && verifiedVendors.message !== undefined ? verifiedVendors.message : "Problem Fetching Records.";
        toastAlert(message, "error");
      }
    } catch (error) {
      console.log('error catch block', error);
      toastAlert("Please check Internet Connection.", "error");
    }
  }

  getWithdrawalRequestHistory = async (page,rowsPerPage) => {
    try {
        let withdrawalRequests = await getWithdrawalRequestHistory({
            page: page,
            limit: rowsPerPage ? rowsPerPage : 10,
            status: this.state.status.map((data) => data.value),
        }, this.props);
        console.log('withdrawalRequests ', withdrawalRequests);
        if (withdrawalRequests && withdrawalRequests.statusCode == 200) {
          this.setState({
            count: withdrawalRequests?.data?.totalRecords[0]?.count,
            page: page,
            data : withdrawalRequests.data.data,
          })
          let tableData = await withdrawalRequestHistoryData(withdrawalRequests.data.data, this);
          this.setState({
            tableData,
            loading : false,
          })
        } else {
            // error
            console.log('error fetching withdrawal request history : ', withdrawalRequests, withdrawalRequests.message);
            let message = withdrawalRequests && withdrawalRequests.response.data.message !== undefined ? withdrawalRequests.response.data.message : "Problem Fetching Withdrawal Request History.";
            toastAlert(message, "error");
            this.setState({
              tableData : {},
              loading : false
            });
        }
    } catch (error) {
        console.log('error catch block', error);
        this.setState({
          loading : false
        })
        toastAlert("Please check Internet Connection.", "error");
    }
  }

  getWithdrawalRequestHistoryByVendor = async (page,rowsPerPage) => {
    try {
        let withdrawalRequestsByVendor = await getWithdrawalRequestHistoryByVendor({
            page: page,
            limit: rowsPerPage ? rowsPerPage : 10,
            status: this.state.status.map((data) => data.value),
            vendorId : this.state.selectedVendor._id
        }, this.props);
        console.log('withdrawalRequestsByVendor ', withdrawalRequestsByVendor);
        if (withdrawalRequestsByVendor && withdrawalRequestsByVendor.statusCode == 200) {
          this.setState({
            count: withdrawalRequestsByVendor?.data?.withdrawalRequests.totalRecords[0]?.count,
            page: page,
            data : withdrawalRequestsByVendor.data.withdrawalRequests.data,
          })
          let tableData = await withdrawalRequestHistoryData(withdrawalRequestsByVendor.data.withdrawalRequests.data, this);
          this.setState({
            tableData,
            loading : false,
          })
        } else {
            // error
            console.log('error fetching withdrawal request history : ', withdrawalRequestsByVendor, withdrawalRequestsByVendor.message);
            let message = withdrawalRequestsByVendor && withdrawalRequestsByVendor.response.data.message !== undefined ? withdrawalRequestsByVendor.response.data.message : "Problem Fetching Withdrawal Request History.";
            toastAlert(message, "error");
            this.setState({
              tableData : {},
              loading : false
            });
        }
    } catch (error) {
        console.log('error catch block', error);
        this.setState({
          loading : false
        })
        toastAlert("Please check Internet Connection.", "error");
    }
  }

  openEditWithdrawalRequestModal = (id) => {
    this.state.data.map((val) => {
      if(val._id === id) {
        let selectedStatus = this.state.options.filter((data) => data.value === val.status);
        this.setState({
          amount : val?.amount,
          transferId : "",
          transferDate : "",
          selectedId : val?._id,
          remarks : val?.remark ? val?.remark : "",
          selectedStatus : selectedStatus?.length ? selectedStatus[0] : {},
          modal : true
        })
      }
    });
  }

  closeEditWithdrawalRequestModal = () => {
    this.setState({
      amount : 0,
      transferId : "",
      transferDate : "",
      selectedId : "",
      remarks : "",
      selectedStatus : {},
      modal : false
    })
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name] : evt.target.value
    })
  }

  handleDateAndTimeChange = (name, value) => {
    this.setState({
        [name]: value
    })
  };

  handleEditSubmit = () => {
    let error = [];
    const { selectedStatus, transferDate, transferId } = this.state;
    if(!selectedStatus) {
      error.push("editStatusError")
    }
    if(selectedStatus.hasOwnProperty("value") && selectedStatus.value === "requested") {
      error.push("invalidStatusError");
    }
    if(selectedStatus.hasOwnProperty("value") && selectedStatus.value === "completed") {
      if(!transferId?.trim() || !transferId) {
        error.push("transferIdRequire");
      }
      if(!transferDate) {
        error.push("transferDateRequire");
      }
      if(!error.includes("transferDateRequire")) {
        let currentDateObj = moment(new Date());
        let transferDateObj = moment(transferDate);
        if(currentDateObj.isBefore(transferDateObj)) {
          error.push('invalidTransferDate');
        }
      }
    }
    if(error.length > 0) {
      this.setState({
        error,
      });
    }else {
      this.setState({
        error: [],
      },() => this.editWithdrawalRequest());
    }
  }

  editWithdrawalRequest = async () => {
    let { selectedId, selectedStatus, transferDate, transferId, remarks, page, rowsPerPage } = this.state;

    let body = {
      referenceId : selectedId,
      status : selectedStatus.value,
    }
    if(remarks.trim().length) {
      body.remark = remarks
    }
    if(selectedStatus.value === "completed") {
      body.transferId = transferId
      body.transferDate = moment(transferDate).utc().format("YYYY-MM-DD HH:mm:ss");
    }
    try {
      let res = await editWithdrawalRequestHistory(body, this.props);
      // passed props to editWithdrawalRequestHistory function so it can redirect this props to clearCookie() function

      if(res && res?.statusCode == 200) {
        toastAlert(res?.message ? res?.message : "Withdrawal Request updated successfully", "success")
        this.closeEditWithdrawalRequestModal();
        this.getWithdrawalRequestHistory(page,rowsPerPage);
      } else {
        // error
        console.log('error updating withdrawal request : ', res, res.message);
        let message = res && res.response.data.message !== undefined ? res.response.data.message : "Problem while updating withdrawal request history.";
        toastAlert(message, "error");
        this.closeEditWithdrawalRequestModal();
      }
    } catch (error) {
      console.log('error catch block', error);
      toastAlert("Please check Internet Connection.", "error");
      this.closeEditWithdrawalRequestModal();
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
          name: "Withdrawal Request History",
          active: true,
          link: ""
        }
      ]
    )
  }

  render() {
      const {
          status,
          loading,
          options,
          error,
          tableData,
          modal,
          amount,
          transferId,
          transferDate,
          remarks,
          selectedId,
          selectedStatus,
          vendorData,
          selectedVendor
      } = this.state
      return (
        <div>
          {/* Breadcrumb component :: start  */}
            <BreadcrumbComp items={this.itemArray()} />
          {/* Breadcrumb component :: end  */}
          <Grid container style={{ marginTop: "30px" }} spacing={2}>
              <Grid item lg={8} xs={12} sm={8} md={8} xl={8}>
                <div>
                    <Autocomplete
                        multiple
                        className='booking-auto'
                        id="tags-outlined"
                        value={status}
                        options={options}
                        getOptionLabel={(option) => option.label}
                        onChange={(e, val) =>
                          this.handleDropDownChange(e, val, "status")
                        }
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Withdrawal Request Status"
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
              <Grid item lg={4} xs={12} sm={4} md={4} xl={4}>
                <div>
                  <Autocomplete
                    className='booking-auto'
                    name="selectedVendor"
                    value={selectedVendor}
                    options={vendorData}
                    autoHighlight
                    onChange={(e, val) =>
                        this.handleDropDownChange(e, val, "vendor")
                    }
                    getOptionLabel={(option) => `${option.firstName ? option.firstName : ""} ${option.lastName ? option.lastName : ""}`}
                    renderOption={(props, option) => (
                        <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                            key={option._id}
                        >
                          {option.firstName ? option.firstName : ""} {option.lastName ? option.lastName : ""}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            className="country-dropdown"
                            {...params}
                            label="Vendor Name"
                            placeholder="Select Vendor"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                            }}
                        />
                    )}
                  />
                </div>
              </Grid>
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
                        title={"Withdrawal Request History"}
                      />
                  }
              </div>
            </Grid>
          </Grid>

          <div>
            <Modal
              className='all-modals'
              isOpen={modal}
            >
              <ModalHeader className='card-title'>
                Edit Withdrawal Request
              </ModalHeader>
              <ModalBody>
                  <Grid container spacing={2}>
                      <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                          <p className="small-text">
                            Withdrawal Request Id
                          </p>
                          <div>
                            <input 
                              className="input-main"
                              type="Text"
                              disabled={true}
                              value={selectedId} 
                              name="Request Id" 
                              placeholder='Withdrawal Request Id'
                            />
                          </div>
                      </Grid>
                      <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                          <p className="small-text">
                            Amount
                          </p>
                          <div>
                            <input 
                              className="input-main" 
                              type="number"
                              disabled={true}
                              value={amount} 
                              name="Amount" 
                              placeholder='Withdrawal Request Id'
                            />
                          </div>
                      </Grid>
                      <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                          <p className="small-text">
                            Withdrawal Request Status
                          </p>
                          <Autocomplete
                            className='booking-auto'
                            name="selectedStatus"
                            value={selectedStatus}
                            options={options}
                            autoHighlight
                            onChange={(e, val) => this.handleEditDropdownChange(e,val)}
                            getOptionLabel={(option) => option?.label ? option?.label : ""}
                            renderOption={(props, option) => (
                              <Box
                                component="li"
                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                {...props}
                              >
                                {option?.label ? option?.label : ""}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                  className="country-dropdown"
                                  {...params}
                                  label="Withdrawal Request Status"
                                  placeholder="select withdrawal request status"
                                  inputProps={{
                                      ...params.inputProps,
                                      autoComplete: "new-password", // disable autocomplete and autofill
                                  }}
                              />
                            )}
                          />
                          {error.includes("editStatusError") &&
                              <p className="error-message">
                                  Status is required!
                              </p>
                          }
                          {error.includes("invalidStatusError") &&
                              <p className="error-message">
                                  Status shouldn't be requested
                              </p>
                          }
                      </Grid>
                      {
                        this.state?.selectedStatus?.hasOwnProperty("value") && this.state?.selectedStatus?.value === "completed" ?
                          <>
                            <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                              <p className="small-text">
                                Transfer Id
                              </p>
                              <div>
                                <textarea
                                  className="input-main" 
                                  type="text" 
                                  name="transferId" 
                                  value={transferId}
                                  placeholder='Enter Transfer Id' 
                                  onChange={(evt) => this.handleChange(evt)}
                                />
                              </div>
                              {error.includes("transferIdRequire") &&
                                <p className="error-message">
                                  Transfer Id is required!
                                </p>
                              }
                            </Grid>
                            <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                              <p className="small-text">
                                Transfer Date
                              </p>
                              <div>
                                <DateTimePicker
                                  className="input-main"
                                  format={'yyyy/MM/dd hh:mm:ss aa'}
                                  onChange={(date) => this.handleDateAndTimeChange('transferDate', date)}
                                  maxDate={new Date()}
                                  value={transferDate}
                                  disableClock={true}
                                  calendarIcon={
                                      <InputAdornment
                                          position="start"
                                          className="input_filed_wrapper_icon"
                                      >
                                          <DateRangeIcon style={{color:"#fff"}}/>
                                      </InputAdornment>
                                  }
                                />
                              </div>
                              {error.includes("transferDateRequire") &&
                                <p className="error-message">
                                  Transfer Date is required!
                                </p>
                              }
                              {error.includes("invalidTransferDate") &&
                                <p className="error-message">
                                  Transfer Date should be less than current date
                                </p>
                              }
                            </Grid>
                          </>
                        :null
                      }
                      <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                          <p className="small-text">
                            Remark
                          </p>
                          <div>
                            <textarea
                              rows={5}
                              className="input-main"
                              type="text" 
                              name="remarks" 
                              value={remarks}
                              placeholder='Remark' 
                              onChange={(evt) => this.handleChange(evt)} 
                            />
                          </div>
                      </Grid>
                  </Grid>
              </ModalBody>
              <ModalFooter>
                  <Button 
                    className='btn btn-colored small-text-white'
                    onClick={() => this.handleEditSubmit()}
                  >
                    Edit
                  </Button>
                  <Button
                    className='btn btn-border small-text-color'
                    onClick={() => this.closeEditWithdrawalRequestModal()}
                  >
                    Cancel
                  </Button>
              </ModalFooter>
            </Modal>
          </div>
        </div>
        
      )
  }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(WithdrawalRequestHistoryComp))