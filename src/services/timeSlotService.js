import axios from 'axios';
import Cookies from 'js-cookie';
import clearCookies from './clearCookies'

// TODO: Create BASE_URL in .env file and put it here.
// TODO: on error of 401 we need to clear cookies and redirect user to login page.
const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/vendor-timeslot`;
const headers = {
    'content-type': 'application/json',
    'Authorization' : Cookies.get("ClaccessToken")
}

export const getSlots = async (payload,props) => {
    try{
        if(!payload) return false;
        let body = {
            "interval" : payload && payload.interval !== undefined && payload.interval,
            "sessionTime" : payload && payload.sessionTime !== undefined && payload.sessionTime,
        }
        let response = await axios.post(Url+"/create-available-slots",body, {headers});
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

export var editSlots = async (payload,props) => {
    try{
        if(!payload) return false;
        let body = {
            "interval" : payload && payload.interval !== undefined && payload.interval,
            "sessionTime" : payload && payload.sessionTime !== undefined && payload.sessionTime,
            "availableSlots" : payload && payload.availableSlots !== undefined && payload.availableSlots,
            "id" : payload && payload?.id !== undefined && payload?.id,
        }
        let response = await axios.put(Url+"/edit",body, {headers});
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