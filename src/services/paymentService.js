import axios from 'axios';
import Cookies from 'js-cookie';
import { toastAlert } from '../helpers/toastAlert';
import clearCookies from './clearCookies'

// TODO: Create BASE_URL in .env file and put it here.
// TODO: on error of 401 we need to clear cookies and redirect user to login page.
const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/user/`;
const getHeaders = (props) => {
    return {
        'content-type': 'application/json',
        'Authorization' : props?.authData?.accessToken
    }
}

export var getWithdrawalRequestHistory = async (data,props) => {
    let finalUrl = `${Url}get-all-withdrawal-requests?page=${data.page}&limit=${data.limit}&status[]=${data.status.join("&status[]=")}`;
    try{
        let response = await axios.get(finalUrl,{headers : getHeaders(props)});
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
            // passed props to clearCookie() function
        }
        return error;
    }
}

export var getWithdrawalRequestHistoryByVendor = async (data,props) => {
    let finalUrl = `${Url}get-withdrawal-request-history-by-vendor?page=${data.page}&limit=${data.limit}&vendorId=${data.vendorId}&status[]=${data.status.join("&status[]=")}`;
    try{
        let response = await axios.get(finalUrl,{headers : getHeaders(props)});
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
            // passed props to clearCookie() function
        }
        return error;
    }
}

export const editWithdrawalRequestHistory = async (payload, props) => {
    try{
        if(!payload) return false;
        let response = await axios.put(Url+"update-withdrawal-request",payload,{ headers : getHeaders(props) });
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response.data);
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        } 
        // return error.response.data;
        return error;
    }
}

export var bookingPaymentsHistory = async (data,props) => {
    let finalUrl = `${Url}get-booking-payment-history?page=${data.page}&limit=${data.limit}&vendorId=${data.vendorId}&status[]=${data.status.join("&status[]=")}`;
    try{
        let response = await axios.get(finalUrl, { headers : getHeaders(props) });
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
            // passed props to clearCookie() function
        }
        return error;
    }
}