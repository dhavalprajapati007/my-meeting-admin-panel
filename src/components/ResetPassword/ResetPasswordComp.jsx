import React, { Component } from 'react';
import { Button, FormControl, Grid, InputAdornment, CircularProgress, OutlinedInput, Typography } from "@mui/material";
import LoginImage from "../../assets/images/LoginImage.png";
import Logo from "../../assets/images/login-logo.png";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { resetPassword } from "../../services/authService";
import { toastAlert } from '../../helpers/toastAlert';
import { withRouter } from 'react-router-dom';


class ResetPasswordComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            confirmPassword: "",
            resetToken: "",
            error: [],
            loading: false,
            showPassword: false,
            showConfirmPassword: false
        }
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    resetPassWord = async () => {
        this.setState({ loading: true });
        const { resetToken,password,confirmPassword } = this.state
        const { email } = this.props
        try {
            let body = {
                "email": email,
                "resetToken": resetToken,
                "newPassword": password,
                "newPassword2": confirmPassword
            }
            let response = await resetPassword(body);
            console.log('Reset Password Response ', response);
            let message = response?.message ? response?.message : "Password has been successfully updated";
            toastAlert(message, "success");
            if (response && response.statusCode == 200) {
                this.setState({
                    loading: false,
                })
                this?.props?.history?.push('/login');
            } else {
                // error
                console.log('error from reset password : ', response, response.message);
                let message = response && response?.data?.message !== undefined ? response?.data?.message : "Unexpected Problem from while Reset Password.";
                toastAlert(message, "error");
                this.setState({ loading: false });
            }
        } catch (error) {
            console.log('error catch block', error);
            toastAlert("Please check Internet Connection.", "error");
            this.setState({ loading: false });
        }
    }

    validateInput = () => {
        let error = [];
        let passwordRegex = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
        const { resetToken,password,confirmPassword } = this.state

        if (!resetToken?.trim()) {
            error.push('resetTokenError')
        }
        if (resetToken?.trim() && (parseInt(resetToken) < 0 || resetToken?.length !== 6)) {
            error.push('resetTokenInvalid')
        }
        if (!password?.trim()) {
            error.push('passwordError')
        }
        if (!passwordRegex.test(password?.trim())) {
            if (!error.includes('passwordError')) error.push('passwordInvalid')
        }
        if (!confirmPassword?.trim()) {
            error.push('confirmPasswordError')
        }
        if (!passwordRegex.test(confirmPassword?.trim())) {
            if (!error.includes('confirmPasswordError')) error.push('confirmPasswordInvalid')
        }
        if (password?.trim() !== confirmPassword?.trim()) {
            if (!error.includes('confirmPasswordError') && !error.includes('confirmPasswordInvalid')) error.push('passwordMismatch')
        }
        if (error.length > 0) {
            this.setState({
                error,
            })
        } else {
            this.setState({
                error: [],
            })
            this.resetPassWord();
        }
    }

    changeView = (type) => {
        if (type === "password") {
            this.setState({
                showPassword: !this.state.showPassword
            })
        } else if (type === "confirmPassword") {
            this.setState({
                showConfirmPassword: !this.state.showConfirmPassword
            })
        }
    }

    render() {
        const { loading, password, confirmPassword, resetToken, error, showConfirmPassword, showPassword } = this.state
        const { email } = this?.props
        return (
            <div className="main-login">
                <Grid container>
                    <Grid item lg={7} md={6} sm={12} xs={12} className="login-right">
                        <div className="login-image">
                            <img src={LoginImage} alt="login-image" />
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
                            <Grid lg={10} sm={12} md={12} xs={12}>
                                <div className="login-form-main" style={{ padding: "40px" }}>
                                    <div className="my-meeting-logo">
                                        <img src={Logo} alt="" />
                                    </div>
                                    <div className="welcome-text">
                                        <Typography className="sub-title-gray" marginTop={5}>
                                            Reset Password
                                        </Typography>
                                        <Typography className="small-text-light" marginTop={1}>
                                            Enter Reset token and New password below
                                        </Typography>
                                    </div>
                                    <form action="" className="form-inputs-main reset-main-div">
                                        <Grid container spacing={1}>
                                            <Grid item lg={12} sm={12} md={12} xs={12}>
                                                <FormControl style={{ width: "100%" }}>
                                                    <OutlinedInput
                                                        placeholder="Enter email"
                                                        className="small-text form-input"
                                                        disabled={true}
                                                        value={email}
                                                        type="email"
                                                        name="email"
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <PersonIcon style={{ color: "#a6a4b0" }} />
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item lg={12} sm={12} md={12} xs={12}>
                                                <FormControl>
                                                    <OutlinedInput
                                                        placeholder="Enter reset token"
                                                        className="small-text form-input"
                                                        value={resetToken}
                                                        onChange={(e) => this.handleInput(e)}
                                                        type="number"
                                                        name="resetToken"
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <ConfirmationNumberIcon style={{ color: "#a6a4b0" }} />
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                                {error.includes('resetTokenError') &&
                                                    <p className="error-message">
                                                        Reset token shouldn't be empty
                                                    </p>
                                                }
                                                {error.includes('resetTokenInvalid') &&
                                                    <p className="error-message">
                                                        Reset token is invalid!
                                                    </p>
                                                }
                                            </Grid>
                                            <Grid item lg={12} sm={12} md={12} xs={12}>
                                                <FormControl>
                                                    <OutlinedInput
                                                        placeholder="Enter New Password"
                                                        className="small-text form-input"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => this.handleInput(e)}
                                                        name="password"
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
                                                                        onClick={() => this.changeView("password")}
                                                                    />
                                                                :
                                                                    <VisibilityOffIcon
                                                                        style={{ color: "#a6a4b0" }} 
                                                                        onClick={() => this.changeView("password")}
                                                                    />
                                                                }
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                                {error.includes('passwordError') &&
                                                    <p className="error-message">
                                                        Password is required
                                                    </p>
                                                }
                                                {error.includes('passwordInvalid') &&
                                                    <p className="error-message">
                                                        Password should have one numeric, one special, one uppercase, one lowercase and 8 characters long
                                                    </p>
                                                }
                                            </Grid>
                                            <Grid item lg={12} sm={12} md={12} xs={12}>

                                                <FormControl>
                                                    <OutlinedInput
                                                        placeholder="Confirm Password"
                                                        className="small-text form-input"
                                                        name="confirmPassword"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        value={confirmPassword}
                                                        onChange={(e) => this.handleInput(e)}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <LockIcon style={{ color: "#a6a4b0" }} />
                                                            </InputAdornment>
                                                        }
                                                        endAdornment={
                                                            <InputAdornment position="start">
                                                                {
                                                                showConfirmPassword ? 
                                                                    <RemoveRedEyeIcon 
                                                                        style={{ color: "#a6a4b0" }} 
                                                                        onClick={() => this.changeView("confirmPassword")}
                                                                    />
                                                                :
                                                                    <VisibilityOffIcon
                                                                        style={{ color: "#a6a4b0" }} 
                                                                        onClick={() => this.changeView("confirmPassword")}
                                                                    />
                                                                }
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                                {error.includes('confirmPasswordError') &&
                                                    <p className="error-message">
                                                        Confirm password is required
                                                    </p>
                                                }
                                                {error.includes('confirmPasswordInvalid') &&
                                                    <p className="error-message">
                                                        Confirm password should have one numeric, one special, one uppercase, one lowercase and 8 characters long
                                                    </p>
                                                }
                                                {error.includes('passwordMismatch') &&
                                                    <p className="error-message">
                                                        Confirm password should be equal to password
                                                    </p>
                                                }
                                            </Grid>
                                            <Grid item lg={12} sm={12} md={12} xs={12}>
                                                <div className="btn-main">
                                                    <Button
                                                        variant="contained btn-colored login-btn reset-main-div"
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
                                            </Grid>
                                        </Grid>
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

export default withRouter(ResetPasswordComp);