import Cookies from 'js-cookie'

export const authenticateUser = () => {
	let token = Cookies.get('ClaccessToken');
    let _id = Cookies.get('ClidToken');
	if (token && _id) {
		return true
	} else {
		return false
	}
}