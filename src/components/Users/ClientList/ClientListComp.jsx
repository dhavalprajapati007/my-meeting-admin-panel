import React, { Component } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { withRouter } from 'react-router-dom';
import './style.css'
import Datatable from '../../CommonComponents/Datatable/Datatable';
import { getUsers } from "../../../services/userService";
import { toastAlert } from "../../../helpers/toastAlert";
import { userListData } from "../../../helpers/renderData"
import BreadcrumbComp from '../../CommonComponents/Breadcrumb/Breadcrumb';
import { connect } from 'react-redux';

class ClientListComp extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      tableData: {},
      page: 1,
      rowsPerPage : 10,
      count: 1
    }
  }

  itemArray = () => {
    return (
      [
        {
          name: "Users",
          active: false,
          link: ""
        },
        {
          name: "Clients",
          active: false,
          link: ""
        },
        {
          name: "All Clients",
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
    }, () => this.getClients(page,rowsPerPage));
  };

  getClients = async (page,rowsPerPage) => {
    try {
      let users = await getUsers({
        page: page,
        limit: rowsPerPage ? rowsPerPage : 10,
        role: 1
      }, this.props);
      // passed props to getUsers function so it can redirect this props to clearCookie() function

      if (users && users.statusCode == 200) {
        this.setState({
          count: users.totalCount,
          page: page
        })
        let tableData = await userListData(users.data, this);
        this.setState({
          tableData,
          loading: false
        })
      } else {
        // error
        console.log('error fetching users : ', users, users.message);
        let message = users && users.message !== undefined ? users.message : "Problem Fetching Records.";
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
    this.getClients(this.state.page,this.state.rowsPerPage);
  }

  render() {
    const { tableData, loading } = this.state;
    return (
      <div>
        <Grid container>
          <Grid item lg={12} sm={12} xs={12} md={12}>
            {/* Breadcrumb-component : start */}
            <BreadcrumbComp items={this.itemArray()} />
            {/* Breadcrumb-component : end */}

            {/*User_List_section::Start */}
            <Grid container className='data-table-main' >
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
                      <Datatable
                        props={tableData}
                        title="All clients"
                      />
                  }
                </div>
              </Grid>
            </Grid>
            {/*User_List_section::End */}
          </Grid>
        </Grid>
      </div >
    );
  }
}

const mapStateToProps = (state) => ({
  authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(ClientListComp))