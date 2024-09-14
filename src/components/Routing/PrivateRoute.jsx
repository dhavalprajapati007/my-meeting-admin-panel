import React, {useState} from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { authenticateUser } from "../../utils/isAuthenticated"
import { withRouter } from "react-router-dom";
import Sidebar from '../../components/Sidebar/Sidebar'

const PrivateRoute = ({ component: Component, ...rest }) => {
	const [collapsed, setCollapsed] = useState(false);
	return (
	<Route
		{...rest}
		render={(props) =>
			authenticateUser() !== true ? (
				<Redirect to='/login' />
			) : (
				<Sidebar {...props} collapsed={collapsed} setCollapsed={setCollapsed}>
					<Component {...props} collapsed={collapsed}/>
				</Sidebar>
			)
		}
	/>
)}

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.authReducer,
})

export default withRouter(connect(mapStateToProps, null)(PrivateRoute))
