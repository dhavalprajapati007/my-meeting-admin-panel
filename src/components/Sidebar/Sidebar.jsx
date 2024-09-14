import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import 'bootstrap/dist/css/bootstrap.css';
import ProfileImage from "../../assets/images/profile.jpg"
import Dropdown from 'react-bootstrap/Dropdown';
import "./style.css";
import { useLocation, withRouter, useHistory } from 'react-router-dom';
import {
  Avatar,
  Collapse,
} from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Grid } from "@mui/material";
import Logo from "../../assets/images/login-logo.png";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaidIcon from "@mui/icons-material/Paid";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import SystemSecurityUpdateGoodIcon from "@mui/icons-material/SystemSecurityUpdateGood";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import "../Sidebar/style.css";
import { Link } from 'react-router-dom';

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  [theme.breakpoints.down("md")]: {
    display: "block",
    position: "fixed",
    zIndex: "99999999",
    width: "40vw",
  },
  [theme.breakpoints.down("sm")]: {
    width: "80vw",
  },
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
});
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open
    ? {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      [theme.breakpoints.down("md")]: {
        width: "100% ",
      },
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }
    : {
      width: `calc(100% - ${theme.spacing(8)} + 8px)`,
      [theme.breakpoints.down("md")]: {
        width: "100% ",
      },
    }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));


