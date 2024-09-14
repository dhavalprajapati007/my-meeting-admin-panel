import React, { Component } from 'react';
import { Button, FormControl, CircularProgress, Grid, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import LoginImage from "../../assets/images/LoginImage.png";
import Logo from "../../assets/images/login-logo.png";
import PersonIcon from "@mui/icons-material/Person";
import { forgotPassword } from "../../services/authService"
import { toastAlert } from '../../helpers/toastAlert';
import { withRouter } from 'react-router-dom';

class ForgotPasswordComp extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            error: [],
            loading: false
        }
    }

    validateInput = () => {
        const { email } = this.state
        const reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let error = [];

        if (!email.trim()) {
            error.push('email')
        }
        if (!reEmail.test(email.trim())) {
            if (!error.includes('email')) error.push('emailInvalid')
        }
        if (error.length > 0) {
            this.setState({
                error,
            })
        } else {
            this.setState({
                error: [],
            })
            this.forgotPassWord();
        }
    }

    forgotPassWord = async () => {
        this.setState({ loading: true });
        try {
            let response = await forgotPassword(this.state?.email);
            console.log('Forgot Password Response ', response);

            if (response && response.statusCode == 200) {
                this.setState({
                    loading: false,
                })
                this?.props?.history?.push({
                    pathname: '/resetpassword',
                    state: { email: this?.state?.email }
                });
            } else {
                // error
                console.log('error from forgot password : ', response, response.message);
                let message = response && response.data?.message !== undefined ? response.data?.message : "Unexpected Problem from while sent Reset token.";
                toastAlert(message, "error");
                this.setState({ loading: false });
            }
        } catch (error) {
            console.log('error catch block', error);
            toastAlert("Please check Internet Connection.", "error");
            this.setState({ loading: false });
        }
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    render() {
        const { email, error, loading } = this.state
        return (
            <div className="main-login">
                <Grid container>
                    <Grid item lg={7} md={6} sm={12} xs={12} className="login-right">
                        <div className="login-image">
                            <img src={LoginImage} alt="login-image" />
                        </div>
                    </Grid>
                    <Grid item lg={5} md={6} sm={12} xs={12} className="form-col">
                        <Grid container 
                            style={{ 
                                displsy: "flex", 
                                justifyContent: "center" 
                            }}
                        >
                            <Grid item lg={10} sm={12} md={12} xs={12}>
                                <div 
                                    className="login-form-main" 
                                    style={{ padding: "40px" }}
                                >
                                    <div className="my-meeting-logo">
                                        <img src={Logo} alt="logo" />
                                    </div>
                                    <div className="welcome-text">
                                        <Typography className="sub-title-gray" marginTop={5}>
                                            Forgot Password?
                                        </Typography>
                                        <Typography className="small-text-light" marginTop={1}>
                                            Enter your email below to get the OTP
                                        </Typography>
                                    </div>
                                    <form action="" className="form-inputs-main">
                                        <FormControl style={{ width: "100%" }}>
                                            <OutlinedInput
                                                placeholder="Enter email"
                                                className="small-text form-input"
                                                onChange={(e) => this.handleInput(e)}
                                                value={email}
                                                name="email"
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <PersonIcon style={{ color: "#a6a4b0" }} />
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                        {error.includes('email') &&
                                            <p className="error-message">
                                                Email is required!
                                            </p>
                                        }
                                        {error.includes('emailInvalid') &&
                                            <p className="error-message">
                                                Email is invalid!
                                            </p>
                                        }

                                        <div className="btn-main reset-main-div">
                                            <Button
                                                variant="contained btn-colored login-btn"
                                                onClick={() => this.validateInput()}
                                            >
                                                Reset Password
                                                {
                                                    loading &&
                                                    <CircularProgress
                                                        className='reset-loader'
                                                        style={{
                                                            color: "white",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            marginLeft: "10px"

                                                        }}
                                                        size={20}
                                                    />
                                                }
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withRouter(ForgotPasswordComp);