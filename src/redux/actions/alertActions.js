import { REMOVE_ALERT, SET_ALERT } from '../types/alertTypes'

export const setAlert = (msg, alertType) => (dispatch) => {
	dispatch({
		type: SET_ALERT,
		payload: { msg, alertType },
	})

	setTimeout(() => dispatch({ type: REMOVE_ALERT }), 3000)
}
