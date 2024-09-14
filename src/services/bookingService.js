import axios from 'axios';
import Cookies from 'js-cookie';
import clearCookies from './clearCookies'


// TODO: Create BASE_URL in .env file and put it here.
const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/service-booking/`;

const getHeaders = (props) => {
    console.log(props,"bookingProps")
    return {
        'content-type': 'application/json',
        'Authorization' : props?.authData?.accessToken
    }
}

export var getBookings = async (payload,props) => {
    console.log(Url,"BookingURL")
    try{
        if(!payload) return false;
        console.log(payload?.serviceStatus,"rcvdPayload")
        let body = {
            "page" : payload && payload.page !== undefined ? payload.page : 1,
            "limit" : payload && payload.limit !== undefined ? payload.limit : 10,
            "serviceStatus" : payload && payload?.serviceStatus !== undefined && payload?.serviceStatus?.length > 0 ? payload?.serviceStatus : ["Completed","Cancelled","Upcoming","In-Progress","Unattended"],
            "serviceType" : payload && payload?.serviceType !== undefined && payload?.serviceType?.length > 0 ? payload?.serviceType : [1,2,3]
        }
        let response = await axios.post(Url+"list",body, {headers : getHeaders(props)} );
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        } 
        // return error.response.data;
        return error;
    }
}

export var getBookingDetails = async (payload, props) => {
    try{
        if(!payload) return false;
        let body = {
            "_id" : payload.bookingId
        }
        let response = await axios.post(Url+"view",body,{headers : getHeaders(props)} );
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        } 
        // return error.response.data;
        return error;
    }
}

export const editBookingDetails = async (payload, props) => {
    try{
        if(!payload) return false;
        let response = await axios.post(Url+"edit",payload,{headers : getHeaders(props)} );
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        } 
        // return error.response.data;
        return error;
    }
}