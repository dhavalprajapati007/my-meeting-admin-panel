import axios from 'axios';
import Cookies from 'js-cookie';
import { toastAlert } from '../helpers/toastAlert';
import clearCookies from './clearCookies'

// TODO: Create BASE_URL in .env file and put it here.
const Url = `${process.env.REACT_APP_PRO_MODE}/api/v1/language/`;
const headers = {
    'content-type': 'application/json',
    'Authorization' : Cookies.get("ClaccessToken")
}

export const getLanguages = async (props) => {
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


export const addLang = async (props, thisEvt) => { 
    try{
        let body = {
            "name" : thisEvt.state?.languageName,
        }
        let response = await axios.post(Url+"add",body, {headers});
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

export const editLang = async (props, thisEvt) => {
    try{
        let body = {
            "name" : thisEvt.state?.editLanguageName,
            "id" : thisEvt.state?.langId
        }
        let response = await axios.put(Url+"update",body, {headers});
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

export const getSingleLang = (value,thisEvt) => {
    // console.log(thisEvt.props)
    thisEvt.state.data && thisEvt.state.data.map((data) => {
        if(data._id === value) {
            thisEvt.setState({
                langId : value,
                editLanguageName : data.name,
                editModal: !thisEvt.state.editModal,
            })
        }
    })
}

export const deleteLang = (value, thisEvt) => {
    axios.delete(`${Url}delete?id=${value}`,{headers})
    .then(res => {
        console.log(res);
        if(res && res.status == 200) {
            toastAlert(res?.data?.message ? res?.data?.message : "Language deleted successfully","success")
        }
        thisEvt.getAllLang()
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
        editError: [],
        editLanguageName: ""
    })
}

export const toggleModal = (thisEvt) => {
    thisEvt.setState({
        modal: !thisEvt.state.modal,
        error: [],
        languageName: ""
    })
}


export const handleChange = (e,thisEvt) => {
    thisEvt.setState({
        [e.target.name]: e.target.value
    })
}