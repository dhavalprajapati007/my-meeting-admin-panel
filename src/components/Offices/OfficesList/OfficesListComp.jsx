import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { withRouter } from 'react-router-dom';
import Datatable from '../../CommonComponents/Datatable/Datatable';
import { deleteOffice, getOffices } from "../../../services/officeService";
import { toastAlert } from "../../../helpers/toastAlert";
import { officeListData } from "../../../helpers/renderData"
import BreadcrumbComp from '../../CommonComponents/Breadcrumb/Breadcrumb';
import { connect } from 'react-redux';
import Delete from "../../../assets/images/Delete.png"
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
class OfficesListComp extends Component {
  constructor() {
    super();
    this.state = {
      tabValue: "verified",
      tableData: {},
      loading: true,
      page: 1,
      rowsPerPage : 10,
      count: 1,
      deleteModal : false,
      deleteOfficeId : ""
    }
  }

  handleChange = (value) => {
    this.setState({
      tabValue: value,
      page : 1
    }, 
    () => this.getOffices(this.state.page,this.state.rowsPerPage)
    );
  }

  itemArray = () => {
    const { tabValue } = this.state;
    return (
      [
        {
          name: "Offices",
          active: false,
          link: ""
        },
        {
          name: tabValue === "verified" ? "All Verified Offices" : "All Pending Offices",
          active: true,
          link: ""
        }
      ]
    )
  }

  changePage = (page,rowsPerPage) => {
    this.setState({
      loading: true,
      rowsPerPage
    });
    this.getOffices(page,rowsPerPage);
  };

  openDeleteModal = (id) => {
    this.setState({
      deleteOfficeId : id,
      deleteModal : true
    })
  }

  closeDeleteModal = () => {
    this.setState({
      deleteOfficeId : "",
      deleteModal : false
    })
  }

  deleteOffice = async () => {
    try {
        const res = await deleteOffice(this.state.deleteOfficeId, this.props);
        // passed stateData as props to function so it can prepare payload from this data

        if (res && res?.statusCode == 200) {
            toastAlert(
                res?.message
                    ? res?.message
                    : "Office deleted successfully"
            );
            this.closeDeleteModal();
            this?.getOffices(this.state.page,this.state.rowsPerPage);
        } else {
            // error
            console.log("error deleting office : ", res, res.message);
            console.log(res,"response");
            
            let message =
                res && res.response?.data?.message !== undefined
                    ? res.response?.data?.message
                    : "Problem while deleting office";
            toastAlert(message, "error");
            this.closeDeleteModal();
        }
    } catch (error) {
        console.log("error catch block", error);
        toastAlert("Please check Internet Connection.", "error");
        this.closeDeleteModal();
    }
  }

  getOffices = async(page,rowsPerPage) => {
    const { tabValue } = this.state;
    try {
      let offices = await getOffices({
        page: page,
        limit: rowsPerPage ? rowsPerPage : 10,
        verified: tabValue === "verified" ? true : false,
      }, this.props);
      console.log('offices',offices);
      if(offices && offices.statusCode == 200) {
        this.setState({
          count: offices.totalCount,
          page: page
        })
        let tableData = await officeListData(offices.data, this);
        this.setState({
          tableData,
          loading: false
        })
      }else {
        // error
        console.log('error fetching offices : ', offices, offices.message);
        let message = offices && offices.message !== undefined ? offices.message : "Problem Fetching Records.";
        toastAlert(message, "error");
        this.setState({ loading: false });
      }
    } catch (error) {
      console.log('error catch block', error);
      toastAlert("Please check Internet Connection.", "error");
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    this.getOffices(this.state.page,this.state.rowsPerPage);
  }

  render() {
    const { tabValue, tableData, loading, deleteModal } = this.state
    return (
      <div>
        <Grid container>
          <BreadcrumbComp items={this.itemArray()} />
          {/*User_tab_section::Start */}
          <Grid 
            container
            style={{ marginTop: "30px" }}
          >
            <Grid item lg={12} sm={12} md={12} xs={12} xl={12}>
              <Button 
                className={'tab-btn small-text-color ' + (tabValue === "verified" ? "tab-color" : "")}
                onClick={() => this.handleChange("verified")}
              >
                Verified
              </Button>
              <Button
                className={"tab-btn small-text-color " + (tabValue === "pending" ? "tab-color" : "")}
                onClick={() => this.handleChange("pending")}
              >
                Pending
              </Button>
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
                      title={tabValue === "verified" ? "All Verified Offices" : "All Pending Offices"}
                    />
                }
              </div>
            </Grid>
          </Grid>
          {/*User::End */}

          {/* Delete Office Modal :: Start */}
          <div>
            <Modal className='all-modals'
                isOpen={deleteModal}>
                <ModalHeader>Delete Office</ModalHeader>

                <ModalBody>
                    <Grid container spacing={2}>
                        <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                            <div className="delete-icon">
                                <img src={Delete} alt="" />
                            </div>
                            <Typography className="small-text-color" style={{ textAlign: "center", marginTop: "20px" }}>
                                Are you sure you want to delete this office?
                            </Typography>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <div className="update-btn">
                        <Button
                          className='btn btn-colored small-text-white'
                          onClick={() => this.deleteOffice()}
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
          {/* Delete Office Modal :: End */}
        </Grid>
      </div >
    );
  }
}

const mapStateToProps = (state) => ({
  authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(OfficesListComp))