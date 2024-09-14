import axios from 'axios';
import Cookies from 'js-cookie';
import clearCookies from './clearCookies'

// TODO: Create BASE_URL in .env file and put it here.
// TODO: on error of 401 we need to clear cookies and redirect user to login page.
const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/user/`;

// commented headers which was getting accessToken from cookie
// const headers = {
//     'content-type': 'application/json',
//     'Authorization' : Cookies.get("ClaccessToken")
// }

// made getHeaders function and get the accessToken from props
// props has authData which is stored in redux
const getHeaders = (props) => {
    return {
        'content-type': 'application/json',
        'Authorization' : props?.authData?.accessToken
    }
}

export const getUsers = async (payload,props) => {
    console.log(props,"allProps")
    try{
        if(!payload) return false;
        let body = {
            "page" : payload && payload.page !== undefined ? payload.page : 1,
            "limit" : payload && payload.limit !== undefined ? payload.limit : 10,
            "roles" : payload && payload.role !== undefined ? [payload.role] : [1],
        }
        let response = await axios.post(Url+"list-users",body, { headers : getHeaders(props)});
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

export const getAllVerifiedVendors = async (props) => {
    try{
        let response = await axios.get(Url+"get-all-verified-vendors", {headers : getHeaders(props)});
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

export const getVendors = async (payload,props) => {
    try{
        if(!payload) return false;
        let body;
        if(payload?.hasOwnProperty("page") && payload?.hasOwnProperty("limit")) {
            body = {
                "page" : payload && payload.page !== undefined ? payload.page : 1,
                "limit" : payload && payload.limit !== undefined ? payload.limit : 10,
                "verified" : payload && payload.verified !== undefined ? payload.verified : false,
                "providerType" : payload && payload.providerType !== undefined ? payload.providerType : 2
            }
        } else {
            body = {
                "verified" : payload && payload.verified !== undefined ? payload.verified : false,
                "providerType" : payload && payload.providerType !== undefined ? payload.providerType : 2
            }
        }
        console.log('Body :', body);
        let response = await axios.post(Url+"list-vendors", body, { headers : getHeaders(props)});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error && error.response && error.response.data && error.response.data.statusCode == 400) return error.response.data;
        console.log('errorMessage',error);
        if(error?.response?.data?.statusCode === 401) {
            clearCookies(props);
            // clearCookies() it will clear the cookie and redirect user to lofin page
        }
        return error;
    }
}

export const getVendorDetails = async (payload,props) => {
    try{
        if(!payload) return false;
        let body = {
            "userId" : payload && payload.userId !== undefined ? payload.userId : ""
        }
        let response = await axios.post(Url+"view", body, {headers : getHeaders(props)});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}


export const editPersonalData = async (stateData,props) => {
    try{
        const formData = new FormData();
        formData.append('userId', stateData?.userId);
        formData.append('firstName', stateData?.firstName);
        formData.append('lastName', stateData?.lastName);
        formData.append('mobile', stateData?.mobile);
        formData.append('line1', stateData?.addressLine1);
        formData.append('line2', stateData?.addressLine2);
        formData.append('city', stateData?.city?.name);
        formData.append('state', stateData?.state?.name);
        formData.append('pincode', stateData?.pincode);
        console.log('Form Data ', formData);
        const headers = {
            'content-type': 'multipart/form-data',
            'Authorization' : Cookies.get("ClaccessToken")
        }
        let response = await axios.post(Url+"edit-user-admin", formData, {headers});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}


export const editPersonalDocs = async (stateData,props) => {
    try{
        const key = stateData.imageType === "pan" ? "panCard" 
                : stateData.imageType === "aadharFront" ? "aadharFront"
                : stateData.imageType === "aadharBack" && "aadharBack"
        var formData = new FormData();
        formData.append('userId', stateData?.userId);
        formData.append(key, stateData?.editImage[0]);

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization' : Cookies.get("ClaccessToken")
        }
        let response = await axios.post(Url+"edit-user-admin", formData, {headers});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}

// API showing error for language value, it should check by today 
export const editVendorDetails = async (stateData,props) => {
    try{
        // let langArr = [];
        // stateData?.languages?.length && stateData?.languages?.map((lang) => {
        //     langArr.push(lang._id)
        // })
        // console.log(langArr,"langArr");
        const formData = new FormData();
        formData.append('id', stateData?.userId);
        formData.append('physicalSilver', stateData?.physicalSilverFees);
        formData.append('virtualGold', stateData?.virtualGoldFees);
        formData.append('virtualSilver', stateData?.virtualSilverFees);
        formData.append('instruction', stateData?.instruction);
        formData.append('bio', stateData?.bio);
        formData.append('serviceId', stateData?.service?._id);
        formData.append('available', stateData?.isAvailable?.value);
        stateData?.languages?.length && stateData?.languages?.map((lang) => {
            formData.append('languages[]', lang._id);
        })
        console.log(formData.entries(),"formData")
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ' - ' + pair[1],"formDataPairEntries"); 
        }
        // logic to show formData key and value in console
        const headers = {
            'content-type': 'multipart/form-data',
            'Authorization' : Cookies.get("ClaccessToken")
        }
        let response = await axios.post(`${process.env.REACT_APP_PRO_MODE}/api/v1/vendor-service/edit`, formData, {headers});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}

export const addCertificates = async (stateData,props) => {
    try{
        const formData = new FormData();
        formData.append('id', stateData?.userId);
        formData.append('certificate', stateData?.addImage[0]);
        
        console.log('id', stateData?.userId, 'Certificate', stateData?.editImage);

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization' : Cookies.get("ClaccessToken")
        }

        let response = await axios.post(`${process.env.REACT_APP_PRO_MODE}/api/v1/vendor-service/edit`, formData, {headers});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response, error.response.data.message);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        
        if(error?.response?.data?.statusCode == 400){
            return error?.response?.data?.message;
        }

        return error;
    }
}

export const deleteCertificate = async (stateData,props) => {
    try{
        const body = {
            "userId" : stateData?.userId,
            "certificate_link" : stateData?.deleteImage
        }
        
        console.log(body,"payLoad");

        const headers = {
            'Content-Type': 'application/json',
            'Authorization' : Cookies.get("ClaccessToken")
        }

        let response = await axios.post(`${process.env.REACT_APP_PRO_MODE}/api/v1/vendor-service/remove-certificate`, body , {headers});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response, error.response.data.message);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        
        if(error?.response?.data?.statusCode == 400){
            return error?.response?.data?.message;
        }

        return error;
    }
}

export const verifyVendor = async (id,verify,props) => {
    try{
        let response = await axios.get(`${Url}verify-vendor?vendorId=${id}&verify=${verify}`, {headers : getHeaders(props)});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}

export const deleteVendor = async (vendorId,props) => {
    try{
        let response = await axios.delete(`${Url}delete-vendor?vendorId=${vendorId}`,{headers : getHeaders(props)});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response, error.response.data.message);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        
        return error;
    }
}

export const sendMail = async (payload,props) => {
    try{
        let response = await axios.post(`${Url}send-mail`, payload, { headers : getHeaders(props) });
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response, error.response.data.message);
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}

export const sendNoti = async (payload,props) => {
    try{
        let response = await axios.post(`${Url}send-notification`, payload, { headers : getHeaders(props) });
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    }catch(error){
        console.log('error : ', error, error.response, error.response.data.message);
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}