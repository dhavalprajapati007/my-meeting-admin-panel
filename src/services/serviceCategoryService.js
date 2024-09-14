import axios from 'axios';
import Cookies from 'js-cookie';
import { toastAlert } from '../helpers/toastAlert';
import clearCookies from './clearCookies'

// TODO: Create BASE_URL in .env file and put it here.
const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/service/`;
const headers = {
    'content-type': 'application/json',
    'Authorization' : Cookies.get("ClaccessToken")
}

export const getServiceCategory = async (props) => {
    try{
        let response = await axios.get(Url+"getall", {headers});
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


export const addServiceCategory = async (props, thisEvt) => { 
    try{
        const formData = new FormData();
        let image =  thisEvt.state?.imageName
        image?.length && image?.map((val) => formData.append('image', val));
        formData.append('name', thisEvt.state?.category);
        formData.append('description', thisEvt.state?.description);
        formData.append('parentId', thisEvt.state?.parentCategory?._id 
        ? thisEvt.state?.parentCategory?._id : "" );

        const headers = {
                'content-type': 'multipart/form-data',
                'Authorization' : Cookies.get("ClaccessToken")
        }
        
        let response = await axios.post(Url+"add", formData, {headers});
        if(response && response.status == 200) return response.data;
        return response;
    } catch(error) {
        console.log('error', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        } 
        // return error.response.data;
        return error;
    }
}

export const editServiceCategory = async (props, thisEvt) => { 
    try{
        const formData = new FormData();
        // let image =  thisEvt.state?.editImageName
        // image?.length && image?.map((val) => formData.append('image', val));
        formData.append('name', thisEvt.state?.editCategory);
        formData.append('image', typeof thisEvt.state?.editImageName === "string" ? thisEvt.state?.editImageName : thisEvt.state?.editImageName[0]);
        formData.append('description', thisEvt.state?.editDescription);
        formData.append('parent', thisEvt.state?.editParentCategory?._id ? thisEvt.state?.editParentCategory?._id : "");
        formData.append('id', thisEvt.state?.selectedId);

        const headers = {
                'content-type': 'multipart/form-data',
                'Authorization' : Cookies.get("ClaccessToken")
        }
        
        let response = await axios.put(Url+"update", formData, {headers});
        if(response && response.status == 200) return response.data;
        return response;
    } catch(error) {
        console.log('error', error, error.response);
        // TODO: handle error better in an seprate function.
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(props);
        } 
        // return error.response.data;
        return error;
    }
}

const getParentCategory = (data, thisEvt) => {
    if(data.hasOwnProperty("parent") && data.parent) {
        thisEvt?.state?.data?.length > 0 && 
        thisEvt?.state?.data?.map((service) => {
            if(service?._id.trim() === data.parent.trim()) {
                thisEvt.setState({
                    editParentCategory : service
                })        
            }
        })
    } else {
        thisEvt.setState({
            parentCategory : ""
        })
    }
}

export const getSingleService = (value, thisEvt) => {
    console.log(value,"singleValue");
    console.log(thisEvt.state,"thisEvent");

    axios.get(`${Url}get?id=${value.id}`,{headers})
    .then(res => {
        console.log(res);
        if(res && res.status == 200) {
            getParentCategory(res.data?.data, thisEvt);
            thisEvt.setState({
                editModal : true,
                selectedId : value.id,
                editCategory : res.data.data.name,
                editDescription : res.data.data.description,
                editImageName : res.data.data.image
            })
        }
    }).catch(error => {
        console.log('error', error, error.response);
        toastAlert(error?.response?.data?.message ? error?.response?.data?.message : "Problem while fetching data","error")
        // TODO: handle error better in an seprate function.
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(thisEvt.props);
        } 
        // return error.response.data;
        return error; 
    })
}

export const deleteServiceCategory = (value, thisEvt) => {
    // console.log(thisEvt,"this")
    axios.delete(`${Url}delete?id=${value}`,{headers})
    .then(res => {
        console.log(res);
        if(res && res.status == 200) {
            toastAlert(res?.data?.message ? res?.data?.message : "Service category deleted successfully","success")
        }
        thisEvt.getAllServices()
    }).catch(error => {
        console.log('error', error, error.response);
        toastAlert(error?.response?.data?.message ? error?.response?.data?.message : "Error while delete service category","error")

        // TODO: handle error better in an seprate function.
        if(error && error.response && error.response.data && error.response.data.statusCode == 401) {
            clearCookies(thisEvt.props);
        } 
        // return error.response.data;
        return error; 
    })
}

export const handleClick = (thisEvt) => {
    thisEvt.setState({
        editModal: !thisEvt.state.editModal,
        editCategory: "",
        editDescription: "",
        editImageName: [],
        editError: [],
        editParentCategory : ""
    })
}

export const toggleModal = (thisEvt) => {
    thisEvt.setState({
        modal: !thisEvt.state.modal,
        category: "",
        description: "",
        imageName: [],
        error: [],
        parentCategory : ""
    })
}


export const handleDrop = (acceptedFiles,thisEvt) => {
    thisEvt.setState({
        imageName: acceptedFiles
    })
}

export const handleEditDrop = (acceptedFiles,thisEvt) => {
    thisEvt.setState({
        editImageName: acceptedFiles
    })
}

export const handleChange = (e,thisEvt) => {
    thisEvt.setState({
        [e.target.name]: e.target.value
    })
}