import axios from 'axios';
import Cookies from 'js-cookie';
import { toastAlert } from '../helpers/toastAlert';
import clearCookies from './clearCookies'

// TODO: Create BASE_URL in .env file and put it here.
// TODO: on error of 401 we need to clear cookies and redirect user to login page.
const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/aminitie/`;
const headers = {
    'content-type': 'application/json',
    'Authorization' : Cookies.get("ClaccessToken")
}

export var getAmenities = async (props) => {
    try{
        let response = await axios.get(Url+"getall",{headers});
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

export const addAmenity = async (props, thisEvt) => { 
    try{
        const formData = new FormData();
        let image =  thisEvt.state?.imageName
        image?.length && image?.map((val) => formData.append('image', val));
        formData.append('name', thisEvt.state?.amenityName);

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

export const editAmenity = async (props, thisEvt) => { 
    try{
        const formData = new FormData();
        formData.append('name', thisEvt.state?.editAmenityName);
        formData.append('image', thisEvt.state?.editImageName[0]);
        formData.append('id', thisEvt.state.amenityId);

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

export const getSingleAmenity = (value,thisEvt) => {
    console.log(value);
    console.log(thisEvt);
    thisEvt.state?.data && thisEvt.state?.data?.map((data) => {
        if(data._id === value) {
            thisEvt.setState({
                amenityId : value,
                editAmenityName : data.name,
                editImageName : data.image,
                editModal: !thisEvt.state.editModal,
            })
        }
    })
}

export const deleteAmenity = (value,thisEvt) => {
    axios.delete(`${Url}delete?id=${value}`,{headers})
    .then(res => {
        console.log(res);
        if(res && res.status == 200) {
            toastAlert(res?.data?.message ? res?.data?.message : "Amenity deleted successfully","success")
        }
        thisEvt.getAllAmenities()
    }).catch(error => {
        console.log('error', error, error.response);
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
        editImageName: [],
        editError: [],
        editAmenityName: ""
    })
}

export const toggleModal = (thisEvt) => {
    thisEvt.setState({
        modal: !thisEvt.state.modal,
        amenityName: "",
        imageName: [],
        error: []
    })
}

export const handleDrop = (acceptedFiles,thisEvt) => {
    console.log(acceptedFiles,"acceptedFiles")
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