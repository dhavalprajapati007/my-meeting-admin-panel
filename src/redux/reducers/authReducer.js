import { LOGIN_FAIL, LOGIN_SUCCESS, SET_LOADER } from '../types/authTypes'
import Cookies from 'js-cookie'

const initialState = {
	accessToken: Cookies.get('ClaccessToken') || null,
	idToken: Cookies.get('ClidToken') || null,
	email: Cookies.get('Clemail') || null,
	firstName : Cookies.get('ClfirstName') || null,
	lastName : Cookies.get('CllastName') || null,
	status: Cookies.get('Clstatus') || null,
	role : Cookies.get('Clrole') || null,
	mobile: Cookies.get('Clmobile') || null,
	isAuthenticated: Cookies.get('ClisAuthenticated') || false,
	message: null,
}

const authReducer = (state = initialState, action) => {
	const { type, payload } = action

	switch (type) {
		case SET_LOADER:
			return { ...state, loading: payload }
		case LOGIN_SUCCESS:
			return { ...payload, loading: false, isAuthenticated: true, idToken : payload?.data?.userData?._id, status : payload?.data?.userData?.status, role : payload?.data?.userData?.role, accessToken : payload?.data?.tokenData}
		case LOGIN_FAIL:
			return { ...initialState, loading: false, isAuthenticated: false }
		default:
			return state
	}
}

export default authReducer
