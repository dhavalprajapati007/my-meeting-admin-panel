import React, { Component } from 'react';
import ResetPasswordComp from "../../components/ResetPassword/ResetPasswordComp";

class ResetPassword extends Component {
    render() {
        const { location } = this?.props
        return (
            <div>
                <ResetPasswordComp email={location?.state?.email}/>
            </div>
        );
    }
}

export default ResetPassword;