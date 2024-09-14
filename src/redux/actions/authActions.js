import Cookies from 'js-cookie'
import axios from 'axios'
import { setAlert } from './alertActions'
import { SET_LOADER, LOGIN_SUCCESS, LOGIN_FAIL } from '../types/authTypes'
import { toastAlert } from '../../helpers/toastAlert'

//Login user
export const loginUser = (email, password, redirect) => async (dispatch) => {
	dispatch({
		type: SET_LOADER,
		payload: true,
	})
	const body = { email, password }
	const headers = {
			'content-type': 'application/json',
			"access-control-allow-origin" : "*",
	}
	await axios
		.post(
			`${process.env.REACT_APP_PRO_MODE}/api/v1/user/login`,
			body,
			{headers}
		)
		.then((response) => {
			console.log(response,"responseLogin")
			if(response?.data?.statusCode == 200) {
				dispatch({
					type: LOGIN_SUCCESS,
					payload: response.data,
				})
				let loginResponse = response?.data?.data
				Cookies.set('ClaccessToken', loginResponse.tokenData)
				Cookies.set('ClidToken', loginResponse.userData._id)
				Cookies.set('Clemail', loginResponse.userData.email)
				Cookies.set('ClfirstName', loginResponse.userData.firstName)
				Cookies.set('CllastName', loginResponse.userData.lastName)
				Cookies.set('Clstatus', loginResponse.userData.status)
				Cookies.set('Clrole', loginResponse.userData.role)
				Cookies.set('Clmobile', loginResponse.userData.mobile)
				Cookies.set('ClisAuthenticated', true)
				toastAlert(response?.data?.message,"success")
				dispatch({
					type: SET_LOADER,
					payload: false,
				})
				redirect();
			} else {
				let message = response?.data && response?.data?.message !== undefined ? response?.data?.message : "Authentication problem";
                toastAlert(message, "error");
				dispatch({
					type: SET_LOADER,
					payload: false,
				})
				dispatch({
					type: LOGIN_FAIL,
				})
			}
		})
		.catch((err) => {
			console.log('error : ', err);
			console.log('errorMsg', err.message);
			let errorMessage = err.response?.data?.message ? err.response?.data?.message : err.message;
			toastAlert(errorMessage,"error");
			dispatch({
				type: SET_LOADER,
				payload: false,
			})
			dispatch({
				type: LOGIN_FAIL,
			})
		})
}
