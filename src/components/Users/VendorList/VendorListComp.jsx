import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { Autocomplete, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { withRouter } from 'react-router-dom';
import "./style.css"
import Datatable from '../../CommonComponents/Datatable/Datatable';
import { deleteVendor, getVendors, verifyVendor } from "../../../services/userService";
import { toastAlert } from "../../../helpers/toastAlert";
import { vendorListData } from "../../../helpers/renderData"
import BreadcrumbComp from '../../CommonComponents/Breadcrumb/Breadcrumb';
import { connect } from 'react-redux';
import Delete from "../../../assets/images/Delete.png"
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class VendorListComp extends Component {
  constructor() {
    super();
    this.state = {
      tableData: {},
      loading: true,
      providerType: 2,
      page: 1,
      rowsPerPage : 10,
      count: 1,
      verifyLoader : false,
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
      deleteModal : false,
      deleteVendorId : ""
    }
  }

  itemArray = () => {
    const { selectedStatus, selectedCategory } = this.state;
    return (
      [
        {
          name: "Users",
          active: false,
          link: ""
        },
        {
          name: "Vendors",
          active: false,
          link: ""
        },
        {
          name: selectedStatus.value ? "All Verified Vendors" : "All Pending Vendors",
          active: false,
          link: ""
        },
        {
          name: `${selectedCategory.map((data) => data.label).join(", ")}`,
          active: true,
          link: ""
        }
      ]
    )
  }

  changePage = (page,rowsPerPage) => {
    this.setState({
      loading: true,
      rowsPerPage : rowsPerPage
    });
    this.getVendors(page,rowsPerPage)
  };

  handleDropDownChange = (e, val, type) => {
    if(type === "category" ) {
      this.setState({
        selectedCategory: val,
      },() => this.validateInput())
    } else if(type === "status") {
      this.setState({
        selectedStatus: val
      },() => this.validateInput())
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
          loading: true,
          page : 1
      },() => this.getVendors(this.state.page,this.state.rowsPerPage))
    }
  }

  openDeleteModal = (id) => {
    this.setState({
      deleteVendorId : id,
      deleteModal : true
    })
  }

  closeDeleteModal = () => {
    this.setState({
      deleteVendorId : "",
      deleteModal : false
    })
  }

  deleteVendor = async () => {
    try {
        const res = await deleteVendor(this.state.deleteVendorId, this.props);
        // passed stateData as props to function so it can prepare payload from this data

        if (res && res?.statusCode == 200) {
            toastAlert(
                res?.message
                    ? res?.message
                    : "Vendor deleted successfully"
            );
            this.closeDeleteModal();
            this?.getVendors(this.state.page,this.state.rowsPerPage);
        } else {
            // error
            console.log("error deleting vendor : ", res, res.message);
            let message =
                res && res.response.data.message !== undefined
                    ? res.response.data.message
                    : "Problem while deleting vendor";
            toastAlert(message, "error");
            this.closeDeleteModal();
        }
    } catch (error) {
        console.log("error catch block", error);
        toastAlert("Please check Internet Connection.", "error");
        this.closeDeleteModal();
    }
  }

  getVendors = async(page,rowsPerPage) => {
    const { selectedStatus, selectedCategory } = this.state;
    try {
      if (selectedCategory.length === 1 && selectedCategory[0].value === 1 && selectedStatus?.value === false) {
        this.setState({ loading: false });
        toastAlert("Place vendor will be always verified.", "warning");
        return;
      }

      if (selectedCategory.length === 1 && selectedCategory[0].value === 0 && selectedStatus?.value === true) {
        this.setState({ loading: false });
        toastAlert("Non-Provider Vendor can't be verified.", "warning");
        return;
      }

      let vendors = await getVendors({
        page: page,
        limit: rowsPerPage ? rowsPerPage : 10,
        verified: selectedStatus.hasOwnProperty("value") ? selectedStatus.value : false,
        providerType: selectedCategory?.map((data) => data.value)
      }, this.props);
      
      if (vendors && vendors.statusCode == 200) {
        this.setState({
          count: vendors.totalCount,
          page: page
        })
        let tableData = await vendorListData(vendors.data, this);
        this.setState({
          tableData,
          loading: false
        })
      } else {
        // error
        console.log('error fetching vendors : ', vendors, vendors.message);
        let message = vendors && vendors.message !== undefined ? vendors.message : "Problem Fetching Records.";
        toastAlert(message, "error");
        this.setState({ loading: false });
      }
    } catch (error) {
      console.log('error catch block', error);
      toastAlert("Please check Internet Connection.", "error");
      this.setState({ loading: false });
    }
  }

  verifyVendor = async (id,verify) => {
    this.setState({
      verifyLoader : true
    })
    try {

      let vendorVerification = await verifyVendor(id,verify,this.props);
      
      if (vendorVerification && vendorVerification.statusCode == 200) {
        toastAlert(vendorVerification?.message ? vendorVerification?.message : "Vendor verified successfully", "success")
        this.setState({
          verifyLoader : false
        }, () => this.getVendors(this.state.page,this.state.rowsPerPage))
      } else {
        // error
        console.log('error in vendor verification : ', vendorVerification, vendorVerification.message);
        let message = vendorVerification && vendorVerification.message !== undefined ? vendorVerification.message : "Problem Fetching Records.";
        toastAlert(message, "error");
        this.setState({ verifyLoader : false });
      }
    } catch (error) {
      console.log('error catch block', error);
      toastAlert("Please check Internet Connection.", "error");
      this.setState({ verifyLoader: false });
    }
  }

  componentDidMount() {
    this.setState({
      selectedCategory : this.state.vendorCategory,
      selectedStatus : this.state.vendorStatus[0]
    },() => this.getVendors(this.state.page,this.state.rowsPerPage))
  }

  render() {
    const { tableData, loading, vendorCategory, vendorStatus, error, selectedStatus, selectedCategory, deleteModal } = this.state
    return (
      <div>
       

          <BreadcrumbComp items={this.itemArray()} />
          {/*User_tab_section::Start */}

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

          <Grid 
            container 
            class="data-table-main" 
            style={{ width: "100%" }}
          >
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
                      title={selectedStatus?.value ? "All Verified Vendors" : "All Pending Vendors"} 
                    />
                }
              </div>
            </Grid>
          </Grid>
          {/*User::End */}
          {/* Delete Vendor Modal :: Start */}
          <div>
            <Modal className='all-modals'
                isOpen={deleteModal}>
                <ModalHeader>Delete Vendor</ModalHeader>

                <ModalBody>
                    <Grid container spacing={2}>
                        <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                            <div className="delete-icon">
                                <img src={Delete} alt="" />
                            </div>
                            <Typography className="small-text-color" style={{ textAlign: "center", marginTop: "20px" }}>
                                Are you sure you want to delete this vendor?
                            </Typography>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <div className="update-btn">
                        <Button
                          className='btn btn-colored small-text-white'
                          onClick={() => this.deleteVendor()}
                        >
                          Delete
                        </Button>
                        <Button
                          className='btn-border'
                          onClick={() => this.closeDeleteModal()}
                        >
                          Cancel
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
          </div>
          {/* Delete Vendor Modal :: End */}
      </div >
    );
  }
}

const mapStateToProps = (state) => ({
  authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(VendorListComp))