import axios from 'axios';

const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/user/`;

export const forgotPassword = async (email) => {
    try{
        if(!email) return false;
        let body = {
            "email" : email.trim(),
        }
        let response = await axios.post(Url+"forgot-password",body);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        return error.response;
    }
}

export const resetPassword = async (body) => {
    try{
        if(!body) return false;
        let response = await axios.post(Url+"reset-password",body);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        return error.response;
    }
}