function Sidebar({ children, collapsed, setCollapsed }) {
  const theme = useTheme();
  const [dropDown, setdropDown] = React.useState(false);
  const [dropDown_two, setdropDown_two] = React.useState(false);
  const [dropDown_three, setdropDown_three] = React.useState(false);
  const [dropDown_four, setdropDown_four] = React.useState(false);
  const handleDrawerOpen = () => {
    setCollapsed(true);
  };

  const location = useLocation();
  const pathname = location.pathname;
  console.log(pathname, "Pathname")
  const appbarTitle = () => {
    if (pathname === "/booking") {
      return "All Bookings"
    } else if (pathname === "/virtualbooking") {
      return "Virtual Booking"
    } else if (pathname === "/dashboard") {
      return "Dashboard"
    } else if (pathname === "/vendors") {
      return "Vendors"
    } else if (pathname === "/clients") {
      return "Clients"
    } else if (pathname === "/offices") {
      return "Offices"
    } else if (pathname === "/servicecategory") {
      return "Service Category"
    } else if (pathname === "/Amenities") {
      return "Amenities"
    } else if (pathname === "/Languages") {
      return "Languages"
    } else if (pathname === "/payments") {
      return "Payments"
    } else if (pathname === "/mail") {
      return "Mail"
    } else if (pathname === "/pushNotification") {
      return "Push Notification"
    } else if (pathname === "/withdrawalRequestHistory") {
      return "Withdrawal Request History"
    } else if (pathname === "/bookingPaymentHistory") {
      return "Booking Payment History"
    } else if (pathname.includes("/allbooking/")) {
      return "Booking Detail Page"
    } else if (pathname.includes("/vendors/")) {
      return "Vendor Detail Page"
    } else if (pathname.includes("/offices/")) {
      return "Office Detail Page"
    }
  }

  const handleDrawerClose = () => {
    setCollapsed(false);
    setdropDown(false);
    setdropDown_two(false);
    setdropDown_three(false);
    setdropDown_four(false);
  };

  const toggledropDown = (value) => {
    if (value === "dropDown") {
      setdropDown(!dropDown);
      setdropDown_two(false);
      setdropDown_three(false);
      setdropDown_four(false);
    } else if (value === "dropDown_two") {
      setdropDown_two(!dropDown_two);
      setdropDown(false);
      setdropDown_three(false);
      setdropDown_four(false);
    } else if (value === "dropDown_three") {
      setdropDown_three(!dropDown_three);
      setdropDown(false);
      setdropDown_two(false);
      setdropDown_four(false);
    } else if (value === "dropDown_four") {
      setdropDown_four(!dropDown_four);
      setdropDown(false);
      setdropDown_two(false);
      setdropDown_three(false);
    }
  }
  const history = useHistory()
  const handleLogout = () => {

    var cookies = document.cookie.split(";");
    console.log('cookies', cookies);
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      console.log("cookie deleted")
    }

    console.log('logout clicked');
    console.log('logout cookie', document.cookie);
    history.push('/login')
  }
  return (
    <Grid container className="sidebar-main">
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <div>
          <Box sx={{ display: "flex" }} className="demo_class">
            <CssBaseline />
            {/* Appbar Content */}
            <AppBar className="appbarmain" position="fixed" open={collapsed}>
              <Toolbar style={{ alignItems: "center" }}>
                <Grid container style={{ alignItems: "center" }}>
                  <Grid item lg={6} sm={8} md={4} xs={8}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={collapsed ? handleDrawerClose : handleDrawerOpen}
                        edge="start"
                        sx={{}}
                        style={{ color: "var(--thm-color)" }}
                      >
                        {collapsed ? (
                          <ChevronLeftIcon
                            style={{ color: "var(--thm-color)" }}
                          />
                        ) : (
                          <MenuIcon className="" />
                        )}
                      </IconButton>
                      <Typography
                        className="appbarTitle "
                        variant="h5"
                        component="h2"
                      >
                        {appbarTitle()}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item lg={6} sm={4} md={8} xs={4}>
                    <div className="appbar-right-side-icons">
                      <Box
                        sx={{
                          display: {
                            xs: "block  !important ",
                            sm: "block !important",
                            md: "none !important",
                            lg: "none !important",
                          },
                        }}
                      >
                        <IconButton
                          size="large"
                          aria-label="show 4 new mails"
                          color="inherit"
                        >
                          <SearchIcon className="gray-icon" />
                        </IconButton>
                      </Box>

                      <Box
                        className="search-input"
                        sx={{
                          display: {
                            xs: "none  !important ",
                            sm: "none !important",
                            md: "block !important",
                            lg: "block !important",
                          },
                        }}
                      >
                        {/* <input
                          type="search"
                          name=""
                          id=""
                          className="search small-text input-main"
                          placeholder="Search here..."
                        /> */}
                      </Box>
                      {/* <IconButton
                        size="large"
                        aria-label="show 4 new mails"
                        color="inherit"
                        className="card-main appbar-btn"
                      >
                        <Badge badgeContent={4} color="primary">
                          <MailIcon className="gray-icon" />
                        </Badge>
                      </IconButton> */}
                      {/* <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                      >
                        <Badge badgeContent={17} color="success">
                          <NotificationsIcon className="gray-icon" />
                        </Badge>
                      </IconButton> */}

                      <div className="profile-dropdown" >



                        {/* <ProfileDropdownComponent props={children} /> */}


                        <div style={{
                          display: 'block',
                          // width: 700,
                          // padding: 30
                        }}>

                          <Dropdown className="dropdown-main">
                            <Dropdown.Toggle variant="success">
                              <Avatar  >
                                <img src={ProfileImage} alt="Profile_image" />
                              </Avatar>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {/* <Dropdown.Item href="#">
                                Profile
                              </Dropdown.Item> */}

                              <Dropdown.Item href="#" onClick={handleLogout}>
                                Logout
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            {/* Appbar Content */}
            <Drawer className="drawerMain" variant="permanent" open={collapsed}>
              <DrawerHeader className="drawerheader">
                {collapsed ? (
                  <div style={{ margin: "0 auto" }}>
                    <img
                      src={Logo}
                      alt=""
                      className="logo"
                      style={{ width: "125px", padding: "15px" }}
                    />
                  </div>
                ) : (
                  <img src={Logo} alt="" className="logo_close" />
                )}
                <IconButton
                  sx={{
                    display: {
                      xs: "block ",
                      sm: "block",
                      md: "none !important",
                      lg: "none !important",
                    },
                  }}
                  onClick={handleDrawerClose}
                >
                  {theme.direction === "rtl" ? (
                    <HighlightOffIcon />
                  ) : (
                    <HighlightOffIcon style={{ fontSize: "40px" }} />
                  )}
                </IconButton>
              </DrawerHeader>
              {/* dashboard::Start */}
              <ListItem>
                <ListItemIcon>
                  <HomeIcon className="gray-icon" />
                </ListItemIcon>
                <Link to="/dashboard">
                  <ListItemText primary="Dashboard" className="small-text"/>
                </Link>
              </ListItem>
              {/* dashboard::End */}
              {/* Booking::Start */}
              <ListItem>
                <ListItemIcon>
                  <BookmarkIcon className="gray-icon" />
                </ListItemIcon>
                <Link to="/booking">
                  <ListItemText primary="Bookings" className="small-text" />
                </Link>
                {/* commented dropdown for bookings right now  */}
                {/* {dropDown ? (
                  <ExpandMoreIcon className="gray-icon" />
                ) : (
                  <ChevronRight className="gray-icon" />
                )} */}
              </ListItem>
              {/* commented Collapse for bookings right now */}
              {/* <Collapse
                in={dropDown}
                timeout="auto"
                unmountOnExit
                className="dropdown-links"
              >
                <ListItem>
                  <Link to="/physicalbooking">
                    <ListItemText primary="Physical" className="link-item" onClick={handleDrawerClose} />
                  </Link>
                </ListItem>


                <ListItem>
                  <Link to="/virtualbooking">
                    <ListItemText primary="Virtual" className="link-item" onClick={handleDrawerClose} />
                  </Link>
                </ListItem>

              </Collapse> */}
              {/* Booking::End */}
              {/* User::Start */}
              <ListItem onClick={() => toggledropDown("dropDown_two")}>
                <ListItemIcon>
                  <PersonIcon className="gray-icon" />
                </ListItemIcon>
                <ListItemText primary="Users" className="small-text" />
                {dropDown_two ? (
                  <ExpandMoreIcon className="gray-icon" />
                ) : (
                  <ChevronRight className="gray-icon" />
                )}
              </ListItem>
              <Collapse
                in={dropDown_two}
                timeout="auto"
                unmountOnExit
                className="dropdown-links"
              >
                <ListItem>
                  <Link to="/vendors">
                    <ListItemText primary="Vendors" className="link-item" />
                  </Link>
                </ListItem>
                <ListItem>
                  <Link to="/clients">
                    <ListItemText primary="Clients" className="link-item"/>
                  </Link>
                </ListItem>
              </Collapse>
              {/* User::End */}

              {/* Offices::Start */}
              <ListItem>
                <ListItemIcon className="sidebar-icon">
                  <ApartmentIcon className="gray-icon" />
                </ListItemIcon>
                <Link to="/offices">
                  <ListItemText primary="Offices" className="small-text"/>
                </Link>
              </ListItem>

              {/* Offices::End */}

              {/* Payments History::Start */}
              <ListItem onClick={() => toggledropDown("dropDown_three")}>
                <ListItemIcon>
                  <PaidIcon className="gray-icon" />
                </ListItemIcon>
                <ListItemText primary="Payment History" className="small-text" />
                  {
                    dropDown_three ?
                      <ExpandMoreIcon className="gray-icon" />
                    :
                      <ChevronRight className="gray-icon" />
                  }
              </ListItem>
              <Collapse
                in={dropDown_three}
                timeout="auto"
                unmountOnExit
                className="dropdown-links"
              >
                <ListItem>
                  <Link to="/withdrawalRequestHistory">
                    <ListItemText primary="Withdrawal Request" className="link-item" />
                  </Link>
                </ListItem>
                <ListItem>
                  <Link to="/bookingPaymentHistory">
                    <ListItemText primary="Booking Payment" className="link-item"/>
                  </Link>
                </ListItem>
              </Collapse>
              {/* Payments::End */}
              {/* Service Category::Start */}
              <ListItem>
                <ListItemIcon>
                  <HomeRepairServiceIcon className="gray-icon" />
                </ListItemIcon>
                <Link to="/servicecategory">
                  <ListItemText
                    primary="Service Category"
                    className="small-text"
                  />
                </Link>
              </ListItem>
              {/* Service Category::End */}
              {/*Amenities::Start */}
              <ListItem>
                <ListItemIcon>
                  <SystemSecurityUpdateGoodIcon className="gray-icon" />
                </ListItemIcon>
                <Link to="/Amenities">
                  <ListItemText primary="Amenities" className="small-text"/>
                </Link>
              </ListItem>
              {/*Amenities::End */}
              {/*Languages::Start */}
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon className="gray-icon" />
                </ListItemIcon>
                <Link to="/Languages">
                  <ListItemText primary="Languages" className="small-text" />
                </Link>
              </ListItem>
              {/*Languages::End */}
              {/* Notification::Start */}
              <ListItem onClick={() => toggledropDown("dropDown_four")}>
                <ListItemIcon>
                  <NotificationsActiveIcon className="gray-icon" />
                </ListItemIcon>
                <ListItemText primary="Notification" className="small-text" />
                  {
                    dropDown_four ?
                      <ExpandMoreIcon className="gray-icon" />
                    :
                      <ChevronRight className="gray-icon" />
                  }
              </ListItem>
              <Collapse
                in={dropDown_four}
                timeout="auto"
                unmountOnExit
                className="dropdown-links"
              >
                <ListItem>
                  <Link to="/mail">
                    <ListItemText primary="Mail" className="link-item" />
                  </Link>
                </ListItem>
                <ListItem>
                  {/* <ListItemIcon>
                    <MailIcon className="gray-icon" />
                  </ListItemIcon> */}
                  <Link to="/pushNotification">
                    <ListItemText primary="Push Notification" className="link-item"/>
                  </Link>
                </ListItem>
              </Collapse>
              {/* Notification::End */}
            </Drawer>
            <div
              component="main"
              sx={{
                flexGrow: 1,
                p: 3 
              }}
              style={{
                padding: "24px",
                width: "100%" 
              }}
              className={(collapsed === true ? "collapsed-open" : "collapsed-close" )}
            >
              <DrawerHeader />
              {children}
            </div>
          </Box>
        </div>
      </Grid>
    </Grid >
  );
}

export default withRouter(Sidebar)