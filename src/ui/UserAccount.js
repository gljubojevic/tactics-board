import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import SignInDialog from './SignInDialog';

class UserAccount extends Component {
	constructor(props, context) {
		super(props, context);
		this._refSignInDialog = React.createRef();
		this.userOnClick = this.userOnClick.bind(this);
		this.menuOnClose = this.menuOnClose.bind(this);
		this.state = {
			menuOpen: false,
			anchorEl: null
		};
	}

	userOnClick(event) {
		if (!this.props.isSignedIn) {
			this._refSignInDialog.current.Show();
			return;
		}

		this.setState({
			menuOpen: true,
			anchorEl: event.currentTarget
		});
	}

	menuOnClose(event) {
		// read from "data-value" attribute
		const selectedValue = event.currentTarget.dataset.value;
		switch (selectedValue) {
			case "user-info":
				break;
			case "logout":
				this.props.firebaseApp.auth().signOut();
				break;
			default:
				break;
		}
		this.setState({
			menuOpen: false,
			anchorEl: null
		});
	}

	render() {
		let userName = "Please sign in";
		let avatarIcon = (<AccountCircle />);
		let avatarSrc = null;

		if (this.props.isSignedIn) {
			const user = this.props.firebaseApp.auth().currentUser;
			userName = user.displayName;
			if (user.photoURL) {
				avatarSrc = user.photoURL;
				avatarIcon = null;
			}
		}

		return (
			<React.Fragment>
				<Tooltip title={userName}>
					<IconButton ref={this._refMenu} aria-label="User" color="inherit" onClick={this.userOnClick}>
						<Avatar src={avatarSrc}>{avatarIcon}</Avatar>
					</IconButton>
				</Tooltip>
				<Menu open={this.state.menuOpen} anchorEl={this.state.anchorEl} onClose={this.menuOnClose}
					PaperProps={{
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					}}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
					<MenuItem data-value="user-info" onClick={this.menuOnClose}>
						<Avatar src={avatarSrc}>{avatarIcon}</Avatar>{userName}
					</MenuItem>
					<Divider />
					<MenuItem data-value="logout" onClick={this.menuOnClose}>
						<ListItemIcon><Logout fontSize="small" /></ListItemIcon>Logout
					</MenuItem>
				</Menu>
				<SignInDialog ref={this._refSignInDialog} firebaseApp={this.props.firebaseApp} />
			</React.Fragment>
		);
	}
}

UserAccount.defaultProps = {
	firebaseApp: null,
	isSignedIn: false
}

UserAccount.propTypes = {
	firebaseApp: PropTypes.object,
	isSignedIn: PropTypes.bool
}

export default UserAccount;