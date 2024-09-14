import { Grid, Typography, Button } from "@material-ui/core";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./style.css";
import { toastAlert } from "../../../helpers/toastAlert";
import { getSlots, editSlots } from "../../../services/timeSlotService";

function TimeSlotTabs(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TimeSlotTabs.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

class TimeSlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: [],
      value: 0,
      editValue: 0,
      timeSlots: [],
      sessionTime: 0,
      intervalTime: 0,
      editedTimeSlots: [],
      editValue: 0,
      editTimeSlotsModal: false,
      slotArr : [
        { label : "Monday" },
        { label : "Tuesday" },
        { label : "Wednesday" },
        { label : "Thursday" },
        { label : "Friday" },
        { label : "Saturday" },
        { label : "Sunday" }
      ]
    };
  }

  componentDidMount = () => {
    let data = this?.props?.data?.vendorTimeslot[0];
    this.setState({
      timeSlots: data?.availableSlots,
      editedTimeSlots: data?.availableSlots,
      sessionTime: data?.sessionTime,
      intervalTime: data?.interval,
    });
  };

  toggleModal = () => {
    this.setState({
      editTimeSlotsModal: !this.state.editTimeSlotsModal,
    });
  };

  handleTabChange = (e, newVal, type) => {
    if (type === "view") {
      this.setState({
        value: newVal,
      });
    } else if (type === "edit") {
      this.setState({
        editValue: newVal,
      });
    }
  };

  editSlotStatus = (dayIndex, slotIndex, value) => {
    const { editedTimeSlots } = this.state;
    let editedArray = editedTimeSlots?.map((day, idx) => {
      if (idx === dayIndex) {
        let slotArray = day?.map((slot, idx) => {
          if (idx === slotIndex) {
            return { ...slot, status: !value };
          } else {
            return slot;
          }
        });
        return slotArray;
      } else {
        return day;
      }
    });
    this.setState({
      editedTimeSlots: editedArray,
    });
  };

  handleTimeSlotChange = async (event) => {

    let sessionPromise  = new Promise((resolve, reject) => {
      // set value in State for SessionTime and IntervalTime
      this.setState({
        [event.target.name]: event.target.value,
      });  
      resolve("Stuff worked!");
    });
    
    sessionPromise.then(() => {
      const { sessionTime, intervalTime } = this.state;
      let error = [];
      
      if(!sessionTime || parseInt(sessionTime) === 0) {
        error.push("sessionTime");
      }
      if(parseInt(sessionTime) < 0) {
        error.push("negativeSessionTime");
      }
      if(!intervalTime) {
        error.push("intervalTime");
      }

      if(error.length > 0) {
        this.setState({
          error,
        });
      } else {
        this.setState({
          error: [],
        },() => this.getNewTimeSlots());
      }
    })
  };

  getNewTimeSlots = async() => {
    try {
      let res = await getSlots(
        {
          interval: parseInt(this?.state?.intervalTime),
          sessionTime: parseInt(this?.state?.sessionTime),
        },
        this.props
      );
      // passed props to getSlots function so it can redirect this props to clearCookie() function

      if(res && res?.statusCode == 200) {
        this.setState({
          editedTimeSlots: res?.data,
        });
      } else {
        // error
        console.log("error while fetching slots : ", res, res.message);
        let message = res && res.message !== undefined ?
            res.message
          : 
            "Problem while fetchong Records.";
        toastAlert(message, "error");
      }
    } catch(error) {
      console.log("error catch block", error);
      toastAlert("Please check Internet Connection.", "error");
    }
  }

  editTimeSlot = () => {
    let error = [];
    const { sessionTime, intervalTime } = this.state;
    if(!sessionTime || parseInt(sessionTime) === 0) {
      error.push("sessionTime");
    }
    if(parseInt(sessionTime) < 0) {
      error.push("negativeSessionTime");
    }
    if (!intervalTime) {
      error.push("intervalTime");
    }
    if (error.length > 0) {
      this.setState({
        error,
      });
    } else {
      this.setState({
        error: [],
      });
      this.updateTimeSlot();
    }
  };

  updateTimeSlot = async () => {
    const { intervalTime, sessionTime, editedTimeSlots } = this.state;
    const { data, getVendorData } = this.props;
    try {
      let res = await editSlots(
        {
          interval: parseInt(intervalTime),
          sessionTime: parseInt(sessionTime),
          availableSlots: editedTimeSlots,
          id: data?.vendorTimeslot[0]?._id,
        },
        this.props
      );
      // passed props to editSlots function so it can redirect this props to clearCookie() function

      if (res && res?.statusCode == 200) {
        this.setState({ editTimeSlotsModal: false });
        toastAlert(
          res?.message ? res?.message : "TimeSlots updated successfully"
        );
        getVendorData();
      } else {
        // error
        this.setState({ editTimeSlotsModal: false });
        console.log("error updating slots : ", res, res.message);
        let message =
          res && res.message !== undefined
            ? res.message
            : "Problem while updating Records.";
        toastAlert(message, "error");
      }
    } catch (error) {
      this.setState({ editTimeSlotsModal: false });
      console.log("error catch block", error);
      toastAlert("Please check Internet Connection.", "error");
    }
 }

  render() {
    const { data } = this.props;
    const {
      value,
      sessionTime,
      error,
      intervalTime,
      editedTimeSlots,
      editValue,
      editTimeSlotsModal,
      slotArr
    } = this.state;
    return (
     


      <Grid container>
        <Grid
        item
        lg={12}
        xl={12}
        md={12}
        sm={12}
        xs={12}
        style={{ display: "flex" }}
      >
        <div 
          style={{ 
            width: "100%",
            display: "flex"
          }}
        >
          {/* Time_slot_card::Start */}
          <div className="card-main">
            <div className="content-header">
              <div className="inner-card-title">
                <Typography 
                  className="card-title"
                  variant="h5"
                >
                  {" "}
                  Time Slots{" "}
                </Typography>
                <Button
                  className="white-border-btn modal-title-btn"
                  onClick={() => this.toggleModal()}
                >
                  Edit
                </Button>
              </div>
            </div>
            <div className="content-body-main">
              <div>
                <Box 
                  sx={{ width: "100%" }}
                  className="tab-panel-main"
                >
                  <Box
                    sx={{ 
                      borderBottom: 1,
                      borderColor: "divider" 
                    }}
                    className="tab-div"
                  >
                    <Tabs
                      value={value}
                      onChange={(e, value) =>
                        this.handleTabChange(e, value, "view")
                      }
                      aria-label="basic tabs example"
                      style={{ marginTop: "30px" }}
                    >
                      {
                        slotArr?.map((item,i) => (
                          <Tab
                            className="tab-btn time-slot-tab small-text-color"
                            label={item?.label}
                            {...a11yProps(i)}
                            key={i}
                          />
                        ))
                      }
                    </Tabs>
                  </Box>
                  <div
                    style={{ marginTop: "10px" }}
                    className="time-slote-main-div"
                  >
                    <TimeSlotTabs 
                      value={value && value} 
                      index={value && value}
                    >
                      {
                        data?.vendorTimeslot[0]?.availableSlots?.length &&
                        data?.vendorTimeslot[0]?.availableSlots[value]?.length &&
                        data?.vendorTimeslot[0]?.availableSlots[value]?.map((data,i) => (
                          <div className="time-slots-main">
                            <div className="time-slots">
                              <span
                                className={
                                  "time-span small-text-color " +
                                  (!data?.status && "tab-color")
                                }
                                key={i}
                              >
                                {data?.s_time}-{data?.e_time}
                              </span>
                            </div>
                          </div>
                        ))
                      }
                    </TimeSlotTabs>
                  </div>
                </Box>
              </div>
            </div>
            <div style={{ marginTop: "20px" }}></div>
          </div>
          {/* Time_slot_card::End */}
        </div>
        {/*Edit-time-slot-modal : start*/}
        <div>
          <Modal
            className="all-modals"
            size="lg"
            style={{ 
              maxWidth: "850px",
  
            }}
            isOpen={editTimeSlotsModal}
          >
            <ModalHeader>
              Edit Time slots
            </ModalHeader>
            <ModalBody>
              <Grid container spacing={2}>
                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                  <form action="">
                    <Grid container spacing={2}>
                      <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                        <div>
                          <p className="small-text">
                            Session Time :
                          </p>
                          <input
                            name="sessionTime"
                            value={sessionTime}
                            onChange={(e) => this.handleTimeSlotChange(e)}
                            className="input-main"
                            type="Number"
                            placeholder="Session time (in minutes)"
                          />
                        </div>
                        {error.includes("sessionTime") &&
                          <p className="error-message">
                            Session time shouldn't be empty
                          </p>
                        }
                        {error.includes("negativeSessionTime") &&
                          <p className="error-message">
                            Session time shouldn't be negative
                          </p>
                        }
                      </Grid>
                      <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                        <p className="small-text">
                          Interval Time (In minutes) :{" "}
                        </p>
                        <select
                          name="intervalTime"
                          className="input-main"
                          onChange={(e) => this.handleTimeSlotChange(e)}
                          value={intervalTime}
                        >
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option>
                          <option value="25">25</option>
                          <option value="30">30</option>
                        </select>
                        {error.includes("intervalTime") &&
                          <p className="error-message">
                            Session time shouldn't be empty
                          </p>
                        }
                      </Grid>
                      <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                        <div>
                          <Box
                            sx={{ width: "100%" }}
                            className="tab-panel-main"
                          >
                            <Box
                              sx={{ borderBottom: 1, borderColor: "divider" }}
                              className="tab-div edit-tab-div"
                            >
                              <Tabs
                                value={editValue}
                                onChange={(e, value) =>
                                  this.handleTabChange(e, value, "edit")
                                }
                                aria-label="basic tabs example"
                                style={{ marginTop: "30px" }}
                              >
                                {
                                  slotArr?.map((item,i) => (
                                    <Tab
                                      className="tab-btn small-text-color"
                                      label={item?.label}
                                      {...a11yProps(i)}
                                      key={i}
                                    />
                                  ))
                                }
                              </Tabs>
                            </Box>
                            <div
                              style={{ marginTop: "10px" }}
                              className="time-slote-main-div"
                            >
                              <TimeSlotTabs
                                value={editValue && editValue}
                                index={editValue && editValue}
                              >
                                {
                                  editedTimeSlots && editedTimeSlots?.length && editedTimeSlots[editValue]?.map((data, i) => (
                                    <div className="time-slots-main">
                                      <div className="time-slots">
                                        <span
                                          className={
                                            "time-span small-text-color " +
                                            (!data?.status && "tab-color")
                                          }
                                          onClick={() =>
                                            this.editSlotStatus(
                                              editValue,
                                              i,
                                              data.status
                                            )
                                          }
                                          key={i}
                                        >
                                          {data?.s_time}-{data?.e_time}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                }
                              </TimeSlotTabs>
                            </div>
                          </Box>
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
                onClick={() => this.editTimeSlot()}
              >
                Edit
              </Button>
              <Button
                className="btn btn-border small-text-color"
                onClick={() => this.toggleModal()}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        {/*Edit-time-slot-modal : end*/}
      </Grid>
      </Grid>
    );
  }
}

export default withRouter(TimeSlot);