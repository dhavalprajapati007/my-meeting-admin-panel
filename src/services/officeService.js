import axios from 'axios';
import clearCookies from './clearCookies'


// TODO: Create BASE_URL in .env file and put it here.
const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/office/`;
const getHeaders = (props) => {
    console.log(props,"officeProps")
    return {
        'content-type': 'application/json',
        'Authorization' : props?.authData?.accessToken
    }
}

export var getOffices = async (payload,props) => {
    try{
        if(!payload) return false;
        let body = {
            "page" : payload && payload.page !== undefined ? payload.page : 1,
            "limit" : payload && payload.limit !== undefined ? payload.limit : 10,
            "verified" : payload && payload.verified !== undefined ? payload.verified : false,
        }
        let response = await axios.post(Url+"get-all",body, {headers : getHeaders(props)} );
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

export var getOfficeDetail = async (payload, props) => {
    try{
        if(!payload) return false;
        // let body = {
        //     "page" : payload && payload.page !== undefined ? payload.page : 1,
        //     "limit" : payload && payload.limit !== undefined ? payload.limit : 10,
        //     "verified" : payload && payload.verified !== undefined ? payload.verified : false,
        // }
        let response = await axios.get(Url+"get?id="+payload,{}, {headers : getHeaders(props)} );
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

export const editOfficeDetails = async (stateData,props) => {
    console.log(stateData,"stateData")
    try{
        let body = {
            id : stateData?.id,
            // userId : stateData?.userId,
            name : stateData?.officeName,
            officeContactNumber : stateData?.officeNumber,
            representativeDetails : {
                name : stateData?.representativeName,
                number : stateData?.representativeNumber
            },
            isKycCompleted : stateData?.isVerified?.value,
            officeType : stateData?.officeType?.value,
            address : {
                line1 : stateData?.addressLine1,
                line2 : stateData?.addressLine2,
                state : stateData?.state?.name,
                city : stateData?.city?.name,
                pincode : stateData?.pincode,
            },
            workingDays : stateData?.editWorkingDays
        }
        console.log(body,"payLoad")
        let response = await axios.put(`${process.env.REACT_APP_PRO_MODE}/api/v1/office/update`, body, {headers : getHeaders(props)});
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

export const editCabinDetails = async (body,props) => {
    console.log(body,"payLoad")
    try {
        let response = await axios.put(`${process.env.REACT_APP_PRO_MODE}/api/v1/office/updateCabin`, body, {headers : getHeaders(props)});
        console.log('response : => ', response, response.message, response.data.statusCode, response.data.message);
        if(response && response.status == 200) return response.data;
        return response;
    } catch(error){
        console.log('error : ', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error?.response?.data?.statusCode == 401) {
            clearCookies(props);
        }
        return error;
    }
}

export const deleteCabinImage = async (stateData,props) => {
    try{
        const body = {
            "id" : stateData?.cabinId,
            "image_link" : stateData?.deleteImageLink
        }
        
        console.log(body,"payLoad");
        let response = await axios.post(`${process.env.REACT_APP_PRO_MODE}/api/v1/office/delete-cabin-image`, body , {headers : getHeaders(props)});
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

export const deleteOffice = async (officeId,props) => {
    try{
        let response = await axios.delete(`${Url}delete?id=${officeId}`,{headers : getHeaders(props)});
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