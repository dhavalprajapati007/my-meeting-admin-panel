import { Button, CircularProgress, FormControl, Grid, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import React, { Component } from "react";
import LoginImage from "../../assets/images/LoginImage.png";
import "./style.css";
import Logo from "../../assets/images/login-logo.png";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Cookies from 'js-cookie';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { connect } from 'react-redux';
import { loginUser } from "../../redux/actions/authActions"
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

class LoginComp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: [],
      showPassword: false
    }
  }

  redirectUser = () => {
    this.props.history.push("/dashboard")
  }

  handleLogin = () => {
    const { email, password } = this.state;
    const reEmail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rePassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    let error = [];

    if (!email.trim()) {
      error.push('email')
    }
    if (!reEmail.test(email.trim())) {
      error.push('emailInvalid')
    }
    if (!password.trim()) {
      error.push('password')
    }
    if (!rePassword.test(password.trim())) {
      error.push('passwordInvalid')
    }

    if (error.length > 0) {
      this.setState({
        error,
      })
    } else {
      this.setState({
        error: [],
      })
      this.props.loginUser(email,password,this.redirectUser)
    }
  }

  componentDidMount() {
    if (Cookies.get('ClisAuthenticated')) {
      console.log("isAuthenticated");
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(props) {
    console.log(props);
    if (props?.authData?.isAuthenticated || props?.authData?.isAuthenticated === "true") {
      props.history.push('/dashboard');
    }
  }

  handleLoginInput = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    })
  }

  changeView = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    })
  }

  render() {
    const { email, password, error, showPassword } = this.state;
    const { loading } = this.props.authData
    return (
      <div className="main-login">
        <Grid container>
          <Grid item lg={7} md={6} sm={12} xs={12} className="login-right">
            <div className="login-image">
              <img 
                src={LoginImage}
                alt="login-page-image"
              />
            </div>
          </Grid>
          <Grid item lg={5} md={6} sm={12} xs={12} className="form-col">
            <Grid 
              container
              style={{ 
                displsy: "flex",
                justifyContent: "center"
              }}
            >
              <Grid item lg={10} sm={12} md={12} xs={12}></Grid>
              <div 
                className="login-form-main"
                style={{ padding: "40px" }}
              >
                <div className="my-meeting-logo">
                  <img 
                    src={Logo}
                    alt="logo"
                  />
                </div>
                <div className="welcome-text">
                  <Typography 
                    className="sub-title-gray" 
                    marginTop={5}
                  >
                    Welcome to My Meetings !
                  </Typography>
                  <Typography 
                    className="small-text-light"
                    marginTop={1}
                  >
                    Please sign-in to your account and start the adventure
                  </Typography>
                </div>
                <form action="" className="form-inputs-main">
                  <FormControl style={{ width: "100%" }}>
                    <OutlinedInput
                      placeholder="Enter email"
                      onChange={(evt) => this.handleLoginInput(evt)}
                      className="small-text form-input"
                      type="email"
                      name="email"
                      value={email}
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon style={{ color: "#a6a4b0" }} />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {error?.includes('email') &&
                    <p className="error-message">
                      Email is required!
                    </p>
                  }
                  {error?.includes('emailInvalid') && !error?.includes('email') &&
                    <p className="error-message">
                      Email is invalid!
                    </p>
                  }
                  <FormControl style={{ width: "100%" }}>
                    <OutlinedInput
                      placeholder="Password"
                      className="small-text form-input"
                      onChange={(evt) => this.handleLoginInput(evt)}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      autocomplete="on"
                      startAdornment={
                        <InputAdornment position="start">
                          <LockIcon style={{ color: "#a6a4b0" }} />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="start">
                          {
                            showPassword ? 
                              <RemoveRedEyeIcon 
                                style={{ color: "#a6a4b0" }} 
                                onClick={() => this.changeView()}
                              />
                            :
                              <VisibilityOffIcon 
                                style={{ color: "#a6a4b0" }} 
                                onClick={() => this.changeView()}
                              />
                          }
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {error.includes('password') &&
                    <p className="error-message">
                      Password is required!
                    </p>
                  }
                  {error.includes('passwordInvalid') && !error.includes('password') &&
                    <p className="error-message">
                      Your password must be at least 8 characters long and contain an uppercase lowercase and special characters
                    </p>
                  }
                  <div className="forgot-password-text">
                    <Link to="/forgotpassword">
                      <Typography className="small-text-light" marginTop={1}>
                        Forgot password?
                      </Typography>
                    </Link>
                  </div>
                  <div className="btn-main">
                    <Button 
                      variant="contained btn-colored login-btn"
                      onClick={() => this.handleLogin()}
                    >
                      {loading ?
                        <CircularProgress
                          sx={{ color: '#fff' }}
                          size={20}
                        />
                      :
                        'Login'
                      }
                    </Button>
                  </div>
                </form>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps, { loginUser })(LoginComp))