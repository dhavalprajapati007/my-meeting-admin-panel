import axios from 'axios';
import clearCookies from './clearCookies'

const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/`;
const getHeaders = (props) => {
    return {
        'content-type': 'application/json',
        'Authorization' : props?.authData?.accessToken
    }
}

export const getOfficeAndCabinData = async (props) => {
    try{
        let response = await axios.get(Url+"office/get-totals", {headers : getHeaders(props)});
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}

export const getUsersAndVendorsData = async (props) => {
    try{
        let response = await axios.get(Url+"user/get-totals", {headers : getHeaders(props)});
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}

export const getBookingData = async (props) => {
    try{
        let response = await axios.get(Url+"service-booking/get-totals", {headers : getHeaders(props)});
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}

export const getAllOfficeLocations = async (props) => {
    try{
        let response = await axios.get(Url+"office/get-all-locations", {headers : getHeaders(props)});
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error', error, error.response);
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}